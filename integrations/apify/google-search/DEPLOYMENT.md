# Google Search BYOK Actor — maintainer notes

This directory is an independently buildable Actor source package. It reuses the published FlashData client; it does not change or deploy the FlashData backend, publish an npm version, or create a key.

The published Actor is `flashdata/google-search`, Actor ID `Z2M705IR2oQj98zfZ`:
https://apify.com/flashdata/google-search

Maintainer Console:
https://console.apify.com/actors/Z2M705IR2oQj98zfZ/source
Reuse this object. On 2026-10-22, platform build 0.0.2 succeeded and two runs completed: one free FlashData quote and one authorized search returning 10 results. FlashData Jobs recorded 0.008 Credits for the search. Account and Actor images use the existing FlashData mark. The original object was published on 2026-10-22 after the owner explicitly authorized acceptance of the Store terms and publication. Anonymous metadata confirms `isPublic: true`. No additional run or build was started for publication.

Successful run: https://console.apify.com/actors/Z2M705IR2oQj98zfZ/runs/am5hXJvO3hqGxjc16
Validated source commit: `e85e1fd5d52e31725c8d850f3af15d416448230c`.
Build 0.0.2 used a default price-check workflow. The owner then ran a saved placeholder key (authentication failed), replaced it with a newly authorized Google Search-only key, and completed a price check (`jaqR6wFIufh4Jndxt`, quote 0.008 Credits, `searchSubmitted: false`). The private key was delivered locally and must never be copied into this repository or public examples. The authorized agent-run paid search has been used; further paid tests need a new explicit budget.

## Direct-search correction

The owner rejected the extra price-check and manual Credits-limit steps. The current source accepts a key and query and submits one search directly. It removes `operation`, `maxCredits`, the pricing request and quote output. The form requires a key starting with `fd_` and a query; neither has a prefilled value. Authentication and Google Search permission are verified before recording the search attempt. Existing duplicate-request protection remains.

Old saved inputs containing `operation` or `maxCredits` fail with an update instruction, before any network call. They must not silently become a paid search. When deploying, update the existing Actor, point its saved run options at the new build, remove those two fields from the private saved input while preserving the user's key/query, and update the public README and example. Do not click Start as part of deployment. Record the resulting platform build and public verification in GTM.

## Local verification

Use Node.js 22.18 or newer:

```sh
npm ci --ignore-scripts
npm test
npm run check
docker build -f .actor/Dockerfile -t flashdata-google-search:local .
```

Tests use local HTTP fixtures or injected clients and never run a paid search. The synthetic README example is labeled. The separate platform search and Credits check above passed; it does not establish repeated-run reliability or permission to publish.

## Platform setup

1. Use the confirmed FlashData publishing account. Inspect My Actors first and reuse an existing matching Actor if there is one. The unrelated Karena / intrepid_gazelle account must not be used.
2. Import this directory as the Actor root, including `.actor/`, package-lock, source, README and license. The existing Actor links the `codex/apify-google-search-byok-20261022` branch and `integrations/apify/google-search` folder. Use `assets/logo.png` for the Actor icon (existing brand mark with padding for circular cropping); account-avatar success alone does not verify the Actor icon.
3. Reuse the published Actor for updates; do not unpublish it. Disable standby and schedules. Use 256 MB and a bounded run timeout. Use the existing agreed platform budget; do not recharge or upgrade.
4. Choose the platform's free/no-Actor-service-fee configuration, with users paying ordinary Apify platform usage. Do not enable rental or pay-per-event charges. In particular, check that no `apify-actor-start`, `apify-default-dataset-item` or custom charge event remains. The source never calls `Actor.charge`; source code alone cannot set or prove the Console pricing configuration.
5. A protected Google Search test key is needed for live platform verification. Do not put one in README, defaults, the repository, or shared example runs. Every valid new run is a real search. No-key runs should fail; configure any platform test input deliberately rather than hiding authentication failure.
6. A real search needs an approved test budget and key destination; check both the Apify usage and FlashData ledger. Key persistence in Apify requires explicit authorization. Local fixtures and building the Actor do not submit a search.

## Publication and pending support request

The listing is public and has no additional Actor service fee; ordinary Apify usage and the user's own FlashData Credits remain separate. The owner also authorized contacting Apify support. The official Console support conversation requests the authentication-based daily-test exclusion and confirmation of the BYOK / necessary website-link model under Publishing Terms §2.2.4.2(i) and §10.4.1. Support confirmed transfer to a human team; no exemption or written policy approval has been granted yet. Do not open a duplicate request or treat publication as policy approval.

Never publish a working key or manufacture results to satisfy daily tests. Public Store web search for `flashdata` showed this Actor first; the 30-query public API check did not return it. Search surfaces are tracked separately in the GTM publication record. At the initial publication, anonymous metadata `exampleRunInput` still returned a legacy `helloWorld` value; verify it when updating the direct-search example.

Official references:

- https://docs.apify.com/legal/store-publishing-terms-and-conditions
- https://docs.apify.com/actors/development/actor-definition/actor-json
- https://docs.apify.com/actors/development/actor-definition/input-schema/specification/v1
- https://docs.apify.com/actors/development/actor-definition/output-schema

Continue tracking public content, search visibility, daily-test status and the pending support response separately. Preserve the full 15-Actor plan; this package is only Google Search. The source PR remains draft because unrelated root-package dependency checks still fail; the independent Actor checks passed. Documentation changes do not require a new build or paid test.
