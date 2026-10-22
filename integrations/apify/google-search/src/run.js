import { createHash } from 'node:crypto';
import flashdata from '@flashdata-dev/mcp';
import catalog from '@flashdata-dev/mcp/catalog';

const { createLocalTools, loadLocalConfig, validateTool } = flashdata;
const searchFields = Object.keys(catalog.SOURCE_CATALOG.find(source => source.id === 'google_search').inputSchema.properties);
const inputFields = new Set(['flashdataApiKey', 'operation', 'maxCredits', ...searchFields]);

export class RunError extends Error {}

function parseInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)
    || Object.keys(input).some(key => !inputFields.has(key))) {
    throw new RunError('Invalid input. Use the documented Google Search fields only.');
  }
  const { flashdataApiKey, operation = 'quote', maxCredits = 0, ...parameters } = input;
  const args = { num: 10, page: 1, ...parameters };
  if (!['quote', 'search'].includes(operation)) throw new RunError('Choose quote or search.');
  if (!Number.isFinite(maxCredits) || maxCredits < 0) throw new RunError('maxCredits must be a non-negative number.');
  if (operation === 'search' && maxCredits <= 0) throw new RunError('Set maxCredits above zero after checking your quote.');
  const invalid = validateTool('google_search', args);
  if (invalid) throw new RunError(invalid.message);
  let config;
  try {
    // Only the two existing FlashData API origins receive the key; input cannot override them.
    config = loadLocalConfig({ FLASHDATA_API_KEY: flashdataApiKey });
  } catch {
    throw new RunError('Enter a valid FlashData API key in the encrypted input field.');
  }
  return { config, operation, maxCredits, args };
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
  const { config, operation, maxCredits, args } = parseInput(input);
  const fingerprint = createHash('sha256').update(JSON.stringify({
    secret: config.secret, operation, maxCredits,
    args: Object.fromEntries(Object.entries(args).sort(([a], [b]) => a.localeCompare(b))),
  })).digest('hex');
  const previous = await store.getValue('REQUEST_STATE');
  if (previous) {
    if (previous.fingerprint !== fingerprint) throw new RunError('This run already has a request record for different input. Do not reuse its storage.');
    if (previous.phase === 'complete') return { reused: true, status: 'completed' };
    throw new RunError('This run already attempted a search. Inspect OUTPUT and FlashData Jobs before starting another run; it may have been charged.');
  }

  const tools = makeTools(config);
  const quote = await tools.call({ name: 'get_pricing', arguments: { source: 'google_search', request_count: 1 } });
  const price = quote.structuredContent?.prices?.find(item => item.source === 'google_search');
  if (quote.isError || !price?.available || !Number.isFinite(price.creditsPerRequest) || price.creditsPerRequest < 0
    || !Number.isFinite(price.estimatedCredits) || price.estimatedCredits < 0) {
    throw new RunError('Could not obtain a current FlashData price. Check the key, Google Search permission and account status. No search was submitted.');
  }
  const pricing = { source: 'google_search', request_count: 1,
    creditsPerRequest: price.creditsPerRequest, estimatedCredits: price.estimatedCredits };
  await store.setValue('QUOTE', pricing);
  if (operation === 'quote') {
    const output = { status: 'quote', query: args.query, pricing, searchSubmitted: false };
    await store.setValue('OUTPUT', redact(output, config.secret));
    return { status: 'quote' };
  }
  if (price.estimatedCredits > maxCredits) {
    throw new RunError('The quoted FlashData Credits exceed maxCredits. No search was submitted. Read QUOTE and adjust the limit only if you accept the cost.');
  }

  // Persist before the paid POST. Migration or resurrection must never repeat uncertain work.
  await store.setValue('REQUEST_STATE', { fingerprint, phase: 'attempt_started' });
  const result = await tools.call({ name: 'google_search', arguments: args });
  const response = redact(result.structuredContent, config.secret);
  await store.setValue('OUTPUT', { status: result.isError ? 'failed' : 'response_received',
    query: redact(args.query, config.secret), pricing, response });
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
    organicResultCount: rows.length, pricing, response });
  await store.setValue('REQUEST_STATE', { fingerprint, phase: 'complete', request_id: response.request_id });
  return { status: 'completed', count: rows.length };
}
