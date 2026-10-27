# Built-in playground implementation plan

Goal: Ship an offline fictional editorial collage inside Lifter, with working text, Hangul, image theft, restoration, memory and the existing floating panel.

Architecture: reuse engine/panel/motion; a playground adapter owns its authored raster poster and local remembered state. Options opens in a tab. No new permissions, remote assets or autoplay sound.

Reference: Instagram De89lMVku_R slide 3, visually inspected: white collage, red emphasis, uneven captions, pasted reference cards and reaction cutaways. Create original content, not copies of its photographs.

Decisions delegated by user: fictional “월요일 회피 연구소”; yellow/purple brand with red editor annotations; finite triggered jump cuts, reduced-motion support. Authored image uses known glyph rectangles, explicitly described as such; external image OCR remains v3's OCR.

- [x] Create responsive collage and adapter; test actual engine theft, restore, persisted revisit, blocked storage and image clear bounds.
- [x] Add options entry and restricted-page toolbar entry without changing floating panel design.
- [x] Run suite and package v3.1.0, browser visual/interaction review where accessible, fresh code review, publish branch and explicit merge.

Review focus: protected controls survive; repeated collection doesn't inflate counts; restore pauses remembered auto collection; image transparent area preserves other pixels; narrow screens keep controls reachable.

Review: shared restore invalidation and remembered-init epoch guard fixed with failing-then-passing regressions.
