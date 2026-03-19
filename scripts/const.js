export const MODULE = `niks-shared-npc-initiative`;
export const INITIATIVE_MAP = Symbol('niks-shared-npc-initiative initiativeMap');

/**
 * Log a message to the console if debug logging is enabled.
 * @param {string} message - The message to log.
 * @param {boolean} [force=false] - If true, log the message even if debug is disabled.
 */
export function log(message, force = false) {
  let isDebug = false;
  try {
    isDebug = game.settings.get(MODULE, 'debug');
  } catch (e) {
    // Setting might not be registered yet
  }
  if (force || isDebug) {
    console.log(`${MODULE} | ${message}`);
  }
}