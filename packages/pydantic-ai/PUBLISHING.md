# Publishing

The source distribution and PyPI publication are separate. Do not infer a PyPI release from this manifest or from an official ecosystem PR. Version 0.1.0 and project `pydantic-ai-flashdata` were not present on PyPI during preparation on October 25, 2026. Recheck both before publishing; never overwrite a version or release tag.

The existing PyPI account is `flashdata-dev`. Its publisher list has no entry for this project. Publishing requires the account owner to confirm and configure a new project-specific Trusted Publisher and the corresponding GitHub environment. Other packages' publishers do not authorize this package. No account-wide token is needed.

| Field | Value |
| --- | --- |
| PyPI project | `pydantic-ai-flashdata` |
| GitHub owner | `rocosen` |
| Repository | `flashdata-mcp` |
| Workflow | `pydantic-ai-publish.yml` |
| Environment | `pypi-pydantic-ai` |
| Release tag | `pydantic-ai-v0.1.0` |

Configure the environment to allow only the intended release tags. The included workflow is manual and runs only from a matching tag. It checks the name/version, frozen dependencies, tests, wheel metadata and clean installation before the OIDC publishing job. Do not dispatch it before the account owner has configured and reviewed the exact publisher binding.

After publication, read the exact version from PyPI, compare file hashes and provenance with the built distributions, and install from PyPI in a fresh environment. Run only import/spec/discovery checks without credentials; live data queries require the user's own Credits and approval.
