import { getHTMLRefs } from 'variables/globals.js';
import { states } from 'variables/constants.js';
import { showToastNotification } from 'ui/showToastNotification.js';

jest.mock('variables/globals.js', () => ({
  getHTMLRefs: jest.fn(),
}));

describe('showToastNotification', () => {
  let inputField;
  let alertContainer;

  beforeEach(() => {
    jest.useFakeTimers();
    inputField = document.createElement('input');
    alertContainer = document.createElement('div');
    getHTMLRefs.mockReturnValue({ inputField, alertContainer });
    states.messageTimer = null;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('sets the semantic tone on the alert and clears it after the timeout', () => {
    showToastNotification('hint', '', 'attempts left', 'high', 1800);

    expect(alertContainer.dataset.tone).toBe('high');
    expect(alertContainer.querySelector('.message').getAttribute('style')).toBeNull();
    expect(alertContainer.querySelector('.question').getAttribute('style')).toBeNull();
    expect(alertContainer.querySelector('.attempts').getAttribute('style')).toBeNull();
    expect(inputField.disabled).toBe(true);

    jest.advanceTimersByTime(1800);

    expect(alertContainer.innerHTML).toBe('');
    expect(alertContainer.hasAttribute('data-tone')).toBe(false);
    expect(inputField.disabled).toBe(false);
  });
});
