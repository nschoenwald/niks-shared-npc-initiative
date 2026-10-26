export const MODULE = `niks-shared-npc-initiative`;
export const ROLL_CACHE = Symbol('niks-shared-npc-initiative rollCache');

/**
 * Settings read on hot paths, kept in sync by the settings' onChange handlers.
 * @type {{debug: boolean, groupBy: "actor"|"initiative"|"name"}}
 */
export const cachedSettings = {
  debug: false,
  groupBy: 'actor'
};

/**
 * Log a message to the console if debug logging is enabled.
 * @param {string} message - The message to log.
 * @param {boolean} [force=false] - If true, log the message even if debug is disabled.
 */
export function log(message, force = false) {
  if (force || cachedSettings.debug) {
    console.log(`${MODULE} | ${message}`);
  }
}

/**
 * Wrap a method, through libWrapper when it is active, otherwise by replacing it directly.
 * @param {string} target - Path of the method from globalThis, e.g. "CONFIG.Combatant.documentClass.prototype.foo".
 * @param {(wrapped: Function, ...args: any[]) => any} wrapper - Called with the original method bound to `this`.
 */
export function wrapMethod(target, wrapper) {
  if (globalThis.libWrapper) {
    libWrapper.register(MODULE, target, wrapper, 'MIXED');
    return;
  }
  const path = target.split('.');
  const name = path.pop();
  const owner = foundry.utils.getProperty(globalThis, path.join('.'));
  const original = owner[name];
  owner[name] = function(...args) {
    return wrapper.call(this, original.bind(this), ...args);
  };
}
