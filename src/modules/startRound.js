import { getHTMLRefs } from 'variables/globals.js';
import { states } from 'variables/constants.js';
import { applyGameConfiguration } from 'helpers/applyGameConfiguration.js';
import { clearNotification } from 'ui/clearNotification.js';
import { showLevelRecord } from 'hooks/storage.js';

export function startRound(){
  clearNotification();
  applyGameConfiguration();

  const { 
    inputField, 
    levelContainer, 
    gameContainer, 
    footerContainer 
  } = getHTMLRefs();

  states.attempts = 0;
  states.remainingAttempts = states.maximumAttempts;
  states.secretNumber = Math.floor(
    Math.random() * (states.max - states.min + 1)
  ) + states.min;

  levelContainer.innerHTML = `
    <p class="level">nivel 
      <span data-badge-level>${states.actualLevel}</span>
    </p>
  `;

  gameContainer.innerHTML = `
    <p class="game--info">system ready! I have encrypted a number between ${states.min} and ${states.max}.</p>
    <strong class="maximum--attempts">
      remaining energy: <span data-attempts>${states.remainingAttempts}</span> attempts
    </strong>
  `;

  footerContainer.innerHTML = `
    <p class="footer--info">
      maximum level reached: <span data-record></span>
    </p>
  `;

  inputField.disabled = false;
  inputField.value = '';
  inputField.focus();

  showLevelRecord();
}