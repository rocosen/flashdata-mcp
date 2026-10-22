import { Actor } from 'apify';
import { runSearch, RunError } from './run.js';

await Actor.main(async () => {
  try {
    const input = await Actor.getInput();
    const store = await Actor.openKeyValueStore();
    const dataset = await Actor.openDataset();
    const result = await runSearch({ input, store, dataset });
    await Actor.setStatusMessage(result.status === 'quote'
      ? 'Price checked. No FlashData search submitted.'
      : 'Search finished. Open the dataset or complete JSON output.');
  } catch (error) {
    // SDK/HTTP exceptions can contain request configuration. Log only controlled messages.
    throw new Error(error instanceof RunError ? error.message
      : 'The run could not finish. Inspect saved output and FlashData Jobs before retrying; a search may already be charged.');
  }
});
