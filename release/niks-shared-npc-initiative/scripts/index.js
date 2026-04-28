import { MODULE, log } from './const.js';
import './core.js';
import './ui.js';
import './dnd5e.js';

Hooks.once('init', () => {
  game.settings.register(MODULE, "debug", {
    name: "NIKS_SHARED_NPC_INITIATIVE.DebugName",
    hint: "NIKS_SHARED_NPC_INITIATIVE.DebugHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  log(`Registering settings in index.js`);
  game.settings.register(MODULE, "applyInitiativeToNewCombatant", {
    name: "NIKS_SHARED_NPC_INITIATIVE.ApplyInitiativeToNewCombatantName",
    hint: "NIKS_SHARED_NPC_INITIATIVE.ApplyInitiativeToNewCombatantHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });
});