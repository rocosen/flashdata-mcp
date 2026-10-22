import { Actor } from 'apify';
import definition from '../actor-config.json' with { type: 'json' };
import { runCapability, RunError } from './run.js';

await Actor.main(async () => {
  try {
    const result = await runCapability({ definition, input: await Actor.getInput(),
      store: await Actor.openKeyValueStore(), dataset: await Actor.openDataset() });
    await Actor.setStatusMessage(result.status === 'pending'
      ? `Download job ${result.jobId} is still pending. Continue with jobId only; do not submit it again.`
      : 'Completed. Open the dataset and complete JSON response.');
  } catch (error) {
    throw new Error(error instanceof RunError ? error.message
      : 'The run could not finish. Inspect saved OUTPUT and FlashData Jobs before retrying; work may already be charged.');
  }
});
