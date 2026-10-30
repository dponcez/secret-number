import { getHTMLRefs } from 'variables/globals.js';
import { states } from 'variables/constants.js';

export function showToastNotification(msg, question, attempts, color, timeout, callback){
  const { inputField, alertContainer } = getHTMLRefs();

  clearTimeout(states.messageTimer);

  alertContainer.innerHTML = `
    <p class="message" style="color: ${color}">${msg}</p>
    <p class="question" style="color: ${color}">${question}</p>
    <p class="attempts" style="color: ${color}">${attempts}</p>
  `;

  inputField.disabled = true;

  states.messageTimer.setTimeout(() => {
    alertContainer.innerHTML = '';
    inputField.disabled = false;

    callback ? callback() : inputField.focus();
  }, timeout);
}