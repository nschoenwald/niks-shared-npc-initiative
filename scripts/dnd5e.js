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

// Skip the roll prompt for dnd5e
Hooks.on(`dnd5e.preConfigureInitiative`, (/** @type {Actor} */actor, /** @type {InitiativeRollData} */rollData) => {
  if (actor.type !== 'npc' || !game.combat) {
    return;
  }
  if (game.combat?.getFlag(MODULE, 'disabled') ?? false) {
    // disabled
    return;
  }

  const map = getInitiativeMap(game.combat);
  const actorId = actor.isToken ? actor.token.actorId : actor.id;

  if (map.has(actorId)) {
    rollData.options.fixed = map.get(actorId);
    return;
  }
})