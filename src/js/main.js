import { template } from 'modules/template.js';
import { debounce } from 'utils/debounce.js';
import { getHTMLRefs } from 'variables/globals.js';
import { states } from 'variables/constants.js';
import { startRound } from 'modules/startRound.js';
import { selector, selectorAll, handler } from '_fns/custom_functions.js';
import { handleGameConfiguration, handleSubmit } from 'handlers/gameControllers.js';
import { handleLightMode } from 'hooks/theme.js';


document.addEventListener('DOMContentLoaded', () => {
  template();

  // const size = 75;

  const toggle_on = "src/assets/icons/toggle-on.svg";
  const toggle_off = "src/assets/icons/toggle-off.svg";
  const light_mode_logo = "/src/assets/icons/light-mode-logo.svg";
  const dark_mode_logo = "/src/assets/icons/main-logo.svg";

  const elements = {
    main: selector('.main'),
    mainLogo: selector('.main--logo'),
    toggle: selector('[data-dark-mode]'),
    inputField: selector('[data-input]'),
    hud: selector('.hud'),
    diffInfo: selector('.difficulty--info'),
    gameInfoContainer: selector('.game--info__container'),
    footerContainer: selector('.footer'),
    diffButtons: selectorAll('[data-dif]'),
    submitButton: selector('[data-submit]')
  }

  const switchSize = {
    size: 75,
    decimal: 1.75
  }
  
  const switches = {
    toggle_on,
    toggle_off
  }

  const logos = {
    light_mode_logo,
    dark_mode_logo
  }

  handleLightMode(elements, switches, logos, switchSize, 'light', 'active--color')

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