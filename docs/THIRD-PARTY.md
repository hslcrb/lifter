# Bundled third-party assets

- Tesseract.js **6.0.1**, npm package, Apache-2.0. Browser API and worker copied without changes from `dist/`.
- Tesseract.js-core version is pinned in package-lock.json, Apache-2.0. Bundled scalar/SIMD LSTM `.wasm.js` files contain their WASM binaries inline. Legacy OCR is not used.
- eng/kor data `@tesseract.js-data/{eng,kor}@1.0.0/4.0.0_best_int/*.traineddata.gz`, Apache-2.0. Local language files; no model download after installation.
- Jalnan original WOFF from the Noonnu webfont link, with GC Company's official license guide PDF.
- Pretendard Regular/Bold original WOFF2 from Noonnu's versioned webfont links, SIL OFL 1.1 + copyright notices.

Notices accompany their files under extension/vendor/ocr and extension/assets/fonts. SHA-256 and sizes: [ASSET-MANIFEST.json](ASSET-MANIFEST.json). Browser assets are vendored so the release is self-contained. Development dependencies are not shipped as node_modules.
