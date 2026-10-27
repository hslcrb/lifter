from pathlib import Path
import json, zipfile
root=Path(__file__).resolve().parents[1]
ext=root/'extension'
m=json.loads((ext/'manifest.json').read_text())
assert m['manifest_version']==3
assert set(m['permissions'])=={'activeTab','scripting','storage'}
assert 'host_permissions' not in m
for rel in [m['action']['default_popup'],*m['icons'].values()]:
    assert (ext/rel).is_file(),rel
out=root/'dist';out.mkdir(exist_ok=True)
with zipfile.ZipFile(out/'lifter-1.0.0.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(ext.rglob('*')):
        if p.is_file():z.write(p,p.relative_to(ext))
print(f'Packaged {len(list(ext.rglob("*")))} entries: dist/lifter-1.0.0.zip')
