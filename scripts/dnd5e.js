import { MODULE } from "./const.js";
import { getInitiativeMap } from "./core.js";

/**
 * Skip the roll prompt for dnd5e by setting a fixed initiative value
 * when the actor's group already has one.
 */
Hooks.on("dnd5e.preConfigureInitiative", (actor, rollData) => {
  if (actor.type !== "npc") {
    return;
  }

  // Resolve the relevant combat for this actor, supporting multi-combat scenes
  const combat = (actor.isToken && actor.token?.combatant?.combat)
    ?? game.combats?.find(c => c.combatants.some(cbt => (actor.isToken ? cbt.tokenId === actor.token?.id : cbt.actorId === actor.id)))
    ?? game.combat;

  if (!combat || (combat.getFlag(MODULE, "disabled") ?? false)) {
    return;
  }

  const map = getInitiativeMap(combat);

  // For unlinked tokens, actor.isToken is true and actor.token.actorId gives
  // the base sidebar actor ID. For linked tokens or sidebar actors, actor.id
  // is already the correct identifier.
  const actorId = actor.isToken ? actor.token?.actorId : actor.id;
  if (!actorId) return;

  if (map.has(actorId)) {
    rollData.options ??= {};
    rollData.options.fixed = map.get(actorId);
  }
});

/**
 * Ensure DnD5e 6.x native initiative grouping respects this module's per-combat toggle.
 * If grouping is disabled for a combat, Combatant5e#getInitiativeGroupingKey returns null.
 */
Hooks.once("init", () => {
  const CombatantClass = CONFIG.Combatant.documentClass;
  if (CombatantClass?.prototype?.getInitiativeGroupingKey) {
    const originalGetInitiativeGroupingKey = CombatantClass.prototype.getInitiativeGroupingKey;
    CombatantClass.prototype.getInitiativeGroupingKey = function(...args) {
      if (this.combat?.getFlag(MODULE, "disabled")) {
        return null;
      }
      return originalGetInitiativeGroupingKey.call(this, ...args);
    };
  }
});