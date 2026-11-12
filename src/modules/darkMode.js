import { selector, selectorAll } from "_fns/custom_functions.js";
import { handleLightMode } from 'hooks/theme.js';

export function loadDarkMode(){
  const toggle_on = "/src/assets/icons/toggle-on.svg";
  const toggle_off = "/src/assets/icons/toggle-off.svg";
  const light_mode_logo = "/src/assets/icons/light-mode-logo.svg";
  const dark_mode_logo = "/src/assets/icons/main-logo.svg";

  const elements = {
    main: selector(".main"),
    mainLogo: selector(".main--logo"),
    toggle: selector("[data-dark-mode]"),
    inputField: selector("[data-input]"),
    hud: selector(".hud"),
    diffInfo: selector(".difficulty--info"),
    gameInfoContainer: selector(".game--info__container"),
    footerContainer: selector(".footer"),
    diffButtons: selectorAll("[data-dif]"),
    submitButton: selector("[data-submit]"),
    resetGameButton: selector("[data-reset-game]"),
  };

  const switchOptions = {
    size: 75,
    decimal: 1.75,
    toggle_on,
    toggle_off,
    light_mode_logo,
    dark_mode_logo
  }

  handleLightMode(
    elements,
    switchOptions,
    "light",
    "active--color",
  );
}