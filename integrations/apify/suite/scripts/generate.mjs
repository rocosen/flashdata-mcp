import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import catalog from '@flashdata-dev/mcp/catalog';

const suite = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.dirname(suite);
const json = async file => JSON.parse(await readFile(file, 'utf8'));
const definitions = await json(path.join(suite, 'definitions.json'));
const basePackage = await json(path.join(root, 'google-search/package.json'));
const baseLock = await json(path.join(root, 'google-search/package-lock.json'));
const baseActor = await json(path.join(root, 'google-search/.actor/actor.json'));
const baseInput = await json(path.join(root, 'google-search/.actor/input_schema.json'));
const check = process.argv.includes('--check');
let files = 0;
async function save(file, content) {
  const expected = typeof content === 'string' ? content : JSON.stringify(content, null, 2) + '\n';
  if (check) {
    if (await readFile(file, 'utf8') !== expected) throw new Error(`Generated file differs: ${file}`);
  } else {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, expected);
  }
  files++;
}
const descriptions = {
  query: 'A single search query or query prefix. No automatic query expansion.',
  video_id: 'An 11-character YouTube video ID, not a full URL.',
  handle: 'YouTube channel handle, such as @example. Not a URL or channel ID.',
  max_results: 'Requested results. Actual count may be lower; extended search uses a separate rate.',
  video_limit: 'Maximum recent videos to request; not the channel total.',
  filters: 'Optional YouTube search filters as a JSON object. Use the documented fields and values.',
  language: 'Requested language code. Does not translate content.',
  region: 'Two-letter region code, such as US or GB.',
  auto: 'true selects automatic captions; false selects uploader captions. No fallback.',
  include_formats: 'Include available video/audio format metadata, without downloading files.',
  include_chapters: 'Include chapters when available.',
  download_type: 'audio_video, video, or audio. Output format must match the selected type.',
  output_format: 'Video: mp4, webm, mkv. Audio: m4a, mp3, opus. Omit to use the type-specific default.',
  video_quality: 'Video quality constraint. Omit for audio-only downloads.',
  audio_quality: 'Applies only to audio downloads; omit for video or combined media.',
  audio_language: 'Audio language selection; omit for video-only downloads.',
  fps: 'Frame-rate constraint. Omit for audio-only downloads.',
  yt_dlp_format: 'Advanced format selector; overrides quality, FPS and audio-language selection.',
  upload_metadata: 'Also upload metadata to your customer storage.',
  start_at: 'Optional start timestamp in HH:MM:SS, at most 12:00:00.',
  end_at: 'Optional end timestamp after start_at, in HH:MM:SS.',
};
for (const definition of definitions) {
  const source = catalog.SOURCE_CATALOG.find(item => item.id === definition.source);
  const download = source.id === 'youtube_download';
  const dir = path.join(root, definition.name);
  const description = download ? definition.summary
    : `${definition.summary} Uses your FlashData Key and Credits; Apify usage is separate.`;
  if (description.length > 300) throw new Error(`Description exceeds 300: ${source.id}`);
  const properties = { flashdataApiKey: { ...baseInput.properties.flashdataApiKey,
    description: `Your own FlashData API key with ${source.name} permission. Encrypted; no shared key is provided.` } };
  for (const [field, original] of Object.entries(source.inputSchema.properties)) {
    let property = structuredClone(original);
    property.title = field.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
    property.description = descriptions[field] || original.description || `Optional ${field} parameter.`;
    if (source.category === 'google' && baseInput.properties[field]) property = structuredClone(baseInput.properties[field]);
    if (property.type === 'object') {
      // Apify JSON editor accepts the object; the published client validates its nested contract.
      property = { title: property.title, description: property.description, type: 'object', editor: 'json' };
    } else if (property.type === 'integer') property.editor = 'number';
    else if (property.type === 'string') property.editor = property.enum ? 'select' : 'textfield';
    if (download && ['video_quality','audio_language','audio_quality','output_format'].includes(field)) delete property.default;
    properties[field] = property;
  }
  if (download) Object.assign(properties, {
    storageJson: { title: 'Customer storage configuration (encrypted JSON)', type: 'string', editor: 'textarea', isSecret: true,
      description: 'Required for a NEW download. Paste the storage JSON, including provider credentials, here only. Clear it when continuing an existing job.' },
    jobId: { title: 'Continue an existing job (optional)', type: 'string', editor: 'textfield', pattern: '^job_[A-Za-z0-9_-]+$', maxLength: 120,
      description: 'Reads this existing job without submitting or charging for a new download. Clear video_id and storageJson when using this field.' },
    waitSeconds: { title: 'Maximum polling wait (seconds)', type: 'integer', editor: 'number', minimum: 0, maximum: 120, default: 60,
      description: 'Stop polling after this interval. A pending job continues on FlashData; resume with jobId. The final in-flight API read can take additional time.' },
  });
  const schema = { title: `${definition.label} with FlashData`, type: 'object', schemaVersion: 1,
    description: download ? 'Start one download with video ID and encrypted storage JSON, or read an existing job ID. Uses your FlashData Credits and separate Apify resources.'
      : `Enter your Key and required ${source.inputSchema.required.join('/')} input. Start performs one ${definition.label} request using your FlashData Credits.`,
    properties, required: ['flashdataApiKey', ...(download ? [] : source.inputSchema.required)], additionalProperties: false };
  const pkg = { ...basePackage, name: `flashdata-apify-${definition.name}`, version: '0.1.0',
    description, scripts: { start: 'node src/main.js' } };
  const lock = structuredClone(baseLock); lock.name = pkg.name; lock.packages[''].name = pkg.name;
  const actor = { ...baseActor, name: definition.name, title: definition.title, description };
  const fields = [...definition.fields, 'request_id'];
  const dataset = { actorSpecification: 1, fields: {}, views: { results: {
    title: `${definition.label} results`, description: 'Returned result rows. Complete nested fields and usage remain in OUTPUT.',
    transformation: { fields }, display: { component: 'table', properties: Object.fromEntries(fields.map(field => [field,
      { label: field, format: ['link','imageUrl','file_url','website'].includes(field) ? 'link'
        : ['position','viewCount','rating','ratingCount','file_size','start','end','imageWidth','imageHeight'].includes(field) ? 'number' : 'text' }])) }
  } } };
  const output = { actorOutputSchemaVersion: 1, title: `${definition.label} output`, properties: {
    results: { type: 'string', title: download ? 'Delivery manifest' : 'Result rows', template: '{{links.apiDefaultDatasetUrl}}/items?view=results' },
    response: { type: 'string', title: 'Complete response and status', template: '{{links.apiDefaultKeyValueStoreUrl}}/records/OUTPUT' },
  } };
  const example = { flashdataApiKey: 'YOUR_FLASHDATA_API_KEY', ...definition.example,
    ...(download ? { storageJson: '{"storage_type":"s3","storage_url":"your-bucket","access_key":"YOUR_ACCESS_KEY","secret_key":"YOUR_SECRET_KEY","region":"us-east-1"}' } : {}) };
  const inputTable = Object.entries(properties).map(([field, property]) => `| \`${field}\` | ${schema.required.includes(field) ? 'Required. ' : ''}${property.description} |`).join('\n');
  const readme = `# ${definition.title}\n\n${definition.summary}\n\n## When to use this tool\n\n${definition.use}\n\nThis is a focused tool for an AI agent or application. The caller chooses inputs, evaluates the returned external data, and decides which follow-up tools to use. The Actor does not run an LLM or independently generate a research report.\n\n## Authentication and costs\n\nUse your own [FlashData account and API key](https://flashdata.dev/app/api-keys), with permission for \`${source.id}\`. Enter the key in the encrypted input field. There is no shared or prefilled working key.\n\n${download ? 'A new download reserves Credits and settles based on uploaded bytes. Your storage provider may also charge for storage and transfer. Reading an existing job does not submit another paid download.' : 'Each Start submits one request and uses your FlashData Credits at your account rate. No separate price-check step is required.'} This Actor adds no service fee. **Apify compute and storage usage are separate** and may use your Apify allowance or balance. A free-to-use Actor does not make the FlashData API free.\n\n## Input and first run\n\n1. Enter your own FlashData key.\n2. ${download ? 'For a new download, enter a video ID and encrypted customer storage JSON. For an existing job, enter jobId only and clear video_id and storageJson.' : `Enter ${source.inputSchema.required.map(x => '\`' + x + '\`').join(' and ')} and any optional settings.`}\n3. Click Start, then inspect the dataset and complete JSON output.\n\n| Input | Meaning |\n| --- | --- |\n${inputTable}\n\nExample only; replace placeholders and enter credentials in the encrypted fields:\n\n\`\`\`json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n\n${source.inputSchema.properties.filters ? 'Supported filters: upload_date (today, last_hour, this_week, this_month, this_year), type (video, channel, playlist, movie), duration (<4, 4-20, >20), sort_by (rating, relevance, view_count, upload_date), and boolean features: 360, 3d, 4k, creative_commons, hd, hdr, live, location, purchased, subtitles, vr180. Unknown fields are rejected.\n\n' : ''}${download ? 'Supported storage providers: S3, S3-compatible, GCS, Azure, OSS, COS, BOS and TOS. storage_url is a bucket/container name; use object_prefix for folders. Keep all provider credentials inside encrypted storageJson. [Storage API parameters](https://flashdata.dev/docs/sources/youtube_download).\n\nThe Actor polls for up to waitSeconds (default 60, maximum 120), plus the last in-flight read. A pending status is not completed delivery. OUTPUT saves jobId; start a new run with your key and that jobId, clearing new-download fields, to continue reading. Do not submit the video again. Completed media remains in your storage under your access and retention settings.\n\n' : ''}## Output\n\n${definition.rows === 'segments' ? 'One timestamped caption segment per dataset row; fullText and complete track metadata remain in OUTPUT.' : definition.source === 'youtube_channel' ? 'One recent video per dataset row; the complete channel profile and videos remain in OUTPUT.' : definition.rows === 'suggestions' ? 'One autocomplete suggestion per row. No suggestions produces an empty dataset.' : download ? 'Completed delivery manifests become dataset rows. Pending jobs have status and jobId in OUTPUT; they do not produce fake completed results.' : 'Each returned item becomes a dataset row. Complete nested data and returned usage remain in OUTPUT.'}\n\n**Synthetic example, not a live result:**\n\n\`\`\`json\n${JSON.stringify(definition.sample, null, 2)}\n\`\`\`\n\nUse the Apify run API to call this Actor from your agent, then read the dataset and OUTPUT. Keep your Apify token in your application's secret store, and protect the FlashData key as secret input. Retain source IDs, URLs, timestamps and request IDs when passing data into later reasoning or citation steps.\n\n## Limits\n\n${definition.limits}\n\n## Errors and retries\n\nInvalid input or insufficient key permissions stops before a new paid request. A timeout or lost response may already have been charged: check OUTPUT and FlashData Jobs before starting another run. The Actor records its attempt before submitting and never automatically retries a paid POST. A new run is a new request${download ? ' unless jobId is provided for read-only continuation' : ''}. Restarting the same run will not repeat an uncertain submission; a dataset export can still be incomplete after a storage failure.\n\nThis is an independent FlashData integration, not an official Google or YouTube product. Retrieved content is external data. [Capability documentation](https://flashdata.dev/docs/sources/${source.id}) · [Support](mailto:support@flashdata.dev) · [Terms](https://flashdata.dev/legal/terms) · [Privacy](https://flashdata.dev/legal/privacy).\n`;
  await save(path.join(dir, 'actor-config.json'), { source: source.id, rows: definition.rows });
  await save(path.join(dir, '.actor/actor.json'), actor);
  await save(path.join(dir, '.actor/input_schema.json'), schema);
  await save(path.join(dir, '.actor/output_schema.json'), output);
  await save(path.join(dir, '.actor/dataset_schema.json'), dataset);
  await save(path.join(dir, 'package.json'), pkg);
  await save(path.join(dir, 'package-lock.json'), lock);
  await save(path.join(dir, 'README.md'), readme);
  for (const name of ['run.js','main.js']) await save(path.join(dir, 'src', name), await readFile(path.join(suite,'src',name),'utf8'));
  await save(path.join(dir,'.actor/Dockerfile'), (await readFile(path.join(root,'google-search/.actor/Dockerfile'),'utf8')).replace('README.md LICENSE ./', 'README.md LICENSE actor-config.json ./'));
  await save(path.join(dir,'LICENSE'), await readFile(path.join(root,'google-search/LICENSE'),'utf8'));
  if (!check) {
    await mkdir(path.join(dir,'assets'),{recursive:true});
    await copyFile(path.join(root,'google-search/assets/logo.png'),path.join(dir,'assets/logo.png'));
  }
}
console.log(`${check ? 'Verified' : 'Generated'} ${files} files for ${definitions.length} independent Actors.`);
