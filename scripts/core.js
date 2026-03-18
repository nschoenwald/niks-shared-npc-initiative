import { MODULE, log, INITIATIVE_MAP } from "./const.js";

const cache = Symbol('niks-shared-npc-initiative cache')

/**
 * Get or create the initiative map for a combat.
 * @param {Combat} combat 
 * @returns {Map<string, number>}
 */
export function getInitiativeMap(combat) {
  if (combat[INITIATIVE_MAP]) return combat[INITIATIVE_MAP];
  
  const map = new Map();
  for (const c of combat.combatants.values()) {
    if (typeof c.initiative === 'number' && c.actorId) {
      map.set(c.actorId, c.initiative);
    }
  }
  combat[INITIATIVE_MAP] = map;
  return map;
}

/** 
 * @param {Combatant} combatant
 * @param {() => Roll} rollCb
 * @returns {Roll}
 */
function initiativeRoll(combatant, rollCb) {
  if (combatant.combat.getFlag(MODULE, 'disabled') ?? false) {
    // disabled
    return rollCb();
  }
  if (typeof combatant.initiative === 'number') {
    // re-roll initiative
    return rollCb();
  }
  combatant.combat[cache] ??= {};
  
  const actorId = combatant.actorId;
  if (!actorId) {
    // placeholder combatants, maybe also other usecases?
    return rollCb();
  }

  const map = getInitiativeMap(combatant.combat);
  if (map.has(actorId)) {
    const initiative = map.get(actorId);
    log(`Using cached initiative ${initiative} for Actor ${combatant.actor.name} (${actorId}) from Lookup Map`);
    return new Roll(`${initiative}`);
  }

  // Account for initiativeRoll calls happening before the first was resolved
  if (!combatant.combat[cache][actorId]) {
    log(`Rolling new initiative for Actor ${combatant.actor.name} (${actorId})`);
    combatant.combat[cache][actorId] = rollCb();
    /** @type {Function} */
    const evaluate = combatant.combat[cache][actorId].evaluate;
    let firstResponse;
    combatant.combat[cache][actorId].evaluate = function(...args) {
      if (!firstResponse) {
        firstResponse = evaluate.call(this, args);
      }
      return firstResponse;
    }
  }
  /** @type {Roll} */
  const roll = combatant.combat[cache][actorId];
  return roll;
}

Hooks.once('init', () => {
  log(`Initializing hooks and overrides`);

  /** @type {Function} */
  const originalGetInitiativeRoll = CONFIG.Combatant.documentClass.prototype.getInitiativeRoll;
  /** @this {Combatant} */
  CONFIG.Combatant.documentClass.prototype.getInitiativeRoll = function(...args) {
    if (this.actor?.type !== 'npc') {
      return originalGetInitiativeRoll.call(this, ...args)
    }
    return initiativeRoll(this, () => originalGetInitiativeRoll.call(this, ...args));
  }
});

// Automatically apply initiative to new combatants if enabled
Hooks.on('preCreateCombatant', (combatant, data, options, userId) => {
  if (!game.user.isGM) return;
  if (!game.settings.get(MODULE, 'applyInitiativeToNewCombatant')) return;
  
  const combat = combatant.combat;
  if (!combat || (combat.getFlag(MODULE, 'disabled') ?? false)) return;
  if (combatant.actor?.type !== 'npc') return;

  const actorId = combatant.actorId;
  if (!actorId) return;

  const map = getInitiativeMap(combat);
  if (map.has(actorId)) {
    const initiative = map.get(actorId);
    log(`Automatically applying initiative ${initiative} to new combatant ${combatant.name} (Actor ${actorId}) from Lookup Map`);
    combatant.updateSource({ initiative: initiative });
  }
});

// Update the cache whenever a combatant's initiative changes
Hooks.on('updateCombatant', (combatant, data, options, userId) => {
  if (data.initiative === undefined || !combatant.actorId) return;
  const map = combatant.combat[INITIATIVE_MAP];
  if (map) {
    if (data.initiative === null) {
      map.delete(combatant.actorId);
    } else {
      map.set(combatant.actorId, data.initiative);
    }
  }
});

// Clear cache when the last combatant with a given baseUuid is removed
Hooks.on('deleteCombatant', (combatant, options, userId) => {
  const combat = combatant.combat;
  if (!combat) {
    return;
  }

  const actorId = combatant.actorId;
  if (!actorId) {
    return;
  }

  // Check if any other combatants with the same actorId remain in combat
  let hasRemainingCombatant = false;
  for (const c of combat.combatants.values()) {
    if (c.actorId === actorId) {
      hasRemainingCombatant = true;
      break;
    }
  }

  // If no combatants with this actorId remain, clear the cache entries
  if (!hasRemainingCombatant) {
    if (combat[cache]?.[actorId]) {
      delete combat[cache][actorId];
    }
    const map = combat[INITIATIVE_MAP];
    if (map) {
      map.delete(actorId);
    }
  }
});