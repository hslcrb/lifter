# Lifter contributor rules
- Keep the extension runtime dependency-free and local-only.
- Never read or modify form values, editable regions, attributes, scripts or styles while collecting.
- Use chatgpt/ branches, small commits with English prefixes and Korean messages.
- No pull requests or CI workflows. Integrate with explicit two-parent no-fast-forward merge commits, then delete merged task branches.
- Run npm test and python3 scripts/package.py before integration.
- Keep Figma variables and editable floating-panel components aligned with extension/panel.js.
