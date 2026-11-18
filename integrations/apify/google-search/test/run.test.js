import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import flashdata from '@flashdata-dev/mcp';
import { runSearch } from '../src/run.js';

const secret = `fd_test_${'a'.repeat(43)}`;
const input = { flashdataApiKey: secret, query: 'fixture query' };

function storage() {
  const values = new Map();
  const rows = [];
  return {
    values, rows,
    store: {
      async getValue(key) { return values.has(key) ? structuredClone(values.get(key)) : null; },
      async setValue(key, value) { values.set(key, structuredClone(value)); },
    },
    dataset: { async pushData(items) { rows.push(...structuredClone(items)); } },
  };
}

async function fixture(t) {
  const requests = [];
  const unitPrice = 0.02;
  let permission = true;
  let authenticated = true;
  let lostResponse = false;
  let empty = false;
  const server = http.createServer(async (req, res) => {
    let text = '';
    for await (const chunk of req) text += chunk;
    const body = text ? JSON.parse(text) : null;
    requests.push({ method: req.method, path: req.url, key: req.headers['x-api-key'], body });
    res.setHeader('Content-Type', 'application/json');
    if (req.url === '/v2/api-access') {
      if (!authenticated) { res.statusCode = 401; return res.end('{}'); }
      return res.end(JSON.stringify({ sources: permission ? ['google_search'] : [], result_origin: null }));
    }
    if (req.url === '/v1/queries/realtime') {
      if (lostResponse) return req.socket.destroy();
      return res.end(JSON.stringify({ status: 'done', results: [{ organic: empty ? [] : [{
        position: 1, title: 'Fixture', link: 'https://example.com/', snippet: secret,
      }], knowledgeGraph: { title: 'Preserve other SERP fields' } }], usage: { credits: unitPrice } }));
    }
    res.statusCode = 404; res.end('{}');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
  const origin = `http://127.0.0.1:${server.address().port}`;
  return {
    requests,
    makeTools: config => flashdata.createLocalTools({ ...config, dataOrigin: origin, managementOrigin: origin }, { taskSource: 'google_search' }),
    authenticate: value => { authenticated = value; },
    permit: value => { permission = value; },
    loseResponse: () => { lostResponse = true; },
    emptyResults: () => { empty = true; },
  };
}

test('key and query perform one search without a price read; preserve results and usage; same run never charges twice', async t => {
  const api = await fixture(t);
  const state = storage();
  assert.deepEqual(await runSearch({ input, ...state, makeTools: api.makeTools }), { status: 'completed', count: 1 });
  const paid = api.requests.filter(request => request.method === 'POST');
  assert.equal(paid.length, 1);
  assert.equal(paid[0].key, secret);
  assert.deepEqual(paid[0].body, { source: 'google_search', query: input.query, params: { num: 10, page: 1 } });
  assert.equal(state.values.get('OUTPUT').response.usage.credits, 0.02);
  assert.equal(state.values.get('OUTPUT').response.results[0].knowledgeGraph.title, 'Preserve other SERP fields');
  assert.equal(state.rows[0].snippet, '[REDACTED]');
  assert.equal(state.values.has('QUOTE'), false);
  assert.equal(api.requests.some(request => request.path.includes('/pricing')), false);
  assert.ok(!JSON.stringify([...state.values, state.rows]).includes(secret));
  const count = api.requests.length;
  assert.equal((await runSearch({ input, ...state, makeTools: api.makeTools })).reused, true);
  assert.equal(api.requests.length, count);
  assert.equal(state.rows.length, 1);
  await assert.rejects(runSearch({ input: { ...input, query: 'changed' }, ...state, makeTools: api.makeTools }), /different input/);
});

test('invalid or revoked keys and missing source permission stop before a search', async t => {
  const api = await fixture(t);
  api.authenticate(false);
  const state = storage();
  await assert.rejects(runSearch({ input, ...state, makeTools: api.makeTools }), /Could not verify.*No search was submitted/);
  assert.equal(state.values.has('REQUEST_STATE'), false);
  api.authenticate(true);
  api.permit(false);
  await assert.rejects(runSearch({ input, ...storage(), makeTools: api.makeTools }), /needs Google Search permission.*No search was submitted/);
  assert.equal(api.requests.filter(request => request.method === 'POST').length, 0);
});

test('required input, placeholder keys and unsupported fields fail before accessing any service', async () => {
  const badInputs = [null, { ...input, num: 0 }, { ...input, query: '' }, { ...input, query: '   ' },
    { ...input, query: undefined }, { ...input, flashdataApiKey: undefined },
    { ...input, flashdataApiKey: 'YOUR_FLASHDATA_API_KEY' }, { ...input, flashdataApiKey: '' }, { ...input, mode: 'async' },
    { ...input, baseUrl: 'https://untrusted.example' }, { ...input, source: 'youtube_download' }];
  for (const value of badInputs) {
    let calls = 0;
    await assert.rejects(runSearch({ input: value, ...storage(), makeTools: () => { calls++; throw new Error('Unexpected client'); } }));
    assert.equal(calls, 0);
  }
});

test('saved quote or budget inputs cannot silently turn into a paid search', async () => {
  for (const previous of [{ operation: 'quote', maxCredits: 0 }, { operation: 'search', maxCredits: 0.03 }, { maxCredits: 0 }]) {
    let calls = 0;
    await assert.rejects(runSearch({ input: { ...input, ...previous }, ...storage(),
      makeTools: () => { calls++; throw new Error('Unexpected client'); } }), /old price-check workflow/);
    assert.equal(calls, 0);
  }
});

test('lost paid response is never retried, including resurrection of the same run', async t => {
  const api = await fixture(t);
  api.loseResponse();
  const state = storage();
  await assert.rejects(runSearch({ input, ...state, makeTools: api.makeTools }), /outcome is unknown/);
  assert.equal(state.values.get('OUTPUT').response.code, 'query_outcome_unknown');
  assert.equal(api.requests.filter(request => request.method === 'POST').length, 1);
  await assert.rejects(runSearch({ input, ...state, makeTools: api.makeTools }), /already attempted/);
  assert.equal(api.requests.filter(request => request.method === 'POST').length, 1);
});

test('failure to save the pre-submission record prevents the paid request', async t => {
  const api = await fixture(t);
  const state = storage();
  const save = state.store.setValue;
  state.store.setValue = async (key, value) => {
    if (key === 'REQUEST_STATE') throw new Error('Storage fixture unavailable');
    return save(key, value);
  };
  await assert.rejects(runSearch({ input, ...state, makeTools: api.makeTools }), /Storage fixture/);
  assert.equal(api.requests.filter(request => request.method === 'POST').length, 0);
});

test('failed dataset export leaves the complete response recoverable and prevents resubmission', async t => {
  const api = await fixture(t);
  const state = storage();
  state.dataset.pushData = async () => { throw new Error('Dataset fixture unavailable'); };
  await assert.rejects(runSearch({ input, ...state, makeTools: api.makeTools }), /Dataset fixture/);
  assert.equal(state.values.get('OUTPUT').response.results[0].organic.length, 1);
  await assert.rejects(runSearch({ input, ...state, makeTools: api.makeTools }), /already attempted/);
  assert.equal(api.requests.filter(request => request.method === 'POST').length, 1);
});

test('a completed empty organic response is valid and retains the other SERP content', async t => {
  const api = await fixture(t);
  api.emptyResults();
  const state = storage();
  assert.deepEqual(await runSearch({ input, ...state, makeTools: api.makeTools }), { status: 'completed', count: 0 });
  assert.equal(state.rows.length, 0);
  assert.ok(state.values.get('OUTPUT').response.results[0].knowledgeGraph);
});
