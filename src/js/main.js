import { template } from 'modules/template.js';
import { debounce } from 'utils/debounce.js';
import { getHTMLRefs } from 'variables/globals.js';
import { states } from 'variables/constants.js';
import { startRound } from 'modules/startRound.js';
import { handler } from '_fns/custom_functions.js';
import { handleGameConfiguration, handleSubmit } from 'handlers/gameControllers.js';


document.addEventListener('DOMContentLoaded', () => {
  template();

  const {
    difficultyButtons,
    splashScreen,
    form,
    startGameBtn
  } = getHTMLRefs();

  function startGame(){
    states.gameStarted = true;
    startRound();
  }

  difficultyButtons.forEach(button => {
    handler(button, 'click', debounce(() => handleGameConfiguration(button), 300));
  });

  handler(startGameBtn, 'click', () => {
    if(splashScreen){
      splashScreen.remove();
    }

    startGame()
  });

  handler(form, 'submit', handleSubmit);
})