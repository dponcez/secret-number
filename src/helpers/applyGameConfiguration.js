import { gameConfiguration } from './gameConfiguration.js';
import { states } from 'variables/constants.js';

export function applyGameConfiguration(){
  const config = gameConfiguration[states.mainDifficult];
  const levelOffset = Math.min(
    Math.max(0, states.actualLevel - 1),
    config.maxLevel - 1
  )

  states.min = config.min;
  states.max = config.max + levelOffset * config.rangePerLevel;
  states.maximumAttempts = config.attempts + levelOffset * config.attemptsPerLevel;
}