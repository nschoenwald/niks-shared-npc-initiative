# Nik's Shared NPC Initiative

A Foundry VTT module that ensures NPCs of the same type share the same initiative value in combat.

## Features

### Group NPC Initiative
- **Dynamic Grouping**: All NPCs derived from the same Sidebar Actor (identified by `actorId`) automatically share their initiative.
- **Roll Once**: Rolling initiative for one NPC in the group applies that score to all other NPCs of the same type in the same combat.
- **Visual Sync**: Built-in support to prevent redundant roll animations while keeping the values synchronized.

### Auto-Apply to New Combatants
- **Seamless Integration**: When a new NPC is added to an ongoing combat, they automatically inherit the group's current initiative.
- **Configurable**: This behavior can be toggled via a world setting (enabled by default).

### Combat Tracker Controls
- **Toggle per Combat**: A "Group NPC Initiative" toggle is added directly to the Combat Tracker, allowing GMs to enable or disable the feature for specific encounters on the fly.

## Compatibility
- **Foundry VTT**: Compatible with Version 13 and Version 14 (Prototype).
- **Systems**: 
  - **DnD5e (5.2+)**: Specific hooks ensure seamless integration with the system's initiative configuration dialogs.
  - **PF1**: General support via standard Foundry initiative overrides.
  - **General**: Works with most systems that use the standard `CONFIG.Combatant.documentClass` behavior.

## Installation
Currently available via manifest URL (to be added to package directory).

## Settings
- **Apply Initiative to New Combatant**: (World, Boolean, default: true) Automatically apply the current initiative of other combatants of the same actor type to any new combatant added to the combat tracker.

## How it Works
The module works by:
1.  Identifying NPCs using their `actorId` (linking unlinked tokens to their base actor).
2.  Overriding `Combatant#getInitiativeRoll` to return the group's existing roll if available.
3.  Hooking into `preCreateCombatant` to inject the group's initiative before creation.
4.  Adding a UI toggle to the `CombatTracker` to store a `disabled` flag on the `Combat` document.

---
**Author**: nikolai.sw
