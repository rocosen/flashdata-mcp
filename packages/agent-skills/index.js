import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const entries = JSON.parse(readFileSync(join(root, 'skills.json'), 'utf8'));

function forwardKey(env) {
  if (process.env.FLASHDATA_API_KEY) env.FLASHDATA_API_KEY = process.env.FLASHDATA_API_KEY;
}

export default {
  id: 'flashdata.skills',
  async server() {
    return {
      async config(config) {
        config.skills ??= {};
        config.skills.paths ??= [];
        const path = join(root, 'skills');
        if (!config.skills.paths.includes(path)) config.skills.paths.push(path);
      },
      'shell.env': async (_input, output) => forwardKey(output.env),
    };
  },
  async setup(ctx) {
    const skills = entries.map(entry => {
      const path = join(root, 'skills', entry.name, 'SKILL.md');
      const raw = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
      const end = raw.indexOf('\n---\n', 4);
      if (!raw.startsWith('---\n') || end < 0) throw new Error(`Invalid bundled Skill: ${entry.name}`);
      return {id: entry.name, name: entry.name, description: entry.description, path, content: raw.slice(end + 5).trim()};
    });
    await ctx.skill.transform(editor => {
      for (const skill of skills) editor.add(skill);
    });
    await ctx.shell.hook('create.before', event => forwardKey(event.env));
  },
};
