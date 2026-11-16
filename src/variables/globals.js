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
  resultDialog: selector("[data-result-dialog]"),
  resultTitle: selector("[data-result-title]"),
  resultMessage: selector("[data-result-message]"),
  resultAttempts: selector("[data-result-attempts]"),
  resultTime: selector("[data-result-time]"),
  resultPoints: selector("[data-result-points]"),
  resultTotal: selector("[data-result-total]"),
  resultNextButton: selector("[data-result-next]"),
  resultRetryButton: selector("[data-result-retry]"),
  resultDifficultyButton: selector("[data-result-difficulty]"),
});
