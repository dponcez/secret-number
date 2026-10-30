import { getHTMLRefs } from 'variables/globals.js';
import { states } from 'variables/constants.js';

export function clearNotification(){
  const { inputField, alertContainer } = getHTMLRefs();

  clearTimeout(states.messageTimer);

  states.messageTimer = null;
  inputField.disabled = false;
  alertContainer.innerHTML = '';
}