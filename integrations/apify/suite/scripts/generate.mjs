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
  query: 'One search query or autocomplete prefix.',
  video_id: '11-character YouTube video ID (the v= value in a watch URL).',
  handle: 'YouTube channel handle, e.g. @Google. Use a handle, not a channel ID or URL.',
  max_results: 'Maximum results to request. Actual count may be lower.',
  video_limit: 'Maximum recent videos to return.',
  filters: 'JSON filters, e.g. {"upload_date":"this_week","type":"video"}. See README for supported values.',
  language: 'Existing caption language, e.g. en, de or es. No translation.',
  region: 'Two-letter country code, e.g. US, GB or SG.',
  auto: 'true selects automatic captions; false selects uploader captions. No fallback.',
  include_formats: 'Include available video/audio format metadata, without downloading files.',
  include_chapters: 'Include chapters when available.',
  download_type: 'Video with audio, video only, or audio only.',
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
  const properties = {};
  for (const [field, original] of Object.entries(source.inputSchema.properties)) {
    let property = structuredClone(original);
    property.title = field.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
    property.description = descriptions[field] || original.description || `Optional ${field} parameter.`;
    if (source.category === 'google' && baseInput.properties[field]) property = structuredClone(baseInput.properties[field]);
    delete property.sectionCaption;
    delete property.sectionDescription;
    if (property.type === 'object') {
      // Apify JSON editor accepts the object; the published client validates its nested contract.
      property = { title: property.title, description: property.description, type: 'object', editor: 'json' };
    } else if (property.type === 'integer') property.editor = 'number';
    else if (property.type === 'string') {
      property.editor = property.enum ? 'select' : 'textfield';
      // Apify select fields reject string-length/pattern constraints; the client still validates them.
      if (property.enum) for (const key of ['minLength','maxLength','pattern']) delete property[key];
    }
    if (download && ['video_quality','audio_language','audio_quality','output_format'].includes(field)) delete property.default;
    properties[field] = property;
  }
  if (properties.query) properties.query.description = source.id === 'youtube_suggestions'
    ? `Autocomplete prefix, e.g. ${definition.example.query}.`
    : `One search query, e.g. ${definition.example.query}.`;
  if (source.id === 'youtube_suggestions') properties.language.description = 'Suggestion language code, e.g. en, de or es.';
  if (properties.max_results) properties.max_results.description = `Maximum results (1–${properties.max_results.maximum}). Actual count may be lower.`;
  if (properties.video_limit) properties.video_limit.description = 'Maximum recent videos (1–100); not the full channel history.';
  properties.flashdataApiKey = { ...baseInput.properties.flashdataApiKey,
    description: baseInput.properties.flashdataApiKey.description.replace('google_search', source.id) };
  if (download) Object.assign(properties, {
    storageJson: { title: 'Customer storage configuration (encrypted JSON)', type: 'string', editor: 'textarea', isSecret: true,
      description: 'Storage credentials as JSON; required for a new download. See README for provider fields and an S3 example.' },
    jobId: { title: 'Continue an existing job (optional)', type: 'string', editor: 'textfield', pattern: '^job_[A-Za-z0-9_-]+$', maxLength: 120,
      description: 'Read an existing job without a new download charge. Clear video_id and storageJson.' },
    waitSeconds: { title: 'Maximum polling wait (seconds)', type: 'integer', editor: 'number', minimum: 0, maximum: 120, default: 60,
      description: 'Polling window. Pending jobs continue; resume with jobId. An in-flight read may finish later.' },
  });
  const primary = download ? ['video_id', 'flashdataApiKey', 'storageJson', 'download_type']
    : [...source.inputSchema.required, 'flashdataApiKey'];
  const optional = source.category === 'google'
    ? ['num', 'page', 'gl', 'hl', 'location', 'tbs', 'autocorrect']
    : Object.keys(properties).filter(field => !primary.includes(field) && !['jobId', 'waitSeconds'].includes(field));
  const orderedProperties = Object.fromEntries([...primary, ...optional, ...(download ? ['jobId', 'waitSeconds'] : [])]
    .map(field => [field, properties[field]]));
  if (optional.length) Object.assign(orderedProperties[optional[0]], {
    sectionCaption: download ? 'Optional download settings' : 'Optional settings',
  });
  if (download) Object.assign(orderedProperties.jobId, {
    sectionCaption: 'Check an existing download job',
    sectionDescription: 'Use jobId from the previous OUTPUT. Clear new-download inputs.',
  });
  const schema = { title: `${definition.label} with FlashData`, type: 'object', schemaVersion: 1,
    description: download ? 'Save a YouTube video to your cloud storage. New downloads use FlashData Credits; Apify and storage costs are separate. API key: https://flashdata.dev/app/api-keys'
      : `${definition.label} for your AI agent. Uses FlashData Credits; Apify usage is billed separately.${source.id === 'youtube_search_extended' ? ' Higher FlashData rate than standard search.' : ''} API key: https://flashdata.dev/app/api-keys`,
    properties: orderedProperties, required: ['flashdataApiKey', ...(download ? [] : source.inputSchema.required)], additionalProperties: false };
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
  const inputTable = Object.entries(orderedProperties).map(([field, property]) => `| \`${field}\` | ${schema.required.includes(field) ? 'Required. ' : ''}${property.description} |`).join('\n');
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
