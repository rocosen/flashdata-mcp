# Publishing

The source distribution, PyPI publication and official ecosystem listing are separate. [Version 0.1.0 is published on PyPI](https://pypi.org/project/pydantic-ai-flashdata/0.1.0/). [The release workflow](https://github.com/rocosen/flashdata-mcp/actions/runs/40163509773) completed on October 25, 2026. Public wheel/sdist hashes match the workflow artifacts, PyPI provenance identifies the publisher below, and a fresh registry installation passed import and Agent spec registration checks. Never overwrite a version or release tag.

The PyPI account is `flashdata-dev`. The account owner approved this project's Trusted Publisher and the corresponding GitHub environment. The binding below is configured; the environment allows only tags matching `pydantic-ai-v*`. Other packages' publishers do not authorize this package. No account-wide token is needed.

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
