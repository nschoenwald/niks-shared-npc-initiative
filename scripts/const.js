export const MODULE = `niks-shared-npc-initiative`;

/**
 * Log a message to the console if debug logging is enabled.
 * @param {string} message - The message to log.
 * @param {boolean} [force=false] - If true, log the message even if debug is disabled.
 */
export function log(message, force = false) {
  if (force || game.settings.get(MODULE, 'debug')) {
    console.log(`${MODULE} | ${message}`);
  }
}