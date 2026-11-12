import { template } from "modules/template.js";
import { loadDarkMode } from "modules/darkMode.js";
import { setupEvents } from "handlers/events.js";

export function domLoader(){
  template();
  loadDarkMode();
  setupEvents();
}