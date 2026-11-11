import { createHash, createHmac } from 'node:crypto';

export class RunError extends Error {}
export const EVENT = 'download-mb';
const allowed = new Set(['url','download_type','output_format','video_quality','fps','audio_quality','audio_language','maxFileMB']);
export function validateInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)
    || Object.keys(input).some(k => !allowed.has(k)) || typeof input.url !== 'string') {
    throw new RunError('Enter a YouTube URL and supported download settings. FlashData keys and storage credentials are no longer required.');
  }
  return input;
}
export function createBackendClient({ runId, secret, baseUrl = 'https://api.flashdata.dev', request = fetch, now = Date.now }) {
  const origin = new URL(baseUrl);
  if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash
    || !/^[A-Za-z0-9]{17}$/.test(runId || '') || !/^[\x21-\x7e]{32,512}$/.test(secret || '')) {
    throw new RunError('The provider has not configured this Actor connection.');
  }
  return async (method, suffix, input) => {
    const path = `/apify/youtube-download/${suffix}`;
    const body = input === undefined ? '' : JSON.stringify(input);
    const timestamp = String(now());
    const digest = createHash('sha256').update(body).digest('hex');
    const signature = createHmac('sha256', secret).update([method,path,runId,timestamp,digest].join('\n')).digest('hex');
    let response, result;
    try {
      response = await request(`${origin.origin}${path}`, { method, redirect: 'error', signal: AbortSignal.timeout(45000),
        headers: { 'Content-Type':'application/json', 'X-Apify-Run-Id':runId, 'X-Apify-Timestamp':timestamp,
          'X-Apify-Signature':signature }, ...(body ? { body } : {}) });
      result = await response.json();
    } catch { throw new RunError('The provider response is unavailable. Resume this run; do not start a duplicate download.'); }
    if (!response.ok) {
      const error = new RunError(result?.error?.message || 'The download request could not complete.');
      error.code = result?.error?.code;
      throw error;
    }
    return result;
  };
}

export async function runDownload({ input, backend, runId, charge, store, dataset,
  now = Date.now, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), timeoutMs = 600000 }) {
  validateInput(input);
  // The server's unique run fence, not mutable Actor KV data, prevents duplicate submission.
  await backend('POST', 'job', input);
  await store.setValue('OUTPUT', { status:'pending', run_id:runId, message:'Resume this run to continue the same download.' });
  const deadline = now() + timeoutMs;
  let ready;
  while (now() < deadline) {
    try { ready = await backend('GET','job'); }
    catch (error) {
      if (error.code !== 'submission_pending') throw error;
    }
    if (ready?.status === 'completed') break;
    if (ready?.status === 'failed') throw new RunError('Download failed. No download event was charged.');
    await sleep(5000);
  }
  if (ready?.status !== 'completed') throw new RunError('Download is still pending. Resurrect this same run to continue; starting a new run creates another download.');
  await store.setValue('OUTPUT', { ...ready, status:'awaiting_charge' });
  let intent = await backend('POST','charge',{});
  if (!intent.charged) {
    // The API's 3-minute idempotency window is shorter than a possible run restart.
    // The server persists a 90-second charging window and never reopens it.
    if (intent.event_name !== EVENT || !Number.isSafeInteger(intent.count) || intent.count < 1
      || !Number.isFinite(intent.price_ceiling_usd) || intent.price_ceiling_usd <= 0
      || !Number.isFinite(intent.max_total_charge_usd)
      || intent.count * intent.price_ceiling_usd > intent.max_total_charge_usd + 1e-12
      || !Number.isFinite(Date.parse(intent.charge_before)) || now() >= Date.parse(intent.charge_before)) {
      throw new RunError('The billing authorization is invalid or expired. Contact support with this run URL.');
    }
    await store.setValue('BILLING', { status:'attempting', count:intent.count, charge_before:intent.charge_before });
    try {
      await charge({ eventName:EVENT, count:intent.count, idempotencyKey:intent.idempotency_key });
    } catch {
      // No blind retries: poll the platform through the backend before releasing the file.
    }
  }
  let file;
  for (let attempt=0; attempt<12; attempt++) {
    try { file = await backend('GET','file'); break; }
    catch (error) {
      if (error.code !== 'charge_unconfirmed') throw error;
      await sleep(5000);
    }
  }
  if (!file) throw new RunError('Apify has not confirmed the charge. Resume this same run or contact support; do not start a duplicate download.');
  await store.setValue('BILLING', { status:'confirmed', charged_mb:file.charged_mb });
  await store.setValue('OUTPUT', { status:'completed', ...file });
  // One file per run. On resurrection only OUTPUT receives a refreshed temporary link.
  if ((await dataset.getInfo()).itemCount === 0) await dataset.pushData(file);
  return file;
}
