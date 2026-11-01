import { log, selector } from '_fns/custom_functions.js';
import { getHTMLRefs } from 'variables/globals.js';
import { states } from 'variables/constants.js';
import { startRound } from 'modules/startRound.js';
import { gameConfiguration } from 'helpers/gameConfiguration.js';
import { showToastNotification } from 'ui/showToastNotification.js';
import { savedLevelReached } from 'hooks/storage.js';

export function handleGameConfiguration(button){
  const { difficultyButtons } = getHTMLRefs();
  const type = button.dataset.dif;

  if(!gameConfiguration[type]){
    log(`invalid difficulty type: ${type}`);
    return
  }

  states.mainDifficult = type;
  states.actualLevel = 1;

  difficultyButtons.forEach(item => {
    item.classList.toggle('active', item === button)
  });

  if(states.gameStarted){
    startRound();
  }
}

export function handleSubmit(event){
  event.preventDefault();

  const { inputField } = getHTMLRefs();

  if(!states.gameStarted || inputField.disabled) return;

  const rawInput = inputField.value.trim();
  const userNumber = Number(rawInput);

  if(
    rawInput === '' ||
    !Number.isInteger(userNumber) ||
    userNumber < states.min ||
    userNumber > states.max
  ){
    inputField.value = '';
    showToastNotification(
      `¡invalid number! Introduce a number between ${states.min} and ${states.max}`,
      "",
      "",
      "var(--clr-gray)",
      1800,
    );

    return
  }

  states.attempts += 1;
  states.remainingAttempts = states.maximumAttempts - states.attempts;

  if(userNumber === states.secretNumber){
    states.actualLevel += 1;
    states.maxLevelReached = Math.max(states.maxLevelReached, states.actualLevel);

    savedLevelReached(states.maxLevelReached);

    showToastNotification(
      "¡impresive!",
      "",
      `you've discovered the secret number in ${states.attempts} attempts`,
      "#66bb6a",
      2500,
      startRound
    );

    return
  }

  if(states.remainingAttempts <= 1){
    states.actualLevel = 1;
    inputField.value = '';

    showToastNotification(
      "¡game over!",
      "the mistery remains hidden... want to try again?",
      `the secret number was ${states.secretNumber}`,
      3500,
      startRound
    );

    return
  }

  const hint = userNumber > states.secretNumber ?
    '¡you went too far! The secret number is lower' :
    'close... the secret number is higher';

  const attemptsElement = selector('[data-attempts]');
  if(attemptsElement){
    attemptsElement.textContent = states.remainingAttempts;
  }

  inputField.value = '';

  showToastNotification(
    hint,
    "",
    `remaining attempts: ${states.remainingAttempts}`,
    userNumber > states.secretNumber ? 'var(--clr-cyan)' : 'var(--clr-yellow)',
    1800
  )
}