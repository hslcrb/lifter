# Verification — floating heist 2.0.0 — 2026-10-27

## Passed
- `npm test`: **27/27**, node:test + jsdom.
- Toolbar injection is a singleton and uses a service worker; manifest has no popup. Restricted injection gets a descriptive title and badge.
- Panel persists after outside click; close/reopen retains restore state. Collapse, copy-mode selection, native copy handler and copy confirmation tested.
- Default drag prevention; right-click enables highlighter mode. Only selected panel text is written; selection outside the panel is untouched.
- Unicode L/l/ㄴ family, supplementary mathematical characters and attached accents counted as letters, restored exactly. NFD Hangul syllable components remain intact; standalone Jamo collected.
- Same-node restoration, working link listeners, unchanged href; editable, hidden, script/style, SVG/select and document.designMode exclusions.
- Dynamic additions, open shadow roots, application-edit conflicts, bounded geometry (96 attempts / 24 flights), chunk cancellation.
- Reduced/disabled motion creates no overlay; cleanup cancels animation resources. Copy confetti is bounded and targeted.
- Pending clipboard completion after close cannot revive effects; reentering copy mode cancels the previous auto-exit. Restore during a pending collection retains its result message.
- `node --check` on all five runtime scripts.
- `python3 scripts/package.py`: MV3, exact permissions, no host permissions and referenced files checked; `dist/lifter-2.0.0.zip` generated.
- Editable Figma floating ready/collected/copy states and website composition updated. Screenshot inspected after correcting background paint cache; variable bindings retained, flight token 720ms.

## Independent review
A fresh reviewer identified decomposed Hangul corruption and a late clipboard completion after panel close. Both were reproduced with failing regression tests and fixed. Copy-mode collapse-label and stale timer behavior were covered together; pending collection no longer overwrites restore feedback.

## Limits of this verification
An actual unpacked Chrome/Edge installation and real-site rendering have **not** been verified. The connected browser could not reach the workspace server in the earlier session; inline previews were blocked by browser policy. jsdom does not establish native Range geometry, trusted clipboard events in Shadow DOM, CSS layout, or Web Animations appearance. Figma screenshots show editable design output, not running-extension evidence.

## Manual acceptance
1. Load `extension/` as an unpacked Chrome/Edge extension, or extract the installation ZIP. Reload the extension if upgrading from v1, then refresh existing test tabs.
2. On an HTTPS page, click the toolbar icon; panel stays visible through outside clicks and scrolling. Collapse, close, reopen.
3. Collect L/l/ㄴ/lookalikes; verify arcs/rings/bursts/impact confetti. Restore and verify links/inputs are unaffected.
4. Right-click within panel → Copy. Drag text; Ctrl/Cmd+C or selection-copy button. Paste elsewhere and verify exact text and confetti. Other page selections remain native.
5. Test OS reduced motion, effect toggle, narrow viewport and short window. Test `chrome://` restriction feedback.
6. Serve `docs/demo/` using the README command for a reproducible playground with the actual engine, panel and motion modules.
