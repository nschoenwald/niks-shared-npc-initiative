import { MODULE } from "./const.js";
import { getInitiativeMap } from "./core.js";

/**
 * @typedef {object} InitiativeRollDataOptions
 * @property {-1 | 0 | 1} advantageMode
 * @property {boolean} configured
 * @property {(undefined | number | string)} fixed
 * @property {string} flavor
 * @property {boolean} halflingLucky
 * @property {null | number} maximum
 * @property {null | number} minimum
 */

/**
 * @typedef {object} InitiativeRollData
 * @property {object} data
 * @property {InitiativeRollDataOptions} options
 * @property {*} parts
 * @property {Actor} subject
 */

// Skip the roll prompt for dnd5e by setting a fixed initiative value
// when the actor's group already has one.
// Note: This uses game.combat (the currently viewed combat) because the
// dnd5e.preConfigureInitiative hook only provides the actor, not the combat.
// This is correct in the vast majority of cases, but could theoretically
// produce wrong results if multiple combats are active simultaneously.
Hooks.on(`dnd5e.preConfigureInitiative`, (/** @type {Actor} */actor, /** @type {InitiativeRollData} */rollData) => {
  if (actor.type !== 'npc' || !game.combat) {
    return;
  }
  if (game.combat?.getFlag(MODULE, 'disabled') ?? false) {
    // disabled
    return;
  }

  const map = getInitiativeMap(game.combat);

  // For unlinked tokens, actor.isToken is true and actor.token.actorId gives
  // the base sidebar actor ID. For linked tokens or sidebar actors, actor.id
  // is already the correct identifier.
  const actorId = actor.isToken ? actor.token.actorId : actor.id;

  if (map.has(actorId)) {
    rollData.options.fixed = map.get(actorId);
    return;
  }
})