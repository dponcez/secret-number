import { selector, selectorAll } from "_fns/custom_functions.js";

export const getHTMLRefs = () => ({
  container: selector(".container"),
  startGameBtn: selector("[data-start-game]"),
  form: selector("[data-form]"),
  inputField: selector("[data-input]"),
  splashScreen: selector("[data-splash]"),
  gameContainer: selector("[data-game-info]"),
  alertContainer: selector("[data-alert]"),
  footerContainer: selector("[data-footer]"),
  levelContainer: selector("[data-level]"),
  difficultyButtons: selectorAll("[data-dif]"),
});
