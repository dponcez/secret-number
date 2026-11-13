import { handler } from '_fns/custom_functions.js';
import { loadSVGElement } from 'utils/svg-element.js';

const toggleClass = (element, classElement, isActive) =>
  element.classList.toggle(classElement, isActive);

export function handleLightMode(
  elements, 
  options, 
  light, 
  active
){
  const turn_on = {
    url: options.toggle_on,
    width: options.size / options.decimal,
    height: options.size / options.decimal,
  };

  const turn_off = {
    url: options.toggle_off,
    width: options.size / options.decimal,
    height: options.size / options.decimal,
  };

  const light_mode = {
    url: options.light_mode_logo,
    width: options.size,
    height: options.size
  }

  const dark_mode = {
    url: options.dark_mode_logo,
    width: options.size,
    height: options.size
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