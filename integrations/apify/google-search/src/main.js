import { Actor } from 'apify';
import { runSearch, RunError } from './run.js';

await Actor.main(async () => {
  try {
    const input = await Actor.getInput();
    const store = await Actor.openKeyValueStore();
    const dataset = await Actor.openDataset();
    await runSearch({ input, store, dataset });
    await Actor.setStatusMessage('Search finished. Open Organic search results or the complete JSON response.');
  } catch (error) {
    // SDK/HTTP exceptions can contain request configuration. Log only controlled messages.
    throw new Error(error instanceof RunError ? error.message
      : 'The run could not finish. Inspect saved output and FlashData Jobs before retrying; a search may already be charged.');
  }
});
