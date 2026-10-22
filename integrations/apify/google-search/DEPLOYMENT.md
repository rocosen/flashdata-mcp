# Google Search BYOK pilot — maintainer notes

This directory is an independently buildable Actor source package. It reuses the published FlashData client; it does not change or deploy the FlashData backend, publish an npm version, or create a key.

The private pilot is now `flashdata/google-search`, Actor ID `Z2M705IR2oQj98zfZ`:
https://console.apify.com/actors/Z2M705IR2oQj98zfZ/source
Reuse this object. At the 2026-10-22 setup checkpoint it had zero builds and zero runs; the account avatar was updated to the existing FlashData mark. This is not a public Store listing.

## Local verification

Use Node.js 22.18 or newer:

```sh
npm ci --ignore-scripts
npm test
npm run check
docker build -f .actor/Dockerfile -t flashdata-google-search:local .
```

Tests use local HTTP fixtures or injected clients and never run a paid search. The synthetic README example is labeled. A real successful search and its actual Credits deduction remain required before a public launch.

## Platform setup

1. Use the confirmed FlashData publishing account. Inspect My Actors first and reuse an existing matching Actor if there is one. The unrelated Karena / intrepid_gazelle account must not be used.
2. Import this directory as the Actor root, including `.actor/`, package-lock, source, README and license. The existing private pilot links the `codex/apify-google-search-byok-20261022` branch and `integrations/apify/google-search` folder. Use `assets/logo.png` for the Actor icon (existing brand mark with padding for circular cropping); account-avatar success alone does not verify the Actor icon.
3. Keep the Actor private during validation. Disable standby and schedules. Use 256 MB and a bounded run timeout. Do not start a build/run against a paid account without an agreed platform budget.
4. Choose the platform's free/no-Actor-service-fee configuration, with users paying ordinary Apify platform usage. Do not enable rental or pay-per-event charges. In particular, check that no `apify-actor-start`, `apify-default-dataset-item` or custom charge event remains. The source never calls `Actor.charge`; source code alone cannot set or prove the Console pricing configuration.
5. A protected Google Search test key is needed for platform verification. Do not put one in README, defaults, the repository, or shared example runs. Default operation is a genuine price check, not a fake successful search. No-key runs should fail; configure any platform test input deliberately rather than hiding authentication failure.
6. Verify the account rate with the free FlashData price read. A real search needs a separately approved test budget and key destination; check both the Apify usage and FlashData ledger. Key persistence in Apify requires explicit authorization.

## Public release prerequisite

The chosen customer-Key / external-Credits model and website links need Apify's applicable approval before publishing this listing. Existing competitor pages do not establish that permission. Current Publishing Terms §2.2.4.2(i) require written agreement for off-platform promotion/links; §10.4.1 reserves restrictions for Actors requiring or directing external payment. The local package is prepared for review, not evidence of platform acceptance.

Official references:

- https://docs.apify.com/legal/store-publishing-terms-and-conditions
- https://docs.apify.com/actors/development/actor-definition/actor-json
- https://docs.apify.com/actors/development/actor-definition/input-schema/specification/v1
- https://docs.apify.com/actors/development/actor-definition/output-schema

Before public release, verify pricing, encrypted input, logo, one successful paid result, failed/uncertain-request behavior, public body, search visibility and permitted website links separately. Preserve the full 15-Actor plan; this package is only the Google Search pilot.
