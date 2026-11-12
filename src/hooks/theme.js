import { handler } from '_fns/custom_functions.js';
import { loadSVGElement } from 'utils/svg-element.js';

const toggleClass = (element, classElement, isActive) =>
  element.classList.toggle(classElement, isActive);

export function handleLightMode(
  elements, 
  switchOptions, 
  light, 
  active
){
  const turn_on = {
    url: switchOptions.toggle_on,
    width: switchOptions.size / switchOptions.decimal,
    height: switchOptions.size / switchOptions.decimal,
  };

  const turn_off = {
    url: switchOptions.toggle_off,
    width: switchOptions.size / switchOptions.decimal,
    height: switchOptions.size / switchOptions.decimal,
  };

  const light_mode = {
    url: switchOptions.light_mode_logo,
    width: switchOptions.size,
    height: switchOptions.size
  }

  const dark_mode = {
    url: switchOptions.dark_mode_logo,
    width: switchOptions.size,
    height: switchOptions.size
  }

  const updateTheme = (isLight) => {
    if(elements.main) toggleClass(elements.main, light, isLight);

    localStorage.setItem("theme", isLight);

    if(elements.toggle){
      elements.toggle.innerHTML = loadSVGElement(isLight ? turn_off : turn_on);
    }

    if(elements.toggle){
      elements.mainLogo.innerHTML = loadSVGElement(isLight ? light_mode : dark_mode);
    }

    [elements.inputField, elements.hud].forEach((element) => {
      if(element) toggleClass(element, active, isLight);
    });

    [
      elements.diffInfo,
      elements.gameInfoContainer,
      elements.footerContainer,
      elements.submitButton,
      elements.resetGameButton
    ].forEach((element) => {
      if(element) toggleClass(element, active, isLight);
    });

    [elements.diffButtons].forEach(button => {
      button.forEach(item => {
        if(item) toggleClass(item, active, isLight)
      })
    });
  };

  if(elements.toggle && elements.main) {
    handler(elements.toggle, "click", () => {
      updateTheme(!elements.main.classList.contains(light));
    });
  }

  const storage = localStorage.getItem("theme");
  updateTheme(storage === "true");
}