# Metal Slug visual study — Commandos: Most Wanted
Date: 2026-10-05. First research and implementation pass.

## Scope actually reviewed
26 downloaded reference images: 17 official Metal Slug 6 screenshot thumbnails, 8 official story/character/item/feature panels from Metal Slug, X and 3, and one Metal Slug 2 desert screenshot. Also inspected sampled frames from SNK's anniversary background video. This is a curated study, not an exhaustive archive of everything online.

## Sources
- SNK anniversary gallery and retrospective: https://www.snk-corp.co.jp/us/anniversary/metalslug30th/
- Video frames inspected: https://www.snk-corp.co.jp/us/anniversary/metalslug30th/assets/video/bg_ms30th_v01_sp.mp4
- Metal Slug official: https://game.snk-corp.co.jp/official/metalslug_sp/english/
- Metal Slug X official: https://www.snk-corp.co.jp/official/metalslugx/english/
- Metal Slug 3 official: https://www.snk-corp.co.jp/us/games/steam/metalslug3/
- Metal Slug 6 official screenshot gallery: https://game.snk-corp.co.jp/official/ms6/screenshot/index.html
- Metal Slug 2 desert image: https://media.rawg.io/media/screenshots/558/558c45be51bc1115e243c46280832a1b.jpg
- Metal Slug 2 screenshot gallery found: https://steamcommunity.com/app/366260/screenshots/
- Metal Slug X screenshot gallery found: https://www.mobygames.com/game/4048/metal-slug-x/screenshots/
- Official illustration gallery found: https://www.metalslug10th.com/english/gallery/illust.php
- Official MS3 publisher screenshot listing: https://store.steampowered.com/app/250180/METAL_SLUG_3/
- Gameplay videos found, not fully watched: https://www.youtube.com/watch?v=IVRewEAyN-E and https://www.youtube.com/watch?v=H9aNvTgukHk
- Developer retrospective found, not fully watched: https://www.dotemu.com/watch-the-new-video-diary-metal-slug-tactics-the-legacy/ (https://www.youtube.com/watch?v=e8gVDe7Hq0c)
- Official PS2 video archive found; not used as a reference for 2D sprites: https://game.snk-corp.co.jp/official/metalslug/download/index.html

## Visual observations and applied changes
| Observation from inspected references | Applied original art |
| --- | --- |
| Rounded machinery with sloped armor, dark undersides and pale edge highlights | New tank hull, turret, rolling tread segments, seven wheels, panel bolts and cannon recoil |
| Expressive heads and visible contact/pass poses | Redrawn soldiers across 20 existing uniform variants, 8 stepped gait poses, bigger helmet/face silhouettes and firing recoil |
| Chunky aircraft with glass and mechanical detailing | New gunship silhouette, cockpit facets, vents, landing skids and 8 rotor poses |
| Bright flash followed by orange fire and gray curling smoke | 18 cached explosion cels, sparks and smoke lobes; bounded to 16 active blasts |
| Warm desert surfaces with broken plaster and exposed masonry | Ochre wall palette, grouped chips, cracks, darker cornices, ground scuffs |
| Distinct protagonist silhouette | White clothing and longer white beard; existing camel and rider design retained |

These are original canvas drawings informed by the references; downloaded SNK images/video are not bundled into the game's runtime. Audio, movement, weapons, combat balance, five-stage progression, reward video and ES/EN controls retain their existing behavior.

## Validation
- JavaScript syntax checks passed.
- Actual drawing code rendered successfully for all five zones and all 20 troop variants with a canvas implementation.
- 900 update frames completed without runtime errors in a mocked DOM simulation.
- Rendered before/after scenes and an explosion frame inspected.
- Encrypted game payload round-trip verified.
- Device browser performance and playtesting remain to be checked on real phones.

## Next distinct research targets
- Camel gait and cloth fold studies from Metal Slug 2/X desert footage.
- Full-resolution mission captures rather than small MS6 thumbnails.
- Distinct boss silhouettes per stage, beyond the current turret attachments.
- Character death/impact poses and persistent vehicle wreckage.
- More detailed harbor and factory material studies.

For future passes, extend this log with references actually viewed and concrete implemented changes. Do not claim every online image or video has been reviewed.
