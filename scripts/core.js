import { MODULE, log, ROLL_CACHE, cachedSettings, wrapMethod } from "./const.js";

/**
 * Whether shared initiative is disabled for a combat.
 * @param {Combat} combat
 * @returns {boolean}
 */
export function isDisabled(combat) {
  return combat.getFlag(MODULE, 'disabled') ?? false;
}

/**
 * The key of the group a combatant shares initiative with, depending on the "Group NPCs By" setting.
 * @param {Combatant} combatant
 * @returns {string|null} - null for combatants that can't be grouped (e.g. placeholders without an actor).
 */
export function getGroupKey(combatant) {
  const actorId = combatant.actorId;
  if (!actorId) return null;
  switch (cachedSettings.groupBy) {
    case 'name': return `name:${combatant.name}`;
    case 'initiative': return `${actorId}:${combatant.actor?.system.attributes?.init?.total ?? ''}`;
    default: return actorId;
  }
}

/**
 * Find the initiative already held by another NPC of the same group.
 * Scanned on demand so the value can never go stale; combats are small enough that this is cheap.
 * @param {Combat} combat
 * @param {string|null} key - The group key, see getGroupKey.
 * @param {string} [excludeId] - A combatant id to ignore (e.g. the one being rolled).
 * @returns {number|null}
 */
export function getGroupInitiative(combat, key, excludeId) {
  if (!key) return null;
  for (const c of combat.combatants) {
    if (c.id === excludeId || !Number.isFinite(c.initiative) || c.actor?.type !== 'npc') continue;
    if (getGroupKey(c) === key) return c.initiative;
  }
  return null;
}

/**
 * Get the pending (shared) roll cache of a combat.
 * @param {Combat} combat
 * @returns {Map<string, Roll>}
 */
function getRollCache(combat) {
  return combat[ROLL_CACHE] ??= new Map();
}

/**
 * Make a roll shareable between several combatants: it is evaluated once, and only the first
 * chat message created from it is posted (later ones are flagged and dropped in preCreateChatMessage).
 * @param {Roll} roll
 */
function makeShared(roll) {
  const evaluate = roll.evaluate;
  let firstResponse;
  roll.evaluate = function(...args) {
    return firstResponse ??= evaluate.call(this, ...args);
  };

  const toMessage = roll.toMessage;
  let posted = false;
  roll.toMessage = function(messageData = {}, ...args) {
    if (posted) foundry.utils.setProperty(messageData, `flags.${MODULE}.duplicate`, true);
    posted = true;
    return toMessage.call(this, messageData, ...args);
  };
}

/**
 * @param {Combatant} combatant
 * @param {() => Roll} rollCb
 * @returns {Roll}
 */
function initiativeRoll(combatant, rollCb) {
  const combat = combatant.combat;
  // Not in combat, disabled, or re-rolling an existing value
  if (!combat || isDisabled(combat) || Number.isFinite(combatant.initiative)) {
    return rollCb();
  }
  const key = getGroupKey(combatant);
  if (!key) return rollCb();

  const initiative = getGroupInitiative(combat, key, combatant.id);
  if (initiative !== null) {
    log(`Using shared initiative ${initiative} for ${combatant.name} (group ${key})`);
    return foundry.dice.Roll.create(`${initiative}`);
  }

  // Account for initiativeRoll calls happening before the first was resolved
  const cache = getRollCache(combat);
  let roll = cache.get(key);
  if (!roll) {
    log(`Rolling new initiative for ${combatant.name} (group ${key})`);
    roll = rollCb();
    makeShared(roll);
    cache.set(key, roll);
  }
  return roll;
}

/**
 * Wrap Combatant#getInitiativeRoll. Called from the module's init hook, after settings are registered.
 */
export function wrapInitiativeRoll() {
  log(`Wrapping Combatant#getInitiativeRoll`);
  wrapMethod('CONFIG.Combatant.documentClass.prototype.getInitiativeRoll', function(wrapped, ...args) {
    if (this.actor?.type !== 'npc') return wrapped(...args);
    return initiativeRoll(this, () => wrapped(...args));
  });
}

// Start new combats with grouping on or off, according to the "Enabled for New Combats" setting
Hooks.on('preCreateCombat', (combat) => {
  if (game.settings.get(MODULE, 'enabledByDefault')) return;
  if (combat.getFlag(MODULE, 'disabled') !== undefined) return;
  combat.updateSource({ [`flags.${MODULE}.disabled`]: true });
});

// Automatically apply initiative to new combatants if enabled
Hooks.on('preCreateCombatant', (combatant) => {
  if (!game.settings.get(MODULE, 'applyInitiativeToNewCombatant')) return;
  if (Number.isFinite(combatant.initiative)) return;

  const combat = combatant.combat;
  if (!combat || isDisabled(combat)) return;
  if (combatant.actor?.type !== 'npc') return;

  const initiative = getGroupInitiative(combat, getGroupKey(combatant));
  if (initiative !== null) {
    log(`Automatically applying initiative ${initiative} to new combatant ${combatant.name}`);
    combatant.updateSource({ initiative });
  }
});

// Only post one chat message for a roll shared by a group
Hooks.on('preCreateChatMessage', (message) => {
  if (message.getFlag(MODULE, 'duplicate')) return false;
});

/**
 * Drop the pending shared roll of a combatant's group, so the next roll starts fresh.
 * @param {Combatant} combatant
 */
function clearPendingRoll(combatant) {
  const key = getGroupKey(combatant);
  if (key) combatant.combat?.[ROLL_CACHE]?.delete(key);
}

// Once an initiative value is written (or cleared), the pending roll is no longer needed
Hooks.on('updateCombatant', (combatant, changed) => {
  if ('initiative' in changed) clearPendingRoll(combatant);
});

Hooks.on('deleteCombatant', clearPendingRoll);
