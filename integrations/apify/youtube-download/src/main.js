import { Actor } from 'apify';
import { ApifyClient } from 'apify-client';
import { createBackendClient, runDownload, RunError } from './run.js';

await Actor.main(async () => {
  try {
    if (!Actor.isAtHome()) throw new RunError('This paid Actor must run on Apify. Local runs cannot incur download charges.');
    const { actorRunId, token } = Actor.getEnv();
    // Do not inherit long automatic retry backoffs across Apify's charge deduplication window.
    const billingClient = new ApifyClient({ token, maxRetries:0, timeoutSecs:20 });
    const backend = createBackendClient({ runId:actorRunId, secret:process.env.APIFY_YOUTUBE_DOWNLOAD_SECRET,
      baseUrl:process.env.FLASHDATA_APIFY_BASE_URL });
    await runDownload({ input:await Actor.getInput(), runId:actorRunId, backend,
      charge: options => billingClient.run(actorRunId).charge(options),
      store:await Actor.openKeyValueStore(), dataset:await Actor.openDataset() });
    await Actor.setStatusMessage('Completed. Open OUTPUT for the latest temporary download link.');
  } catch (error) {
    throw new Error(error instanceof RunError ? error.message
      : 'The run could not finish. Inspect OUTPUT and resume this same run; do not start a duplicate download.');
  }
});
