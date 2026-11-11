# Independent FlashData Actors

The 13 generated data Actors in `definitions.json` extend the separately maintained, already published Google Search Actor. Each generated directory has an independent input contract, dataset view, README, Docker build and Actor identity. Runtime logic lives in `src/`; do not edit generated copies directly. YouTube Download is independently maintained in `../youtube-download/` with its own Apify PPE runtime and tests; the generator skips its historical definition.

```sh
cd integrations/apify/suite
npm ci --ignore-scripts
node scripts/generate.mjs
node --test test/*.test.js
node scripts/generate.mjs --check
npm audit --audit-level=high
```

Generation imports the pinned published client's source catalog; runtime validation also uses that client. It makes no requests and creates no keys. Tests use synthetic fixtures and do not replace live capability validation.

The generated data Actors use customers' own encrypted FlashData keys and Credits. No Actor service fee, automatic paid retry, scheduled task, standby mode, backend deployment or npm release is introduced. Download accepts the complete storage JSON as encrypted input and supports job-ID continuation without another submission. Apify resources remain separate.

Official automated tests skip required secret inputs: https://docs.apify.com/actors/publishing/test.md . BYOK/necessary website-link interpretation remains tracked in the original support conversation; publication is not a claim of written approval.

Deployment must reuse any existing matching object, build each selected directory, check public schema/README/logo/pricing and read back the actual public state. No-key fixture tests and builds do not establish successful paid API calls. Public and search status must be recorded separately in GTM.

YouTube Download PPE deployment is staged separately. Its new build must not replace latest until its backend, pricing and payout requirements are verified.
