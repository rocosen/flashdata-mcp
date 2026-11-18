import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runCapability, resultRows } from '../src/run.js';

const definitions = JSON.parse(await readFile(new URL('../definitions.json', import.meta.url)));
const key = 'fd_local_fixture_only';
function harness(definition, input, replies, options = {}) {
  const values = new Map(); const rows = []; const calls = [];
  const store = { getValue: async name => values.get(name), setValue: async (name, value) => { values.set(name, structuredClone(value)); } };
  const dataset = { pushData: async items => { rows.push(...items); } };
  const tools = { list: async () => ({ tools: [{ name: definition.source }, { name: 'get_job' }] }),
    call: async request => { calls.push(structuredClone(request)); const next = replies.shift();
      if (next instanceof Error) throw next;
      if (!next) throw new Error('Unexpected request');
      return next;
    } };
  const execute = () => runCapability({ definition, input: { flashdataApiKey: key, ...input }, store, dataset,
    makeTools: () => tools, ...options });
  return { execute, values, rows, calls, tools, store, dataset };
}
const success = response => ({ structuredContent: { http_status: 200, request_id: 'req_fixture', ...response }, isError: false });

for (const definition of definitions.filter(item => item.source !== 'youtube_download')) {
  test(`${definition.source}: correct capability, result rows and saved full response`, async () => {
    const row = definition.sample;
    const first = definition.rows === 'suggestions' ? [row.suggestion]
      : definition.rows === 'object' ? row
        : { [definition.rows]: [row], fullText: 'Full text retained', videoId: 'abcdefghijk', channelId: 'channel_example' };
    const run = harness(definition, definition.example, [success({ status: 'done', results: [first], usage: { credits: 0.01 } })]);
    assert.equal((await run.execute()).status, 'completed');
    assert.equal(run.calls.length, 1);
    assert.equal(run.calls[0].name, definition.source);
    assert.deepEqual(run.calls[0].arguments, definition.example);
    assert.equal(run.rows.length, 1);
    assert.deepEqual(run.values.get('OUTPUT').response.results, [first]);
    assert.equal((await run.execute()).reused, true);
    assert.equal(run.calls.length, 1);
  });
}
const search = definitions.find(item => item.source === 'youtube_search');
const extended = definitions.find(item => item.source === 'youtube_search_extended');
test('standard 20 / extended 700 limits and complete large result are preserved', async () => {
  const invalid = harness(search, { query: 'research', max_results: 21 }, []);
  await assert.rejects(invalid.execute()); assert.equal(invalid.calls.length, 0);
  const videos = Array.from({ length: 700 }, (_, i) => ({ videoId: `id${i}`, title: 'A'.repeat(100) }));
  const run = harness(extended, { query: 'research', max_results: 700 }, [success({ results: [{ results: videos }] })]);
  await run.execute(); assert.equal(run.rows.length, 700);
  assert.equal(run.values.get('OUTPUT').response.results[0].results.length, 700);
});
test('empty input, invalid key, unknown fields and invalid filters fail before network calls', async () => {
  for (const input of [{ query: ' ' }, { query: 'ok', flashdataApiKey: 'PLACEHOLDER' },
    { query: 'ok', maxCredits: 1 }, { query: 'ok', filters: { unexpected: true } }]) {
    const run = harness(search, input, []);
    await assert.rejects(run.execute()); assert.equal(run.calls.length, 0);
  }
});
test('authentication and source permission failure do not submit work', async () => {
  for (const list of [async () => { throw new Error('private transport config'); }, async () => ({ tools: [] })]) {
    const run = harness(search, { query: 'research' }, []); run.tools.list = list;
    await assert.rejects(run.execute()); assert.equal(run.calls.length, 0); assert.equal(run.values.size, 0);
  }
});
test('lost response, upstream error and dataset failure never repeat the paid request', async () => {
  for (const mode of ['lost','upstream','dataset']) {
    const reply = mode === 'lost' ? new Error('Lost connection') : mode === 'upstream'
      ? { structuredContent: { code: 'query_outcome_unknown' }, isError: true }
      : success({ results: [{ results: [{ title: 'result' }] }] });
    const run = harness(search, { query: 'research' }, [reply]);
    if (mode === 'dataset') run.dataset.pushData = async () => { throw new Error('storage full'); };
    await assert.rejects(run.execute()); await assert.rejects(run.execute());
    assert.equal(run.calls.length, 1);
  }
});
test('failure to persist attempt stops before paid request', async () => {
  const run = harness(search, { query: 'research' }, []);
  run.store.setValue = async () => { throw new Error('unavailable'); };
  await assert.rejects(run.execute()); assert.equal(run.calls.length, 0);
});
test('unexpected shapes fail; real empty result lists are allowed', () => {
  assert.throws(() => resultRows(search, { results: [{ results: 'invalid' }] }));
  assert.deepEqual(resultRows(search, { results: [{ results: [] }] }), []);
  assert.throws(() => resultRows(search, {}));
});
const download = definitions.find(item => item.source === 'youtube_download');
const storage = { storage_type: 's3', storage_url: 'example-bucket', access_key: 'access_secret_fixture', secret_key: 'storage_secret_fixture', region: 'us-east-1' };
const downloadInput = { video_id: 'abcdefghijk', storageJson: JSON.stringify(storage), waitSeconds: 0 };
const pending = success({ job: { id: 'job_fixture', source: 'youtube_download', status: 'pending' } });
const complete = success({ job: { id: 'job_fixture', source: 'youtube_download', status: 'completed' },
  output: { results: [{ file_url: 'https://example.com/private-file.mp4', file_size: 1234 }] } });
