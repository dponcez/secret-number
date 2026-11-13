import { handleLightMode } from 'hooks/theme.js';

describe('handleLightMode', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <main class="main light">
        <div class="main--logo"></div>
        <button data-dark-mode></button>
        <button data-dif="easy"></button>
        <input class="active--color" data-input>
        <div class="hud active--color"></div>
        <strong class="difficulty--info active--color"></strong>
        <div class="game--info__container active--color"></div>
        <footer class="footer active--color"></footer>
      </main>
    `;
  });

  it('sets initial theme state and styles game content created later', () => {
    localStorage.setItem('theme', 'false');

    const elements = {
      main: document.querySelector('.main'),
      mainLogo: document.querySelector('.main--logo'),
      toggle: document.querySelector('[data-dark-mode]'),
      inputField: document.querySelector('[data-input]'),
      hud: document.querySelector('.hud'),
      diffInfo: document.querySelector('.difficulty--info'),
      gameInfoContainer: document.querySelector('.game--info__container'),
      footerContainer: document.querySelector('.footer'),
      diffButtons: document.querySelectorAll('[data-dif]'),
    };

    handleLightMode(
      elements,
      {
        toggle_on: 'on.svg',
        toggle_off: 'off.svg',
        light_mode_logo: 'light.svg',
        dark_mode_logo: 'dark.svg',
        size: 75,
        decimal: 1.75,
      },
      'light',
      'active--color',
    );

    expect(elements.main.classList.contains('light')).toBe(false);
    expect(elements.gameInfoContainer.classList.contains('active--color')).toBe(false);
    expect(elements.footerContainer.classList.contains('active--color')).toBe(false);

    elements.gameInfoContainer.innerHTML = `
      <p class="game--info"></p>
      <strong class="maximum--attempts"><span>3</span></strong>
    `;
    elements.footerContainer.innerHTML = '<p class="footer--info"></p>';

    elements.toggle.click();

    expect(elements.main.classList.contains('light')).toBe(true);
    expect(elements.gameInfoContainer.classList.contains('active--color')).toBe(true);
    expect(elements.footerContainer.classList.contains('active--color')).toBe(true);

    elements.toggle.click();

    expect(elements.main.classList.contains('light')).toBe(false);
    expect(elements.gameInfoContainer.classList.contains('active--color')).toBe(false);
    expect(elements.footerContainer.classList.contains('active--color')).toBe(false);
  });
});
