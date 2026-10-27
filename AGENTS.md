# Lifter contributor rules
- Keep runtime local-only; v3 explicitly permits bundled Tesseract.js/WASM/models for requested image OCR. No remote executable code.
- Never read or modify form values, editable regions, scripts or styles while collecting text. Image collection may alter only the selected image presentation, reversibly, as explicitly requested.
- Use chatgpt/ branches, small commits with English prefixes and Korean messages.
- No pull requests or CI workflows. Integrate with explicit two-parent no-fast-forward merge commits, then delete merged task branches.
- Run npm test and python3 scripts/package.py before integration.
- Keep Figma variables and editable floating-panel components aligned with extension/panel.js.
