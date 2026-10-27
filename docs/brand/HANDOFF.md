# Lifter design handoff

Figma: https://www.figma.com/design/ncTskVmL3IvqYAy95YGjnx
Folder: Ordo Novus / Creatively / Lifter — L을 가져가 (678447937)

| Figma | Runtime |
|---|---|
| Lifter Primitives / lemon, violet, ink, paper, lilac | popup.css :root palette |
| Lifter UI / color/* aliases | CSS custom properties |
| Button, State=Ready/Pressed/Disabled/Secondary | .steal / :active / :disabled / .restore |
| Pocket | .pocket / .loot / .face and assets/icon.svg |
| Popup / Ready, Collected, Restricted | popup.html + popup.js states |
| Motion & handoff | motion.js: 620ms flight, ≤240ms stagger, 180ms squash |

Figma type: Arial for Latin, Noto Sans KR for Korean. Runtime uses local Arial, Noto Sans KR when installed, and Malgun Gothic fallback; no remote font request. Native Korean glyph metrics may differ across operating systems.

All UI text, frames, components and variables are editable. Screenshot in this directory is a review artifact, not the Figma UI implementation.
