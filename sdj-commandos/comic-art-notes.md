# Commandos: Most Wanted — tebeo visual pass, v27

## Research actually reviewed

Internet searches and selected publicly accessible material, not a reading of the entire Mortadelo y Filemón collection:

- [Penguin Libros: Lo mejor de las aventuras cortas](https://www.penguinlibros.com/es/comic-infantil/10109-libro-lo-mejor-de-las-aventuras-cortas-de-mortadelo-y-filemon-lo-mejor-de-9788402421555/fragmento). Reviewed preview images bg007_00, bg007_01, bg008_00, bg009_00 and bg010_00, alongside preliminary page bg003_01. The early black-and-white pages and Pulgarcito color page show nose-led silhouettes, loose body poses, clean panel borders, speech balloons and economical backgrounds.
- [RTVE: original by Ibáñez](https://www.rtve.es/fotogalerias/obras-de-la-exposicion-historietas-del-tebeo-1917-1937/191975/original-mortadelo-filemon-ibanez/6/). Inspected the complete photographed page as a visual reference for lettering, movement, impact stars and balloon placement.
- [Francisco Ibáñez, el Mago del Humor exhibition](https://mortadelo-filemon.es/expo/index1.html). Reviewed the exhibition introduction and contributors' discussion of movement, physical comedy and disguises.
- [Penguin: El sulfato atómico](https://www.penguinlibros.com/es/libros-ninos-7-anos/10207-libro-mortadelo-y-filemon-el-sulfato-atomico-esenciales-ibanez-1-9788402424259). Catalog search reference for the long-adventure period; no claim to have read the complete album.
- [Penguin Aula exhibition](https://penguinaula.com/es/material/exposicion-francisco-ibanez/). Discovered the educational PDF, but the web reader rejected its size. It is not counted as a reviewed document.

Publisher panels were used as research references; they are not shipped as game assets.

## Implemented art

Original canvas drawings of the existing rider, camel, twenty soldier color/role variants, five armored bosses, helicopter, drone and wolf. Rounded black outlines, expressive noses and eyes, paper-colored HUD cartelas, pale flat palettes, comic explosion bursts and smoke, speech balloons, native vector tutorial arrows and ticks. Bazaar, harbor, factory, mountains and cave have separate illustrated environments. Menus, password entry, language selector, upgrades, tutorial and repeated victory achievement use the same paper-and-ink theme. CRT scanlines and pixelated CSS rendering removed.

Comic Neue Bold is embedded for consistent lettering. Its OFL license is included at `font-comic-neue-OFL.txt`.

The new illustrated cover is `cover-comic-v27.webp`; it replaces the cover in both access and post-unlock screens. Cover generation used the built-in image generation tool. Canvas art is implemented in the game code.

## Cover generation prompt

Use case: illustration-story. Asset type: portrait cover for existing satirical side-scrolling videogame Commandos: Most Wanted. Create a complete Spanish humor comic album cover in the distinctive drawing style of Francisco Ibáñez's Mortadelo y Filemón: lively confident black ink outlines, exaggerated long noses and elastic gestures, clean flat colors, pale paper, meticulous funny background clutter, motion streaks and comic impact stars. Original game protagonist is a white-turbaned, long white bearded rider wearing a pale tunic and camouflage vest on a comically lanky expressive tan camel, carrying a compact rifle. They gallop through a chaotic bazaar while caricature soldiers in oversized helmets trip over crates, a cartoon armored tank sputters, helicopter in distance. Lighthearted comic action, no gore. Keep original game hero, do not include actual Mortadelo or Filemón characters. Title top in large red outlined hand lettering, EXACT text 'COMMANDOS:' and second line 'MOST WANTED'. Small bottom panel EXACT text 'CINCO ZONAS · CINCUENTA OLEADAS'. One explosion with EXACT text '¡PUM!'. Portrait 2:3 cover composition, richly detailed but strong clear central silhouette, no publisher logo, no signature, no pretend author credit.

## Verification

- Software canvas renders reviewed: all five zones, twenty troop variants, armored bosses, action scene, explosion, tutorial and tutorial achievement.
- Actual input-handler regression: ordered right/left presses, rejection of wrong-side input, clean start, repeated tutorial after restart and returning visit, keyboard and rotated portrait mapping.
- Repeated victory achievement and video access verified; defeat does not grant the achievement.
- Hostile bullet body and medkit cross remain visible above smoke. Caps and expiry for blasts/wrecks verified.
- Medical delivery distance, healing, expiry and skipped-medkit pressure verified.
- English recipe/HUD/tutorial/medical translation regression passed. New scenery signs and impact words have English translations.
- Full deterministic 60,000-frame campaign simulation completed all five zones with the original arsenal and evolution rules. This flow test uses invulnerability to exercise the full campaign, not to measure difficulty.
- No real mobile browser or device was used for this pass; software canvas and handler tests do not establish device performance.

The gameplay timers, ten waves per zone, medical difficulty, automatic arsenal, secret video and repeat-every-run tutorial/achievements are preserved.
