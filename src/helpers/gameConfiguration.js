export const gameConfiguration = {
  easy: { 
    min: 1, max: 50, attempts: 15,
    maxLevel: 5, rangePerLevel: 0, attemptsPerLevel: 0
  },
  medium: { 
    min: 1, max: 150, attempts: 10,
    maxLevel: 10, rangePerLevel: 30, attemptsPerLevel: 1
  },
  hard: { 
    min: 1, max: 500, attempts: 7,
    maxLevel: 15, rangePerLevel: 30, attemptsPerLevel: 1
  },
  super_hard: { 
    min: 1, max: 1000, attempts: 5,
    maxLevel: 20, rangePerLevel: 30, attemptsPerLevel: 1
  }
}