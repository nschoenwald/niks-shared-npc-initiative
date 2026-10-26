import { wrapMethod } from "./const.js";
import { getGroupInitiative, getGroupKey, isDisabled } from "./core.js";

/**
 * Skip the roll prompt for dnd5e by setting a fixed initiative value
 * when the actor's group already has one.
 */
Hooks.on("dnd5e.preConfigureInitiative", (actor, rollData) => {
  if (actor.type !== "npc") {
    return;
  }

  // Resolve the relevant combat for this actor, preferring the active one and supporting multi-combat scenes.
  // getCombatantsByActor resolves unlinked token actors to their token's combatants.
  let combat = game.combat;
  if (!combat?.getCombatantsByActor(actor).length) {
    combat = game.combats.find(c => c.getCombatantsByActor(actor).length);
  }
  if (!combat || isDisabled(combat)) {
    return;
  }

  // Only share when something still needs a value; re-rolling an existing initiative stays a real roll
  const combatant = combat.getCombatantsByActor(actor).find(c => c.initiative === null);
  if (!combatant) return;

  const initiative = getGroupInitiative(combat, getGroupKey(combatant), combatant.id);
  if (initiative !== null) {
    rollData.options ??= {};
    rollData.options.fixed = initiative;
  }
});

/**
 * Ensure DnD5e 6.x native initiative grouping respects this module's per-combat toggle.
 * If grouping is disabled for a combat, Combatant5e#getInitiativeGroupingKey returns null.
 * Called from the module's init hook.
 */
export function wrapGroupingKey() {
  if (!CONFIG.Combatant.documentClass.prototype.getInitiativeGroupingKey) return;
  wrapMethod('CONFIG.Combatant.documentClass.prototype.getInitiativeGroupingKey', function(wrapped, ...args) {
    if (this.combat && isDisabled(this.combat)) return null;
    return wrapped(...args);
  });
}
