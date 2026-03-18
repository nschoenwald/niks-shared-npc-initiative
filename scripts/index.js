import { MODULE } from './const.js';
import './core.js';
import './ui.js';
import './dnd5e.js';

console.log(`${MODULE} | Loading index.js`);

Hooks.once('init', () => {
  console.log(`${MODULE} | Registering settings in index.js`);
  game.settings.register(MODULE, "applyInitiativeToNewCombatant", {
    name: game.i18n.localize("NIKS_SHARED_NPC_INITIATIVE.ApplyInitiativeToNewCombatantName") || "Apply Initiative to New Combatant",
    hint: game.i18n.localize("NIKS_SHARED_NPC_INITIATIVE.ApplyInitiativeToNewCombatantHint") || "Automatically apply the current initiative of other combatants of the same actor type to any new combatant added to the combattracker.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });
});