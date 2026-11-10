import { handler } from '_fns/custom_functions.js';
import { loadSVGElement } from 'utils/svg-element.js';

const toggleClass = (element, classElement, isActive) =>
  element.classList.toggle(classElement, isActive);

export function handleLightMode(
  elements, 
  switches, 
  logos, 
  switchSize, 
  light, 
  active
){
  const turn_on = {
    url: switches.toggle_on,
    width: switchSize.size / switchSize.decimal,
    height: switchSize.size / switchSize.decimal,
  };

  const turn_off = {
    url: switches.toggle_off,
    width: switchSize.size / switchSize.decimal,
    height: switchSize.size / switchSize.decimal,
  };

  const light_mode = {
    url: logos.light_mode_logo,
    width: switchSize.size,
    height: switchSize.size
  }

  const dark_mode = {
    url: logos.dark_mode_logo,
    width: switchSize.size,
    height: switchSize.size
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
      elements.submitButton
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