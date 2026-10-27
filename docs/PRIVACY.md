# Privacy — v3

OCR runs locally using packaged Tesseract.js, WASM and eng/kor models. No image/text uploads, telemetry, analytics, accounts or remote executable code. Image processing fetches only explicitly permitted image URLs already present on the page, without cookies (`credentials: omit`); redirects and unsupported image formats are skipped.

Extension-origin IndexedDB `lifter-vault-v3` stores remembered site origins/settings and content-hashed processed PNGs. It does not store full HTML, form fields, passwords or authenticated page responses. Original text and original image presentation are kept only in the current tab for restoration. Pixel cache is capped at approximately 40 MiB of encoded data / 100 entries. Site rules survive ordinary cache eviction; an evicted image can be processed again.

Remembering a site requests optional access to that site and registers a content script for later navigation. Image scanning separately requests access to the image origins needed for downloading. Permissions are explicit browser prompts. No broad site permission is granted on installation.

“돌려놓기” restores this tab and pauses automatic processing here. “기억 지우기” removes this site's record and processed images, unregisters its automatic script, restores open tabs of this site, and removes that site's grant. CDN grants can be managed in Chrome's extension settings. Uninstalling removes extension data. Clearing ordinary HTTP cache or the website's own storage does not erase this extension-owned IndexedDB. It is not a hidden undeletable cache.

Copy mode writes only the user's selected panel text after an explicit copy action. It never reads clipboard contents. The motion preference uses chrome.storage.local.
