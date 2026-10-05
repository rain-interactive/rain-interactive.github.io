# Survivor + GoldenEye arsenal implementation
2026-10-05, cache version 20261005-18.

## Result

Three simultaneous attack slots. A run starts with the selected GoldenEye-style weapon and automatic hand grenades. The third slot can hold a different unlocked weapon, proximity mines or protective orbiting fangs. Newly unlocked weapons remain available for future equipment choices/runs; unlocking does not replace the initial weapon. Existing saved unlocks and victory reward remain intact.

Each attack has its own cooldown and five upgrade ranks. At rank five, a matching component and a collected chest allow evolution. Each chest evolves one eligible attack; otherwise it upgrades an equipped attack or provides another useful reward. Maxed-out upgrades are excluded, with supplies/score as an exhausted-pool fallback.

## Families

| Family | Examples | Component | Evolution behavior |
|---|---|---|---|
| Ballistics | PP7, KF7 Soviet, US AR33, RC-P90, shotguns, Sniper Rifle, Golden Gun | Penetration | Faster piercing burst; weapon identity retained |
| Explosive weapons | Grenade Launcher, Rocket Launcher, Tank Cannon | Blast area | Additional explosive projectile and larger blast |
| Energy | Moonraker Laser, Watch Laser, Taser | Capacitor | Faster penetrating beam; slows targets |
| Blades | Throwing Knife, Hunting Knife | Sharpening | Fan of piercing blades |
| Hand grenades | Automatic secondary | Blast area | Lingering napalm zone |
| Mines | Timed, Proximity, Remote; secondary proximity mines | Detonator | Chained detonations |
| Defensive orbit | Orbiting fangs | Duration | Wider guardian ring and slow effect |

There are 29 starting-weapon/gadget entries plus the automatic hand-grenade attack. The canonical RC-P90 and Moonraker Laser names replace the prior labels. Weapon-specific rates, ranges, damage, pellet spread and penetration are retained as an arcade adaptation, not an exact reproduction of N64 damage tables. Klobb has scatter, shotguns use a wide pellet pattern, grenade-launcher rounds arc and detonate on ground contact. Remote mines automatically trigger as a group when a target enters range, fitting the existing automatic controls.

## Waves and rewards

Each zone cycles through vanguard, rush, encirclement, heavy assault and final-wave phases. These change flank, spawn interval, batch size and enemy cap. Elites enter on their own schedule and drop chests; bosses also drop chests. Elite soldiers display a marker and health strip. Treasure can be attracted by the collection upgrade.

When a zone clears, outstanding gem XP is banked before transitions. Pending levels and chests are processed before proceeding. Existing five-zone progression, finale explosions, USA flag and victory-video reward are retained.

A compact three-slot HUD shows attack ranks and evolution status. Level-up cards show recipes; chests pause combat and display the reward. The end screen reports chests and discovered evolutions. 56 new translation mappings cover recipes, rewards, wave names and instructions in ES/EN.

## Validation performed

- JavaScript syntax check.
- All 29 weapon entries generate attacks.
- Three-slot cap and independent attack timers.
- Ballistic, explosive, energy, blade and gun-mine evolutions; hand-grenade napalm; guardian orbit.
- Chained and grouped remote-mine detonations.
- Chest pause and safe resume.
- XP banking and pending rewards across zone transitions.
- Maxed upgrades excluded; exhausted pool provides useful reward.
- Elite spawns across all five zones.
- Finale and persisted victory unlock.
- Full five-zone automated simulation to victory, resolving level-ups and chest rewards.
- Canvas rendering of all five zones and all 20 soldier looks, plus progressed-loadout visual inspection.
- English recipe, HUD, summary and instruction checks.
- Encrypted gate round-trip before deployment.

The harness uses a real Canvas renderer and a mock DOM. It does not verify actual mobile touch handling, browser fullscreen or mobile performance, and its invulnerability setting is for mechanics coverage rather than difficulty calibration.

## Source references

- Nintendo instruction-booklet transcription: https://www.world-of-nintendo.com/manuals/nintendo_64/goldeneye_007.shtml
- Weapon list and cheat-only entries: https://goldeneye.fandom.com/wiki/Weapons
- Arsenal comparison: https://rhodesmill.org/goldeneye/details.html
- Prior design analysis: ./vampire-survivors-design-study.md
