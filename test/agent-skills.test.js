const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const root = path.resolve(__dirname, '../packages/agent-skills');
const load = () => import(pathToFileURL(path.join(root, 'index.js')));

test('v1 preserves existing Skills and shell environment, with no default key', async () => {
  const {default: plugin} = await load();
  const hooks = await plugin.server();
  const config = {skills: {paths: ['/existing/skills'], urls: ['https://example.com/skills']}};
  await hooks.config(config);
  await hooks.config(config);
  assert.deepEqual(config.skills.paths, ['/existing/skills', path.join(root, 'skills')]);
  assert.deepEqual(config.skills.urls, ['https://example.com/skills']);
  const prior = process.env.FLASHDATA_API_KEY;
  try {
    delete process.env.FLASHDATA_API_KEY;
    const output = {env: {PRESERVED: 'yes'}};
    await hooks['shell.env']({}, output);
    assert.deepEqual(output.env, {PRESERVED: 'yes'});
    process.env.FLASHDATA_API_KEY = 'non-secret-fixture';
    await hooks['shell.env']({}, output);
    assert.deepEqual(output.env, {PRESERVED: 'yes', FLASHDATA_API_KEY: 'non-secret-fixture'});
  } finally {
    if (prior === undefined) delete process.env.FLASHDATA_API_KEY;
    else process.env.FLASHDATA_API_KEY = prior;
  }
});

test('v2 registers all task Skills synchronously and keeps references readable', async () => {
  const {default: plugin} = await load();
  const entries = JSON.parse(fs.readFileSync(path.join(root, 'skills.json'), 'utf8'));
  const {tasks} = require('../npm/tasks.json');
  let transform;
  let shellHook;
  await plugin.setup({
    skill: {transform: async fn => {transform = fn;}},
    shell: {hook: async (name, fn) => {assert.equal(name, 'create.before'); shellHook = fn;}},
  });
  assert.equal(typeof shellHook, 'function');
  for (let pass = 0; pass < 2; pass++) {
    const skills = [];
    assert.equal(transform({add: skill => skills.push(skill)}), undefined);
    assert.equal(skills.length, 15);
    assert.deepEqual(skills.map(s=>s.name), entries.map(s=>s.name));
    assert.deepEqual(entries.map(s=>s.source), tasks.map(t=>t.source));
    for (const skill of skills) {
      assert.equal(skill.id, skill.name);
      assert.ok(skill.content.length > 0);
      const dir = path.dirname(skill.path);
      assert.ok(fs.readFileSync(path.join(dir, 'references/api.md'), 'utf8').includes('Credits'));
      assert.ok(JSON.parse(fs.readFileSync(path.join(dir, 'references/query.json'), 'utf8')));
    }
  }
});
