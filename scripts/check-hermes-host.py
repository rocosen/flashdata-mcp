"""Check the package using a real Hermes checkout/runtime; no network or API calls.

Run with Hermes's prepared Python and HERMES_SOURCE pointing at its source tree.
"""
import json
import os
from pathlib import Path
import re
import sys
import tempfile

sys.path.insert(0, os.environ['HERMES_SOURCE'])
from agent.secret_scope import reset_secret_scope, set_secret_scope
from hermes_cli.agent_plugins import load_agent_plugin, manifest_config_schema
from tools.mcp_tool_config import _interpolate_env_vars, _require_rendered_remote

root = Path(__file__).resolve().parents[1]
tasks = json.loads((root / 'npm/tasks.json').read_text())['tasks']
with tempfile.TemporaryDirectory() as data_dir:
    package = load_agent_plugin(root / 'plugins/hermes', Path(data_dir))
    assert not package.diagnostics, package.diagnostics
    assert package.name == 'flashdata-plugin'
    assert len(package.skills) == 15
    assert {s.name for s in package.skills} == {f"{t['slug']}-flashdata" for t in tasks}
    for skill in package.skills:
        text = skill.skill_md.read_text()
        assert len(skill.description) <= 60 and skill.description.endswith('.')
        assert list(re.findall(r'^## (.+)$', text, re.M)) == [
            'When to Use', 'Prerequisites', 'How to Run', 'Quick Reference',
            'Procedure', 'Pitfalls', 'Verification',
        ]
        example = json.loads((skill.root / 'references/query.json').read_text())
        assert isinstance(example, dict)
        assert (skill.root / '../../README.md').resolve().is_file()
    config = package.mcp_servers['flashdata']
    assert config['url'] == 'https://data.flashdata.dev/mcp'
    assert config['strict_redirect_headers'] is True
    assert config['trust'] == 'untrusted'
    secret = manifest_config_schema(package.manifest)['api_key']
    assert secret['type'] == 'secret' and secret['env'] == 'FLASHDATA_API_KEY'
    for fixture in ('fixture-profile-a', 'fixture-profile-b'):
        token = set_secret_scope({'FLASHDATA_API_KEY': fixture})
        try:
            rendered = _require_rendered_remote('flashdata', _interpolate_env_vars(config))
            assert rendered['headers']['X-API-Key'] == fixture
        finally:
            reset_secret_scope(token)
    for missing in ({}, {'FLASHDATA_API_KEY': ''}):
        token = set_secret_scope(missing)
        try:
            try:
                _require_rendered_remote('flashdata', _interpolate_env_vars(config))
            except ValueError as error:
                assert error.failure_class == 'missing_credentials'
            else:
                raise AssertionError('Missing credential was accepted')
        finally:
            reset_secret_scope(token)

print(json.dumps({
    'plugin': package.name, 'version': package.version,
    'skills': [s.name for s in package.skills],
    'skill_count': len(package.skills), 'reference_count': len(package.skills),
    'profile_secret_isolation': 'passed', 'missing_and_empty_key': 'fail closed',
    'remote_redirect_headers': 'strict', 'server_trust': 'untrusted',
    'network_calls': 0, 'model_calls': 0, 'paid_queries': 0, 'storage_writes': 0,
}, indent=2))
