import { loadSVGElement } from "utils/svg-element.js";
import { getHTMLRefs } from "variables/globals.js";

export const template = () => {
  const { container } = getHTMLRefs();

  const screen_logo = "src/assets/icons/screen-logo.svg";
  const main_logo = "src/assets/icons/main-logo.svg";

  const size = 75;

  const screen_icon_size = {
    url: screen_logo,
    width: size,
    height: size,
  };

  const main_icon_size = {
    url: main_logo,
    width: size,
    height: size,
  };

  container.innerHTML = `
    <div class="splash--screen" data-splash>
      <div class="logo">
        ${loadSVGElement(screen_icon_size)}
      </div>
      <div class="splash--info">
        <h1 class="title">¡Bienvenido!</h1>
        <p class="info">un número secreto ha sido escondido. ¿Tienes la agudeza mental para descubrirlo?</p>
      </div>
      <button class="btn start--btn" data-start-game>start</button>
    </div>
    <main class="main">
      <div class="main--logo">
        ${loadSVGElement(main_icon_size)}
      </div>
      <strong class="difficulty--info">seleccionar dificultad inicial</strong>
      <div class="hud">
        <div class="difficulty--section">
          <button class="btn difficulty--btn active" data-dif="easy">
            <span>fácil (1 - 50)</span>
          </button>
          <button class="btn difficulty--btn" data-dif="medium">
            <span>medio (1 - 150)</span>
          </button>
          <button class="btn difficulty--btn" data-dif="hard">
            <span>difícil (1 - 500)</span>
          </button>
          <button class="btn difficulty--btn" data-dif="super_hard">
            <span>súper difícil (1 - 1000)</span>
          </button>
        </div>
      </div>
      <div class="form--container">
        <form action="#" class="form" data-form>
          <input type="number" name="secret number" class="input--field" id="secret-number"
            placeholder="Escribe tu número..." data-input>
          <button type="submit" class="btn submit--btn">submit</button>
        </form>
        <div class="level--container" data-level>
        </div>
      </div>
      <div class="game--info__container" data-game-info>
      </div>
      <div class="alert" data-alert>
      </div>
      <div class="footer" data-footer>
      </div>
    </main>
  `;
};
