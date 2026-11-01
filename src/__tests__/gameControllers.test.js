import { handleGameConfiguration, handleSubmit } from 'handlers/gameControllers.js';
import { states } from 'variables/constants.js';
import { gameConfiguration } from 'helpers/gameConfiguration.js';
import { getHTMLRefs } from 'variables/globals.js';
import { log, selector } from '_fns/custom_functions.js';
import { startRound } from 'modules/startRound.js';
import { showToastNotification } from 'ui/showToastNotification.js';
import { savedLevelReached } from 'hooks/storage.js';

jest.mock('_fns/custom_functions.js', () => ({
  log: jest.fn(),
  selector: jest.fn(),
}));

jest.mock('variables/globals.js', () => ({
  getHTMLRefs: jest.fn(),
}));

jest.mock('modules/startRound.js', () => ({
  startRound: jest.fn(),
}));

jest.mock('ui/showToastNotification.js', () => ({
  showToastNotification: jest.fn(),
}));

jest.mock('hooks/storage.js', () => ({
  savedLevelReached: jest.fn(),
}));

const createRefs = () => {
  const inputField = { disabled: false, value: '' };
  const attemptsElement = { textContent: '' };

  return {
    inputField,
    attemptsElement,
    difficultyButtons: [
      { dataset: { dif: 'easy' }, classList: { toggle: jest.fn() } },
      { dataset: { dif: 'hard' }, classList: { toggle: jest.fn() } },
    ],
  };
};

describe('game controllers', () => {
  let refs;

  beforeEach(() => {
    refs = createRefs();
    getHTMLRefs.mockReturnValue(refs);
    selector.mockReturnValue(refs.attemptsElement);

    Object.assign(states, {
      mainDifficulty: 'easy',
      maximumAttempts: gameConfiguration.easy.attempts,
      min: 1,
      max: 50,
      remainingAttempts: 15,
      secretNumber: 25,
      attempts: 0,
      actualLevel: 1,
      maxLevelReached: 1,
      gameStarted: false,
    });
    jest.clearAllMocks();
  });

  describe('handleGameConfiguration', () => {
    it('updates the selected difficulty and active button', () => {
      handleGameConfiguration(refs.difficultyButtons[1]);

      expect(states.mainDifficulty).toBe('hard');
      expect(states.attempts).toBe(1);
      expect(refs.difficultyButtons[0].classList.toggle).toHaveBeenCalledWith(
        'active',
        false,
      );
      expect(refs.difficultyButtons[1].classList.toggle).toHaveBeenCalledWith(
        'active',
        true,
      );
      expect(startRound).not.toHaveBeenCalled();
    });

    it('starts a new round when changing difficulty during a game', () => {
      states.gameStarted = true;

      handleGameConfiguration(refs.difficultyButtons[1]);

      expect(startRound).toHaveBeenCalledTimes(1);
    });

    it('logs and ignores an unknown difficulty', () => {
      handleGameConfiguration({ dataset: { dif: 'impossible' } });

      expect(log).toHaveBeenCalledWith('invalid difficulty type: impossible');
      expect(states.mainDifficulty).toBe('easy');
      expect(startRound).not.toHaveBeenCalled();
    });
  });

  describe('handleSubmit', () => {
    const submit = value => {
      refs.inputField.value = value;
      handleSubmit({ preventDefault: jest.fn() });
    };

    beforeEach(() => {
      states.gameStarted = true;
    });

    it('ignores submissions when the game is stopped or input is disabled', () => {
      states.gameStarted = false;
      submit('25');
      expect(showToastNotification).not.toHaveBeenCalled();

      states.gameStarted = true;
      refs.inputField.disabled = true;
      submit('25');
      expect(showToastNotification).not.toHaveBeenCalled();
    });

    it('rejects empty and out-of-range values', () => {
      submit('not a number');

      expect(refs.inputField.value).toBe('');
      expect(showToastNotification).toHaveBeenCalledWith(
        '¡invalid number! Introduce a number between 1 and 50',
        '',
        '',
        'var(--clr-gray)',
        1800,
      );
      expect(states.attempts).toBe(0);
    });

    it('shows a higher-number hint and updates remaining attempts', () => {
      submit('40');

      expect(states.attempts).toBe(1);
      expect(states.remainingAttempts).toBe(14);
      expect(refs.attemptsElement.textContent).toBe(14);
      expect(showToastNotification).toHaveBeenCalledWith(
        '¡you went too far! The secret number is lower',
        '',
        'remaining attempts: 14',
        'var(--clr-cyan)',
        1800,
      );
    });

    it('records a successful guess and schedules the next round', () => {
      states.maxLevelReached = 1;
      submit('25');

      expect(states.actualLevel).toBe(2);
      expect(states.maxLevelReached).toBe(2);
      expect(savedLevelReached).toHaveBeenCalledWith(2);
      expect(showToastNotification).toHaveBeenCalledWith(
        '¡impresive!',
        '',
        "you've discovered the secret number in 1 attempts",
        '#66bb6a',
        2500,
        startRound,
      );
    });

    it('ends the game when the last attempt is used', () => {
      states.attempts = states.maximumAttempts - 1;
      submit('40');

      expect(states.attempts).toBe(states.maximumAttempts);
      expect(states.actualLevel).toBe(1);
      expect(refs.inputField.value).toBe('');
      expect(showToastNotification).toHaveBeenCalledWith(
        '¡game over!',
        'the mistery remains hidden... want to try again?',
        'the secret number was 25',
        3500,
        startRound,
      );
    });
  });
});