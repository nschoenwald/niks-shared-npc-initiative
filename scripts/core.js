import { MODULE } from "./const.js";

const cache = Symbol('niks-shared-npc-initiative cache')

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
  for (const c of combatant.combat.combatants.values()) {
    if (typeof c.initiative !== 'number') {
      continue;
    }
    if (c.actorId === actorId) {
      // Purely visual so the user doesn't think the roll happened twice
      // Can't rely on it though as this sync function can be called before the first async roll resolved
      // This method is also persistent
      return new Roll(`${c.initiative}`);
    }
  }

  // Account for initiativeRoll calls happening before the first was resolved
  if (!combatant.combat[cache][actorId]) {
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
  console.log(`${MODULE} | Initializing hooks and overrides`);

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

  for (const c of combat.combatants.values()) {
    if (typeof c.initiative !== 'number') continue;
    if (c.actorId === actorId) {
      combatant.updateSource({ initiative: c.initiative });
      break;
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

  // If no combatants with this actorId remain, clear the cache entry
  if (!hasRemainingCombatant && combat[cache]?.[actorId]) {
    delete combat[cache][actorId];
  }
});