test('download submits once, retains job ID, continues read-only and saves delivery manifest', async () => {
  const run = harness(download, downloadInput, [success({ id: 'job_fixture', status: 'pending' }), pending, complete]);
  assert.equal((await run.execute()).status, 'pending');
  assert.equal(run.values.get('REQUEST_STATE').jobId, 'job_fixture');
  assert.equal(run.rows.length, 0);
  assert.equal((await run.execute()).status, 'completed');
  assert.deepEqual(run.calls.map(call => call.name), ['youtube_download','get_job','get_job']);
  assert.deepEqual(run.calls[0].arguments.storage, storage);
  assert.equal(run.rows[0].file_size, 1234);
});
test('existing download job requires no storage and never submits', async () => {
  const run = harness(download, { jobId: 'job_fixture', waitSeconds: 0 }, [complete]);
  await run.execute(); assert.deepEqual(run.calls.map(call => call.name), ['get_job']);
});
test('download missing storage, invalid provider and ambiguous resume input are rejected locally', async () => {
  for (const input of [{ video_id: 'abcdefghijk' }, { ...downloadInput, storageJson: '{bad' },
    { ...downloadInput, storageJson: '{"storage_type":"bad"}' }, { ...downloadInput, jobId: 'job_fixture' }]) {
    const run = harness(download, input, []); await assert.rejects(run.execute()); assert.equal(run.calls.length, 0);
  }
});
test('download read failure retains job ID and allows retrying only the existing job', async () => {
  const run = harness(download, downloadInput, [success({ id: 'job_fixture' }),
    { structuredContent: { job: { status: 'completed' }, code: 'result_unavailable' }, isError: true }, complete]);
  await assert.rejects(run.execute()); assert.equal(run.values.get('REQUEST_STATE').jobId, 'job_fixture');
  await run.execute(); assert.equal(run.calls.filter(call => call.name === 'youtube_download').length, 1);
});
test('download polling has a bounded deadline', async () => {
  let time = 0;
  const run = harness(download, { ...downloadInput, waitSeconds: 5 }, [success({ id: 'job_fixture' }), pending, pending],
    { now: () => time, sleep: async ms => { time += ms; } });
  assert.equal((await run.execute()).status, 'pending'); assert.equal(time, 5000);
  assert.equal(run.calls.length, 3);
});
test('API and customer-storage secrets are redacted from persisted output and dataset', async () => {
  const response = structuredClone(complete);
  response.structuredContent.output.results[0].message = `${key} ${storage.access_key} ${storage.secret_key}`;
  response.structuredContent.output.results[0].params = { storage };
  const run = harness(download, downloadInput, [success({ id: 'job_fixture' }), response]);
  await run.execute();
  const saved = JSON.stringify([...run.values.entries()]) + JSON.stringify(run.rows);
  for (const secret of [key, storage.access_key, storage.secret_key]) assert.ok(!saved.includes(secret));
});
