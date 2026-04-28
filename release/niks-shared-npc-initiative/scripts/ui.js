import { MODULE } from "./const.js";

Hooks.on('renderCombatTracker', (combatTracker, /**@type {HTMLElement}*/htmlElement, context, options) => {
  if (!game.user.isGM) return;

  const combat = game.combat;
  if (!combat) {
    return;
  }

  // Prevent duplicate toggles
  if (htmlElement.querySelector('.niks-shared-npc-initiative-toggle')) {
    return;
  }

  const isDisabled = combat.getFlag(MODULE, 'disabled') ?? false;

  const toggleContainer = document.createElement('div');
  toggleContainer.classList.add('niks-shared-npc-initiative-toggle');

  const toggleLabel = document.createElement('label');
  toggleLabel.title = game.i18n.localize('NIKS_SHARED_NPC_INITIATIVE.ToggleTooltip');

  const toggleInput = document.createElement('input');
  toggleInput.setAttribute('type', 'checkbox');
  toggleInput.checked = !isDisabled;

  toggleInput.addEventListener('change', async () => {
    toggleInput.disabled = true;
    try {
      await combat.setFlag(MODULE, 'disabled', !toggleInput.checked);
    } finally {
      toggleInput.disabled = false;
    }
  });

  let labelText;
  if (game.i18n.has('NIKS_SHARED_NPC_INITIATIVE.ToggleLabel')) {
    labelText = game.i18n.localize('NIKS_SHARED_NPC_INITIATIVE.ToggleLabel');
  } else if (game.i18n.has('TYPES.Actor.group') && game.i18n.has('DND5E.NPC.Label')) {
    labelText = `${game.i18n.format('TYPES.Actor.group')} ${game.i18n.format('DND5E.NPC.Label')}`;
  } else {
    labelText = 'Group NPC Initiative';
  }

  toggleLabel.append(labelText, toggleInput);
  toggleContainer.append(toggleLabel);

  // Try multiple selectors to support both V13 (.combat-tracker-header) and V14 DOM structures
  const htmlHeader = htmlElement.querySelector('.combat-tracker-header')
    ?? htmlElement.querySelector('#combat-tracker header')
    ?? htmlElement.querySelector('header');
  if (htmlHeader) {
    htmlHeader.append(toggleContainer);
  }
});