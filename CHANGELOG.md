# Changelog

All notable changes to this project will be documented in this file.

## [14.2] - 2026-09-26

### Breaking Changes & Compatibility
- **Foundry VTT V14 Exclusive**: Upgraded compatibility strictly to Foundry Virtual Tabletop Version 14+. Dropped legacy support for Foundry V13.
- **DnD5e 6.x Exclusive**: Configured system relationship exclusively for DnD5e 6.x (`>=6.0.0`). Removed legacy PF1 and generic multi-system entries.

### Enhancements & Bug Fixes
- **DnD5e 6.x Grouping Coordination**: Wrapped `Combatant5e#getInitiativeGroupingKey` to ensure that when the module's per-combat toggle is disabled, DnD5e 6.x's built-in `initiativeGroupRoll` is also bypassed for that combat encounter.
- **Roll Factory Modernization**: Updated fixed-initiative Roll instantiation to use `foundry.dice.Roll.create()` in full compliance with Foundry V14 standards and DnD5e's `CONFIG.Dice.BasicRoll`.
- **Combat Tracker (ApplicationV2) Compatibility**: Updated tracker UI rendering to target ApplicationV2 native HTML elements and resolve currently viewed combat via `combatTracker.viewed`.
- **Robust Multi-Combat Resolution**: Enhanced `dnd5e.preConfigureInitiative` hook to reliably determine the relevant combat in multi-encounter or background combat scenes.
- **Cache Management**: Added cleanup for `ROLL_CACHE` when combatant initiative is cleared or reset to null.

---

## [14.1.1] - 2026-02-14
- Initial release with per-combat toggle and auto-application of initiative to newly created combatants.
