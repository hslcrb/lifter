# Verification — Lifter 3.0.0

- `npm test`: **41 tests passing** (node:test + jsdom + fake-indexeddb).
- Korean 롯데→오떼, 롯데리아→오떼이아, 라면→아면, 서울→서우, compound rieul finals, idempotence and exact original-node restore.
- Existing letter family, editing/hidden exclusions, conflicts, dynamic/shadow text and bounded motion retained.
- IndexedDB persistence between connections and origin-specific site+image deletion.
- Permission request happens synchronously before awaiting storage. Remember registers content scripts. Forget unregisters/broadcasts/restores/removes origin grant; delayed permission cannot recreate forgotten memory.
- Automatic revisits, mutation during slow OCR, delayed image load and cancellation/restore epoch covered.
- OCR rectangles require confident target symbols; line-height rectangles are bounded to image dimensions. Original presentation restored; new image sources remove stale masks.
- `node scripts/verify-ocr.cjs`: production offscreen processing with real local Tesseract eng+kor + canvas. Fixture `LOVE little LIFT`: **4** L/l symbols. All erased rectangles have alpha=0; untouched background remains alpha=255.
- Bundled LSTM scalar/SIMD core files verified to contain embedded WASM; local models and licenses present. Runtime extension contains no npm node_modules or remote executable imports in app code.
- Font specimen rendered with actual bundled fonts; original binaries unmodified. Figma updated, native text uses explicitly documented Noto fallback because the tool has neither requested font.

## Independent review fixes
The reviewer reproduced lost dynamic content during OCR, missed slow image loads, late restore unpausing, pending permission overriding Forget, and diagnosed Chrome permission gesture timing. Targeted regressions and full suite pass. Cache eviction now removes only necessary oldest entries.

## Browser validation boundary
No actual unpacked Chrome extension installation has been exercised. Node verifies OCR/alpha and jsdom verifies behavior; these do not establish Chromium extension permission dialogs, content security policies, rendered CSS image replacement, Shadow DOM clipboard or visual animation. Supported image formats are static PNG/JPEG/WebP/BMP, <=8MB and <=4MP. GIF/SVG/background/canvas/iframe images, inaccessible or redirected image URLs are skipped. OCR is fallible and does not identify every stylized L; 75 confidence threshold favors keeping uncertain pixels. Per scan, 40 images are processed sequentially; remembered mode continues subsequent batches.

## Manual acceptance
Install extension ZIP, reload extension and test page. Collect on an HTTPS site, allow that origin, verify Korean examples. Reload and navigate within the origin: text is reapplied after document_idle (a first-paint flash is possible). Add dynamic text and delay image loading. Click image scan and allow needed image origins; verify holes expose the website underneath. Restore during OCR, then mutate page: it remains paused. Forget, reload and verify no automatic collection. Test copy mode, reduced motion and restrictive CSP pages. Model processing is local; image downloads still use the network.

## v3.1 playground

47 tests passed, including restore/forget during asynchronous raids and initialization. Chromium cloud browser: visual inspection, full text/Hangul theft, poster transparency, restore and remembered reload verified on served identical playground assets. Native extension installation/optional-host permissions remain unverified. Poster unit test checks all 7 clear rectangles are bounded and restoration resets the PNG; actual alpha implementation uses canvas clearRect.
