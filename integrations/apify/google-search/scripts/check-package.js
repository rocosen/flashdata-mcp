import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import catalog from '@flashdata-dev/mcp/catalog';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async name => JSON.parse(await readFile(path.join(root, name), 'utf8'));
const actor = await readJson('.actor/actor.json');
for (const target of [actor.dockerfile, actor.readme, actor.input, actor.output, actor.storages.dataset]) {
  await access(path.resolve(root, '.actor', target));
}
const schema = await readJson('.actor/input_schema.json');
const source = catalog.SOURCE_CATALOG.find(item => item.id === 'google_search');
for (const [field, expected] of Object.entries(source.inputSchema.properties)) {
  for (const key of ['type', 'minimum', 'maximum', 'minLength', 'maxLength', 'pattern']) {
    if (expected[key] !== undefined) assert.deepEqual(schema.properties[field][key], expected[key], `${field}.${key}`);
  }
}
assert.equal(schema.properties.flashdataApiKey.isSecret, true);
assert.equal(schema.properties.flashdataApiKey.default, undefined);
assert.equal(schema.properties.flashdataApiKey.prefill, undefined);
assert.equal(schema.properties.operation.default, 'quote');
assert.equal(schema.properties.maxCredits.default, 0);
assert.ok(schema.required.includes('flashdataApiKey'));
assert.ok(schema.required.includes('query'));
const output = await readJson('.actor/output_schema.json');
assert.equal(output.actorOutputSchemaVersion, 1);
for (const definition of Object.values(output.properties)) assert.equal(definition.type, 'string');
assert.equal(output.properties.response.template, '{{links.apiDefaultKeyValueStoreUrl}}/records/OUTPUT');
const packageJson = await readJson('package.json');
const lock = await readJson('package-lock.json');
assert.deepEqual(lock.packages[''].dependencies, packageJson.dependencies);
console.log('Actor file references, Google Search input contract, protected key, quote defaults and dependency lock verified.');
