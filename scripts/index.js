import { MODULE, log, cachedSettings } from './const.js';
import { wrapInitiativeRoll } from './core.js';
import './ui.js';
import { wrapGroupingKey } from './dnd5e.js';

Hooks.once('init', () => {
  game.settings.register(MODULE, "debug", {
    name: "NIKS_SHARED_NPC_INITIATIVE.DebugName",
    hint: "NIKS_SHARED_NPC_INITIATIVE.DebugHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: value => cachedSettings.debug = value
  });
  cachedSettings.debug = game.settings.get(MODULE, "debug");

  log(`Registering settings in index.js`);
  game.settings.register(MODULE, "enabledByDefault", {
    name: "NIKS_SHARED_NPC_INITIATIVE.EnabledByDefaultName",
    hint: "NIKS_SHARED_NPC_INITIATIVE.EnabledByDefaultHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE, "groupBy", {
    name: "NIKS_SHARED_NPC_INITIATIVE.GroupByName",
    hint: "NIKS_SHARED_NPC_INITIATIVE.GroupByHint",
    scope: "world",
    config: true,
    type: String,
    choices: {
      actor: "NIKS_SHARED_NPC_INITIATIVE.GroupByActor",
      initiative: "NIKS_SHARED_NPC_INITIATIVE.GroupByInitiative",
      name: "NIKS_SHARED_NPC_INITIATIVE.GroupByCombatantName"
    },
    default: "actor",
    onChange: value => cachedSettings.groupBy = value
  });
  cachedSettings.groupBy = game.settings.get(MODULE, "groupBy");

  game.settings.register(MODULE, "applyInitiativeToNewCombatant", {
    name: "NIKS_SHARED_NPC_INITIATIVE.ApplyInitiativeToNewCombatantName",
    hint: "NIKS_SHARED_NPC_INITIATIVE.ApplyInitiativeToNewCombatantHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  wrapInitiativeRoll();
  wrapGroupingKey();
});
