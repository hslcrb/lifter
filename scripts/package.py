from pathlib import Path
import json, zipfile
root=Path(__file__).resolve().parents[1]
ext=root/'extension'
m=json.loads((ext/'manifest.json').read_text())
assert m['manifest_version']==3
assert set(m['permissions'])=={'activeTab','scripting','storage','offscreen'}
assert 'host_permissions' not in m
for rel in [m['background']['service_worker'],'engine.js','motion.js','panel.js','content.js','images.js','controller.js','vault.js','fonts.js','vision.js','offscreen.js','offscreen.html','vendor/ocr/eng.traineddata.gz','vendor/ocr/kor.traineddata.gz','vendor/ocr/tesseract-core-lstm.wasm.js','vendor/ocr/tesseract-core-simd-lstm.wasm.js',*m['icons'].values()]:
    assert (ext/rel).is_file(),rel
out=root/'dist';out.mkdir(exist_ok=True)
with zipfile.ZipFile(out/f'lifter-{m["version"]}.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(ext.rglob('*')):
        if p.is_file():z.write(p,p.relative_to(ext))
print(f'Packaged {len(list(ext.rglob("*")))} entries: dist/lifter-{m["version"]}.zip')

# Full source bundle includes local OCR/fonts and tests; excludes dependencies, git and prior ZIPs.
with zipfile.ZipFile(out/f'lifter-{m["version"]}-source.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in sorted(root.rglob('*')):
        if p.is_file() and not any(part in {'.git','node_modules','dist','.superpowers'} for part in p.relative_to(root).parts):
            z.write(p,Path('lifter')/p.relative_to(root))
print('Full source ZIP generated')
