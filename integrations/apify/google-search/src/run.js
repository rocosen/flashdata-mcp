import { createHash } from 'node:crypto';
import flashdata from '@flashdata-dev/mcp';
import catalog from '@flashdata-dev/mcp/catalog';

const { createLocalTools, loadLocalConfig, validateTool } = flashdata;
const searchFields = Object.keys(catalog.SOURCE_CATALOG.find(source => source.id === 'google_search').inputSchema.properties);
const inputFields = new Set(['flashdataApiKey', ...searchFields]);

export class RunError extends Error {}

function parseInput(input) {
  if (input && typeof input === 'object' && ('operation' in input || 'maxCredits' in input)) {
    throw new RunError('This saved input uses the old price-check workflow. Remove operation and maxCredits before starting a new search. New runs perform one Google Search using your FlashData Credits.');
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)
    || Object.keys(input).some(key => !inputFields.has(key))) {
    throw new RunError('Invalid input. Use the documented Google Search fields only.');
  }
  const { flashdataApiKey, ...parameters } = input;
  const args = { num: 10, page: 1, ...parameters };
  if (typeof flashdataApiKey !== 'string' || !/^fd_[A-Za-z0-9_-]+$/.test(flashdataApiKey)) {
    throw new RunError('Enter your own FlashData API key (starting with fd_) in the encrypted input field.');
  }
  if (typeof args.query !== 'string' || !args.query.trim()) throw new RunError('Enter a non-empty search query.');
  const invalid = validateTool('google_search', args);
  if (invalid) throw new RunError(invalid.message);
  let config;
  try {
    // Only the two existing FlashData API origins receive the key; input cannot override them.
    config = loadLocalConfig({ FLASHDATA_API_KEY: flashdataApiKey });
  } catch {
    throw new RunError('Enter a valid FlashData API key in the encrypted input field.');
  }
  return { config, args };
}

function redact(value, secret) {
  return JSON.parse(JSON.stringify(value, (_key, item) =>
    typeof item === 'string' ? item.replaceAll(secret, '[REDACTED]') : item));
}

function searchRows(response, query) {
  return response.results.flatMap(result => Array.isArray(result?.organic) ? result.organic : [])
    .filter(row => row && typeof row === 'object' && !Array.isArray(row))
    .map(row => ({ ...row, query, request_id: response.request_id }));
}

export async function runSearch({ input, store, dataset, makeTools = config => createLocalTools(config, { taskSource: 'google_search' }) }) {
  const { config, args } = parseInput(input);
  const fingerprint = createHash('sha256').update(JSON.stringify({
    secret: config.secret,
    args: Object.fromEntries(Object.entries(args).sort(([a], [b]) => a.localeCompare(b))),
  })).digest('hex');
  const previous = await store.getValue('REQUEST_STATE');
  if (previous) {
    if (previous.fingerprint !== fingerprint) throw new RunError('This run already has a request record for different input. Do not reuse its storage.');
    if (previous.phase === 'complete') return { reused: true, status: 'completed' };
    throw new RunError('This run already attempted a search. Inspect OUTPUT and FlashData Jobs before starting another run; it may have been charged.');
  }

  const tools = makeTools(config);
  let available;
  try {
    available = await tools.list();
  } catch {
    throw new RunError('Could not verify your FlashData API key. Check that it is valid and active. No search was submitted.');
  }
  if (!available.tools.some(tool => tool.name === 'google_search')) {
    throw new RunError('Your FlashData API key needs Google Search permission. No search was submitted.');
  }

  // Persist before the paid POST. Migration or resurrection must never repeat uncertain work.
  await store.setValue('REQUEST_STATE', { fingerprint, phase: 'attempt_started' });
  const result = await tools.call({ name: 'google_search', arguments: args });
  const response = redact(result.structuredContent, config.secret);
  await store.setValue('OUTPUT', { status: result.isError ? 'failed' : 'response_received',
    query: redact(args.query, config.secret), response });
  await store.setValue('REQUEST_STATE', { fingerprint, phase: 'response_saved', request_id: response.request_id });
  if (result.isError) {
    throw new RunError(response.code === 'query_outcome_unknown'
      ? 'Search outcome is unknown. Work may already be charged. Inspect OUTPUT and FlashData Jobs; do not automatically resubmit.'
      : 'FlashData returned a search error. Inspect OUTPUT and account usage before another attempt.');
  }
  if (!Array.isArray(response.results) || ![undefined, 'done', 'completed'].includes(response.status)) {
    throw new RunError('The API response is saved in OUTPUT but is not a completed search result. Inspect it before another attempt.');
  }
  const rows = searchRows(response, redact(args.query, config.secret));
  if (rows.length) await dataset.pushData(rows);
  await store.setValue('OUTPUT', { status: 'completed', query: redact(args.query, config.secret),
    organicResultCount: rows.length, response });
  await store.setValue('REQUEST_STATE', { fingerprint, phase: 'complete', request_id: response.request_id });
  return { status: 'completed', count: rows.length };
}
