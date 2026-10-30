import { gameConfiguration } from './gameConfiguration.js';
import { states } from 'variables/constants.js';

export function applyGameConfiguration(){
  const base = gameConfiguration[states.mainDifficult];

  states.min = base.min;
  states.max = base.max + (states.actualLevel - 1) * 30;
  states.maximumAttempts = base.attempts + (states.actualLevel - 1)
}