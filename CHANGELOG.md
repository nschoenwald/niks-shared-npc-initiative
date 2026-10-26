# Changelog

All notable changes to this project will be documented in this file.

## [14.3.0] - 2026-10-26
### Added
- **Group NPCs By**:
  - New setting that chooses which NPCs share an initiative value: **Base actor** (default, same as before), **Base actor and initiative bonus**, or **Combatant name**.
  - **Base actor and initiative bonus** lets a variant built from the same actor (e.g. a goblin boss with a higher initiative bonus) roll separately from the rest of its group.
- **Enabled for New Combats**:
  - New setting that chooses whether the **Group NPC Initiative** toggle starts switched on or off for newly created combats. Existing combats keep their current toggle.
- **libWrapper Support**:
  - If libWrapper is installed and active, the module uses it automatically, which reduces conflicts with other combat modules.

### Changed
- **Group Rolls: One Chat Message per Group**:
  - Rolling initiative for a group of NPCs now posts a single chat message (and a single Dice So Nice animation) instead of one identical message per NPC.
- **Combat Tracker Toggle: Styling**:
  - The **Group NPC Initiative** toggle now matches the light and dark themes in every combination, in the sidebar and in the popped-out tracker, and uses Foundry's standard tooltip.
- **Performance Improvements**:
  - Less work is done while rolling initiative, especially with DnD5e's own **Group Initiative Rolls** setting enabled.
- **Code Cleanup**:
  - Removed unused code and leftover files from earlier versions. Nothing changes in how the module looks or behaves.

### Fixed
- **Re-Rolling Initiative**:
  - Fixed re-rolling initiative for an NPC that already has a value repeating the old number instead of making a new roll.
- **Auto-Apply to New Combatants: Group Values**:
  - Fixed new NPCs sometimes not picking up the group's initiative after other group members were removed, reset, or added with a value already set.
  - Fixed NPCs that are added to combat with an initiative already set (e.g. duplicated combatants) having their value overwritten.
  - Auto-applying now also works when a player, not only the GM, adds their own NPC token to combat.
- **Combat Tracker Toggle: Wrong Combat**:
  - Fixed the toggle sometimes showing the state of a different combat than the one currently displayed.

## [14.2.0] - 2026-09-26
### Added
- **DnD5e Group Initiative Rolls: Per-Combat Toggle**:
  - Switching **Group NPC Initiative** off for a combat now also switches DnD5e's own **Group Initiative Rolls** off for that combat.

### Changed
- **Compatibility: Foundry VTT V14 and DnD5e 6.x**:
  - The module now requires Foundry VTT Version 14 and DnD5e 6.x.
- **Combat Tracker Toggle**:
  - Updated for the V14 combat tracker. The toggle always applies to the combat currently shown in the tracker.
- **Roll Dialog Skipping: Multiple Combats**:
  - Skipping DnD5e's roll dialog for NPCs whose group already has initiative now works reliably when several combats exist.

### Fixed
- **Resetting Initiative**:
  - Fixed an old roll being reused after an NPC's initiative was cleared or reset.

### Removed
- **Foundry VTT V13 and Other Systems**:
  - Dropped support for Foundry VTT V13, and for PF1 and other systems.

## [14.1.1] - 2026-02-14
### Added
- Initial release.
- **Features included**:
  - Shared initiative for NPCs of the same type
  - Per-combat **Group NPC Initiative** toggle in the combat tracker
  - Automatic initiative for NPCs added to an ongoing combat
