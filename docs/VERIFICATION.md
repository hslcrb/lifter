# Verification — 2026-10-27

## Passed
- `npm test`: **18/18** tests; node:test + jsdom.
- Content bridge singleton, sender guard, async collect/status/restore.
- Same-node restoration, working link listener and unchanged href.
- Uppercase/default and lowercase/opt-in; repeated clicks and dynamic additions.
- Inputs, editable descendants, document.designMode, hidden elements, scripts/styles, SVG/select excluded.
- Open shadow roots collected and restored.
- Website changes retained; conflict count survives status lookup.
- Geometry attempts bounded at 96, visible particles at 24; no geometry when motion disabled.
- Cancellation between real DOM chunks.
- Reduced-motion and disabled-motion: no overlay; explicit clear removes isolated overlay.
- Popup collect/restore, restricted-page explanation and injection-error handling.
- `node --check` on all four runtime JS files.
- `python3 scripts/package.py`: Manifest V3, exact permission set and referenced files validated; distributable ZIP generated.
- Editable Figma ready-state screenshot reviewed: header clipping fixed; compact 572px frame, clear controls and readable status.

## Independent review
Three concrete findings were reproduced and fixed with RED → GREEN regressions: unbounded offscreen geometry, document editing mode, and lost restore-conflict records. Added real chunk-cancellation coverage.

## Not claimed
The connected user browser could not reach the workspace HTTP server (connection refused). Inline data-URL preview was disallowed by browser security policy; no workaround was attempted. An actual unpacked Chrome/Edge installation and real-site flight rendering were **not** verified in this session. jsdom tests do not validate browser permission grants, actual Range geometry, CSS layout or Web Animations rendering. The included playground makes manual verification straightforward.

## Manual acceptance
Load extension/ in Chrome or Edge. Open a normal HTTPS page with L/l. Collect, reopen popup, restore, change options, disable animations, and refresh. Verify chrome://extensions reports no errors. Open docs/demo via the documented local server to check the motion and protected input/editable areas.
