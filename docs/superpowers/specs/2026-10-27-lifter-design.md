# Lifter — L을 가져가~

## Intent
Turn the Korean Take the L meme into a literal, reversible letter heist. The user delegated naming, implementation and GSAP decisions, requested a public GitHub repository and editable Figma UI in Ordo Novus / Creatively / a new folder.

## Decisions
- Chrome/Edge Manifest V3; plain JavaScript, HTML, CSS; no build required for runtime.
- Single active-tab action. Default uppercase ASCII L; optional lowercase l. No persistent site access.
- Remove L from rendered text nodes, retaining original node identity and originals in memory for restore. Never alter attributes, input values, editable text, script/style, SVG or canvas. Open shadow roots supported. Cross-origin frames are outside activeTab scope.
- One-shot collection; a second click collects newly added text. Restore only unchanged stolen nodes, preserving live application updates. Navigation clears page memory.
- No network requests or analytics. Store only toggle preferences locally.
- Neo-brutalist lemon #F9EF53 / violet #7654D6 / ink #211C2D / paper #FFFDF3 / lilac #E4DAFF. 3px strokes, 5px hard shadows, 12px corners. Bold system sans, Korean fallback. Editable Figma tokens and component variants.
- Motion: measured 620ms letter flight, stagger capped at 240ms, single pocket squash. Maximum 24 visual particles; all eligible letters still collected. Reduced-motion disables flights. No ambient floating, gradients, or looping sparkle.

## Approaches and GSAP
1. CSS + Web Animations API (chosen): sufficient for a bounded flight and squash, no runtime dependency or bundling.
2. Locally bundled GSAP: feasible under MV3, useful for complex timelines, unnecessary here.
3. Permanent automatic content script: declined because a joke should start with a deliberate click.

## UI
360px popup with Lifter wordmark, small version chip, violet pocket stage, collected count, primary steal action, secondary restore, lowercase and motion toggles, inline status/error and local-only footer. States: ready, working, success, empty, restricted and restore conflict. Popup matches Figma dimensions and tokens.

## Limits
DOM text only; not pixels inside images, pseudo-elements, closed shadow roots or inaccessible frames. Browser internal/store pages restrict injection. Large pages handled in cancellable chunks; rendered text policy excludes display:none/visibility:hidden, including offscreen but rendered text.

## Sources
https://minenews.stibee.com/p/585/
https://www.careet.net/2008
https://developer.chrome.com/docs/extensions/develop/concepts/activeTab
https://developer.chrome.com/docs/extensions/reference/api/scripting
https://gsap.com/docs/v3/Installation/
