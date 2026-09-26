# Nik's Shared NPC Initiative

A Foundry VTT module that ensures NPCs of the same type share the same initiative value in combat.

Thanks to TPNils for his excellent work on the "Shared NPC Initiative" module, which was the basis for this module.
https://foundryvtt.com/packages/shared-npc-initiative

I fixed some bugs, improved styling and added new functionality.

---

## Compatibility
- **Foundry VTT**: Version 14
- **Systems**: **DnD5e (6.x)**
---

## Features

### Group NPC Initiative
- **Dynamic Grouping**: All NPCs derived from the same Sidebar Actor (identified by `actorId`) automatically share their initiative.
- **Roll Once**: Rolling initiative for one NPC in the group applies that score to all other NPCs of the same type in the same combat.
- **Visual Sync**: Built-in support to prevent redundant roll animations while keeping the values synchronized.
- **Seamless Dialog Bypassing**: When rolling an individual NPC whose group already has an initiative value, DnD5e's roll configuration dialog is automatically bypassed with the group's score.

### Auto-Apply to New Combatants
- **Seamless Integration**: When a new NPC is added to an ongoing combat, they automatically inherit the group's current initiative.
- **Configurable**: This behavior can be toggled via a world setting (enabled by default).

### Combat Tracker Controls
- **Toggle per Combat**: A "Group NPC Initiative" toggle is added directly to the Combat Tracker header, allowing GMs to enable or disable grouping for specific encounters on the fly.
- **DnD5e 6.x Coordination**: Disabling the toggle on a combat automatically disables DnD5e 6.x's native initiative grouping for that encounter as well.

## Settings
- **Apply Initiative to New Combatant**: (World, Boolean, default: true) Automatically apply the current initiative of other combatants of the same actor type to any new combatant added to the combat tracker.
- **Enable Debug Logging**: (World, Boolean, default: false) Output diagnostic logs to the developer console.

## How it Works
The module works by:
1. Identifying NPCs using their `actorId` (linking unlinked tokens to their base actor).
2. Coordinating with DnD5e 6.x's `Combatant5e#getInitiativeGroupingKey` and `dnd5e.preConfigureInitiative` hook to harmonize group rolls and bypass prompts.
3. Overriding `Combatant#getInitiativeRoll` to return the group's existing roll if available using V14 `foundry.dice.Roll.create`.
4. Hooking into `preCreateCombatant` to inject the group's initiative into newly added combatants before creation.
5. Adding an ApplicationV2-compatible UI toggle to the `CombatTracker` to store a `disabled` flag on the `Combat` document.

---
**Author**: nikolai.sw

---

## Other Modules by Nik

### 🎲 D&D 5e Specific
* **[Nik's DnD5e Tweaks](https://github.com/nschoenwald/niks-dnd5e-tweaks)** – Consolidated collection of quality-of-life enhancements and combat automation tweaks for DnD5e.

### ⚔️ Combat & Token Tools
* **[Nik's Token Tags](https://github.com/nschoenwald/niks-token-tags)** – Automatically numbers duplicate combatant NPCs (A, B, C…) with color-coded letter overlays.
* **[Nik's Movement Control](https://github.com/nschoenwald/niks-movement-control)** – GM controls to toggle player movement and automatically restrict/allow movement on combat start and end.
* **[Nik's Tiny Change Logs](https://github.com/nschoenwald/niks-tiny-changelogs)** – Compact, single-line chat messages logging token HP and Temp HP changes.

### 🎲 Visuals & Display
* **[Nik's Dynamic Roll Area](https://github.com/nschoenwald/niks-dynamic-roll-area)** – Dynamically restricts Dice So Nice 3D dice rolling area to exclude the sidebar / chat log across all screen resolutions and window sizes.

### ⚙️ Utilities & System Management
* **[Nik's Settings Locks](https://github.com/nschoenwald/niks-settings-locks)** – Soft-lock and hard-lock client settings and keybindings across all connected players.
* **[Nik's Compendium Search Tweaks](https://github.com/nschoenwald/niks-compendium-search-tweaks)** – Configure which compendium packs are included or excluded from native sidebar search.
* **[Nik's Show & Tell](https://github.com/nschoenwald/niks-show-and-tell)** – Share popout images to chat and paste image files directly into chat messages.
* **[Nik's Zoom / Pan Options](https://github.com/nschoenwald/niks-zoom-pan-options)** – Touchpad and scroll wheel pan/zoom controls and canvas navigation enhancements.
