import { handler, selector } from "_fns/custom_functions.js";
import {
  handleGameConfiguration,
  handleSubmit,
} from "./gameControllers.js";
import { startRound } from "modules/startRound.js";
import { getHTMLRefs } from "variables/globals.js";
import { states } from "variables/constants.js";
import { debounce } from "utils/debounce.js";

export function setupEvents(){
  const { 
    difficultyButtons, 
    splashScreen, 
    form, 
    startGameBtn 
  } = getHTMLRefs();
  
  function startGame() {
    states.gameStarted = true;
    startRound();
  }
  
  difficultyButtons.forEach((button) => {
    handler(
      button,
      "click",
      debounce(() => handleGameConfiguration(button), 300),
    );
  });
  
  handler(startGameBtn, "click", () => {
    if (splashScreen) {
      splashScreen.remove();
    }
  
    startGame();
  });
  
  handler(form, "submit", handleSubmit);
}
