import { MODULE } from "./const.js";
import { isDisabled } from "./core.js";

Hooks.on('renderCombatTracker', (combatTracker, root) => {
  if (!game.user.isGM) return;

  const combat = combatTracker.viewed;
  // Remove a toggle left over from a previous render, so its state and combat reference never go stale
  root.querySelector('.niks-shared-npc-initiative-toggle')?.remove();
  if (!combat) return;

  const htmlHeader = root.querySelector('.combat-tracker-header');
  if (!htmlHeader) return;

  const toggleContainer = document.createElement('div');
  toggleContainer.classList.add('niks-shared-npc-initiative-toggle');

  const toggleLabel = document.createElement('label');
  toggleLabel.dataset.tooltip = game.i18n.localize('NIKS_SHARED_NPC_INITIATIVE.ToggleTooltip');

  const toggleInput = document.createElement('input');
  toggleInput.setAttribute('type', 'checkbox');
  toggleInput.checked = !isDisabled(combat);

  toggleInput.addEventListener('change', async () => {
    toggleInput.disabled = true;
    try {
      await combat.setFlag(MODULE, 'disabled', !toggleInput.checked);
    } finally {
      toggleInput.disabled = false;
    }
  });

  toggleLabel.append(game.i18n.localize('NIKS_SHARED_NPC_INITIATIVE.ToggleLabel'), toggleInput);
  toggleContainer.append(toggleLabel);
  htmlHeader.append(toggleContainer);
});
