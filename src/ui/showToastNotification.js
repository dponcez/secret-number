import { getHTMLRefs } from 'variables/globals.js';
import { states } from 'variables/constants.js';

export function showToastNotification(msg, question, attempts, tone, timeout, callback){
  const { inputField, alertContainer } = getHTMLRefs();

  clearTimeout(states.messageTimer);

  alertContainer.dataset.tone = tone;
  alertContainer.innerHTML = `
    <p class="message">${msg}</p>
    <p class="question">${question}</p>
    <p class="attempts">${attempts}</p>
  `;

  inputField.disabled = true;

  states.messageTimer = setTimeout(() => {
    alertContainer.innerHTML = '';
    alertContainer.removeAttribute('data-tone');
    inputField.disabled = false;

    callback ? callback() : inputField.focus();
  }, timeout);
}