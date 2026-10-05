# Normal difficulty calibration

The accepted balance produced 45 victories and 55 defeats in 100 full campaigns with real damage: 20 deterministic seeds for each of PP7, KF7, Shotgun, Sniper Rifle and Rocket Launcher. The reactive controller uses real left/right inputs, makes decisions every 0.2 seconds, seeks medkits, avoids predicted projectiles, and resolves upgrade/chest screens. It does not grant invulnerability or change player HP. These are automated controller outcomes, not a predicted human win rate.

Victories by loadout: PP7 4/20, KF7 14/20, Shotgun 1/20, Sniper 15/20, Rocket 11/20. There is still substantial weapon/controller variation; acceptance applies to the overall 45/55 sample. A separate control check produced no victories in 15 stationary runs and 2 victories in 15 medkit-seeking runs.

Changes: gradual opening pressure, stronger starter weapons, a cap of three ordinary hostile projectiles, renewed rear warnings when an attack is deferred, slower ordinary enemy firing and projectiles, more player movement speed, limited reinforcements during bosses, longer boss recovery, and one life lost per direct projectile. Marked mortar impacts still cost two life. Six starting life, timed medkits, zone rank caps and growing XP costs remain.

Run against the decrypted game page:

```sh
node sdj-commandos/tests/real-damage-simulation.cjs /tmp/game.html /tmp/results.json --tactical
```

Raw accepted results: `win-rate-simulation-20261005.json`.
