# Host discovery verification

Verified on macOS on October 25, 2026. Installation and discovery checks do not establish successful paid data retrieval or storage delivery.

| Host | Source | Observed result |
| --- | --- | --- |
| OpenCode 1.19.4 | Public `agent-skills-v0.1.0` | Official `debug skill` discovered 15 task Skills in an isolated configuration. |
| OpenCode 2.1.4 (`@opencode/cli`) | Same public tag, commit `aa9ca5843af1b9a08adf7aefcba04184f0b873b6` | Official `/api/plugin` reported `flashdata.skills` active; `/api/skill` returned all 15 expected names with descriptions, content and existing Skill paths. |
| Pi 1.4.0 | Same public Git distribution | Official Skill loader discovered all 15 Skills with no diagnostics. |

The v2 check used the package directory in `plugins`, isolated XDG config/data/cache/state directories, an explicit configuration file, and an empty test project. No real FlashData or model credentials were supplied. Project configuration inheritance, Claude Code configuration discovery, model catalog fetching and file watching were disabled for the check.

The official CLI started a temporary foreground server bound only to `127.0.0.1`, with an ephemeral local password. Read requests used the same project location. The probe waited for the plugin's active state before reading Skills and stopped the server afterward. No model session, FlashData data query or storage operation was created.

A preliminary one-shot `opencode api --standalone get /api/skill` returned an empty list: the skill-list endpoint can answer before asynchronous plugin activation. That initial response is not a successful discovery result. Use the running service and check plugin activation as shown in the README. The v2 configured local plugin source must be a directory; a v1-style `index.js` path is not a valid v2 configured source.

This documentation correction does not change the plugin code, package version, or immutable public tag. npm publication and OpenCode/Pi directory approval remain separate from the Git release and host discovery.
