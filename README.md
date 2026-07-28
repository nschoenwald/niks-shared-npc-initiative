# Nik's Shared NPC Initiative

A Foundry VTT module that ensures NPCs of the same type share the same initiative value in combat.

Thanks to TPNils for his excellent work on the "Shared NPC Initiative" module, which was the basis for this module.
https://foundryvtt.com/packages/shared-npc-initiative

I fixed some bugs, improved styling and added new functionality.

---

## Compatibility
- **Foundry VTT**: Compatible with Version 13 and Version 14 (Prototype).
- **Systems**: 
  - **DnD5e (5.2+)**: Specific hooks ensure seamless integration with the system's initiative configuration dialogs.
  - **PF1**: General support via standard Foundry initiative overrides.
  - **General**: Works with most systems that use the standard `CONFIG.Combatant.documentClass` behavior.

---

## Other Modules by Nik

### 🎲 D&D 5e Specific
* **[Nik's DnD5e Tweaks](https://github.com/nschoenwald/niks-dnd5e-tweaks)** – Consolidated collection of quality-of-life enhancements and combat automation tweaks for DnD5e.

### ⚔️ Combat & Token Tools
* **[Nik's Token Tags](https://github.com/nschoenwald/niks-token-tags)** – Automatically numbers duplicate combatant NPCs (A, B, C…) with color-coded letter overlays.
* **[Nik's Movement Control](https://github.com/nschoenwald/niks-movement-control)** – GM controls to toggle player movement and automatically restrict/allow movement on combat start and end.
* **[Nik's Tiny Change Logs](https://github.com/nschoenwald/niks-tiny-changelogs)** – Compact, single-line chat messages logging token HP and Temp HP changes.

### ⚙️ Utilities & System Management
* **[Nik's Settings Locks](https://github.com/nschoenwald/niks-settings-locks)** – Soft-lock and hard-lock client settings and keybindings across all connected players.
* **[Nik's Compendium Search Tweaks](https://github.com/nschoenwald/niks-compendium-search-tweaks)** – Configure which compendium packs are included or excluded from native sidebar search.
* **[Nik's Show & Tell](https://github.com/nschoenwald/niks-show-and-tell)** – Share popout images to chat and paste image files directly into chat messages.
* **[Nik's Zoom / Pan Options](https://github.com/nschoenwald/niks-zoom-pan-options)** – Touchpad and scroll wheel pan/zoom controls and canvas navigation enhancements.

---

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
