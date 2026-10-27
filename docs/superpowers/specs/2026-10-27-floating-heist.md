# Floating heist v2 — implementation brief and ledger

User-approved scope: replace browser popup with persistent in-page floating panel. No text selection/dragging by default. Right click → copy mode enables highlighter selection; successful copy fires confetti. Lowercase is mandatory, together with curated L/ㄴ lookalikes. Original yellow/purple brand, editable Figma and public repository remain deliverables.

## Plan
1. RED→GREEN Unicode collection + restoration tests; preserve DOM safety.
2. RED→GREEN floating panel, background injection, copy behavior tests.
3. RED→GREEN bounded motion celebration; update playground, package and docs.
4. Reconcile editable Figma frames and tokens with panel; inspect screenshot.
5. Fresh-context whole-change review; fix important findings with regressions. Test/package, explicit two-parent merge, remove feature branch.

## Decisions
- The panel is fixed in the lower-right and can collapse/close. Clicking elsewhere does not dismiss it. It is nonmodal so the website remains usable. The toolbar reopens the same panel until navigation.
- “No dragging inside” means no accidental selection or HTML drag by default; the requested right-click copy mode enables text selection. Panel positioning itself is fixed.
- Curated Unicode family instead of font OCR. Include L/l Latin forms, Korean compatibility/leading/trailing ㄴ, fullwidth and mathematical styles, corner glyphs. Exclude ambiguous I/1 and whole Hangul syllables. A diacritic following a matched letter travels with it.
- Native Web Animations handles finite letter arcs, rings, sparks, typographic bursts and 28-piece confetti. GSAP adds a runtime dependency without a required feature. No sound autoplay, flashing or perpetual particle loops.

## Evidence
- Engine changes: new family test failed 2 ≠ 22, then 12/12 engine tests passed.
- Panel tests failed for missing module and popup manifest, then passed.
- Celebration test failed for missing celebrate method, then passed.
- Full suite: 23 passing before independent review.
- Browser rendering remains a manual validation item; jsdom does not prove native selection/clipboard/extension rendering.
- Final review: fresh reviewer found NFD Hangul corruption and late clipboard effects after close; reproduced RED→GREEN and fixed.
- Copy mode lifecycle fixes also clear stale auto-exit and synchronize expanded controls. Restore completion retains priority over cancelled collect feedback.
- Final suite: 27/27. Package and all five JS syntax checks pass.
- Figma updated in place; ready/collected/copy and contextual website screenshot visually checked. Actual browser installation remains manual.
