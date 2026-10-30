# Nik's Shared NPC Initiative

A Foundry VTT module that ensures NPCs of the same type share the same initiative value in combat.

Thanks to TPNils for his excellent work on the "Shared NPC Initiative" module, which was the basis for this module.
https://foundryvtt.com/packages/shared-npc-initiative

I fixed some bugs, improved styling and added new functionality.

---

## Compatibility
- **Foundry VTT**: Version 14
- **Systems**: **DnD5e (6.x)**
- **Optional**: [libWrapper](https://foundryvtt.com/packages/lib-wrapper), used automatically when active
---

## Features

### Group NPC Initiative
- **Dynamic Grouping**: All NPCs derived from the same Sidebar Actor (identified by `actorId`) automatically share their initiative. Grouping can alternatively split by initiative bonus or group by combatant name (see **Group NPCs By**).
- **Roll Once**: Rolling initiative for one NPC in the group applies that score to all other NPCs of the same type in the same combat.
- **One Message per Group**: A group rolled together posts a single chat message (and a single Dice So Nice animation) instead of one identical message per NPC.
- **Seamless Dialog Bypassing**: When rolling an individual NPC whose group already has an initiative value, DnD5e's roll configuration dialog is automatically bypassed with the group's score.

### Auto-Apply to New Combatants
- **Seamless Integration**: When a new NPC is added to an ongoing combat, they automatically inherit the group's current initiative.
- **Configurable**: This behavior can be toggled via a world setting (enabled by default).

### Combat Tracker Controls
- **Toggle per Combat**: A "Group NPC Initiative" toggle is added directly to the Combat Tracker header, allowing GMs to enable or disable grouping for specific encounters on the fly. Whether new combats start with it on or off is configurable.
- **DnD5e 6.x Coordination**: Disabling the toggle on a combat automatically disables DnD5e 6.x's native initiative grouping for that encounter as well.

### DnD5e's own "Group Initiative Rolls" vs. this module
DnD5e 6.x has its own system setting that rolls once for identical tokens. The two work together, but differ:
- **DnD5e** groups tokens with the same base actor *and* the same roll formula, and only before the combat has started.
- **This module** groups according to **Group NPCs By**, at any time during combat, and also hands the group's value to NPCs that join later.

You can use either one or both. Switching this module's toggle off for a combat also switches DnD5e's grouping off for that combat.

## Settings
- **Enabled for New Combats**: (World, Boolean, default: true) Whether the "Group NPC Initiative" toggle starts switched on for newly created combats.
- **Group NPCs By**: (World, Choice, default: Base actor) Which NPCs share initiative: *Base actor*, *Base actor and initiative bonus*, or *Combatant name*.
- **Apply Initiative to New Combatant**: (World, Boolean, default: true) Automatically apply the current initiative of other combatants of the same actor type to any new combatant added to the combat tracker.
- **Enable Debug Logging**: (World, Boolean, default: false) Output diagnostic logs to the developer console.

## How it Works
The module works by:
1. Identifying NPC groups by a key built from the **Group NPCs By** setting: the `actorId` (linking unlinked tokens to their base actor), optionally combined with `system.attributes.init.total`, or the combatant name.
2. Coordinating with DnD5e 6.x's `Combatant5e#getInitiativeGroupingKey` and `dnd5e.preConfigureInitiative` hook to harmonize group rolls and bypass prompts.
3. Overriding `Combatant#getInitiativeRoll` to return the group's existing initiative (looked up live from the combat's combatants) using V14 `foundry.dice.Roll.create`, or a single shared pending roll while the group is being rolled. Re-rolling a combatant that already has a value always performs a fresh roll.
4. Hooking into `preCreateCombatant` to inject the group's initiative into newly added combatants before creation (combatants created with an initiative already set keep it).
5. Adding an ApplicationV2-compatible UI toggle to the `CombatTracker` to store a `disabled` flag on the `Combat` document (pre-set in `preCreateCombat` when **Enabled for New Combats** is off).
6. Flagging every chat message after the first one created from a shared roll, and dropping those in `preCreateChatMessage`.
7. Registering method overrides through libWrapper (`MIXED`) when it is active, and wrapping the prototype directly otherwise.

---
**Author**: nikolai.sw

---

## Other Modules by Nik

### 🎲 D&D 5e Specific
* **[Nik's DnD5e Tweaks](https://github.com/nschoenwald/niks-dnd5e-tweaks)** – Consolidated collection of quality-of-life enhancements and combat automation tweaks for DnD5e.

### ⚔️ Combat & Token Tools
* **[Nik's Action HUD](https://github.com/nschoenwald/niks-action-hud)** – Sleek, modern canvas-docked Action HUD for quick access to attacks, spells, inventory, and utility rolls.
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
* **[Nik's Scene Transformations](https://github.com/nschoenwald/niks-scene-transformations)** – Rotate scenes or add playable space around them, with tokens, walls, lights, tiles and regions moved along so everything stays in place.
