# Guía de mejoras propuestas

Esta guía describe cómo añadir resultados con modal, estadísticas de ronda,
puntaje y límites de progresión. Los ejemplos son una propuesta de
implementación; no se aplican automáticamente al código del proyecto.

### Comportamiento actual y decisión recomendada

`startRound()` ya reinicia `states.attempts` y establece
`states.remainingAttempts` al máximo de la nueva ronda. Por tanto, los intentos
sobrantes **no se transfieren**. Lo que aumenta actualmente es el máximo: en
fácil comienza en 15 y `applyGameConfiguration()` añade uno por nivel, sin un
límite. Para evitar una progresión indefinida, el ejemplo de abajo fija un tope
por dificultad y mantiene fácil con 15 intentos en todos sus niveles.

También conviene corregir el fin de partida: el controlador actual termina si
queda 1 intento (`remainingAttempts <= 1`), por lo que cierra la ronda antes de
permitir usar el último intento. La condición correcta es que queden cero
intentos.

### 1. Definir los límites de dificultad y progresión

En `src/helpers/gameConfiguration.js`, agrega el máximo de nivel y cuánto
aumenta el rango y los intentos por nivel. Estos valores son ejemplos y se
pueden ajustar:

```js
export const gameConfiguration = {
  easy: {
    min: 1, max: 50, attempts: 15,
    maxLevel: 5, rangePerLevel: 0, attemptsPerLevel: 0,
  },
  medium: {
    min: 1, max: 150, attempts: 10,
    maxLevel: 10, rangePerLevel: 30, attemptsPerLevel: 1,
  },
  hard: {
    min: 1, max: 500, attempts: 7,
    maxLevel: 10, rangePerLevel: 30, attemptsPerLevel: 1,
  },
  super_hard: {
    min: 1, max: 1000, attempts: 5,
    maxLevel: 10, rangePerLevel: 30, attemptsPerLevel: 1,
  },
};
```

En `src/helpers/applyGameConfiguration.js`, calcula la progresión sin superar el nivel configurado:

```js
export function applyGameConfiguration() {
  const config = gameConfiguration[states.mainDifficult];
  const levelOffset = Math.min(
    Math.max(0, states.actualLevel - 1),
    config.maxLevel - 1,
  );

  states.min = config.min;
  states.max = config.max + levelOffset * config.rangePerLevel;
  states.maximumAttempts =
    config.attempts + levelOffset * config.attemptsPerLevel;
}
```

Con esta configuración, fácil mantiene el rango 1–50 y 15 intentos, y termina al completar el nivel 5. Las otras dificultades también tienen un nivel máximo
de ejemplo; cambia `maxLevel` si quieres permitir más niveles.

### 2. Añadir estado de ronda, tiempo y puntaje

En `src/variables/constants.js`, unifica el contador con el nombre que usa el
controlador (`attempts`; actualmente el objeto declara `attemtps`) y añade los
valores para una ronda activa y el puntaje de la sesión:

```js
attempts: 0,
roundActive: false,
roundStartedAt: 0,
roundTimerId: null,
totalScore: 0,
lastRoundResult: null,
```

Al empezar cada ronda, `src/modules/startRound.js` debe detener cualquier
temporizador anterior, reiniciar los intentos y empezar a medir el tiempo:

```js
clearInterval(states.roundTimerId);
states.attempts = 0;
states.remainingAttempts = states.maximumAttempts;
states.roundStartedAt = Date.now();
states.roundActive = true;
```

Importa `selector` en ese módulo y, después de insertar el panel en el DOM,
actualiza el cronómetro mientras la ronda está activa:

```js
const formatTime = seconds =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

states.roundTimerId = setInterval(() => {
  const timer = selector('[data-timer]');
  if (!timer) return;

  const seconds = Math.floor((Date.now() - states.roundStartedAt) / 1000);
  timer.textContent = formatTime(seconds);
}, 1000);
```

Añade un panel para las estadísticas en el HTML generado por
`src/modules/startRound.js`, interpolando el máximo de intentos:

```html
<p>Tiempo: <span data-timer>00:00</span></p>
<p>Intentos: <span data-attempt-count>0</span> / ${states.maximumAttempts}</p>
<progress data-progress max="${states.maximumAttempts}" value="0"></progress>
<p>Puntaje de la sesión: <span data-total-score>0</span></p>
```

Actualiza el temporizador cada segundo con el tiempo transcurrido desde
`roundStartedAt`; actualiza el
contador y la barra tras cada intento válido. La barra representa intentos
usados (0 al máximo), mientras que el texto de intentos restantes puede
continuar mostrando `states.remainingAttempts`.

### 3. Mostrar los resultados en un modal accesible

En `src/modules/template.js`, agrega un elemento `<dialog>` con el título,
resumen y acciones. Por ejemplo:

```html
<dialog data-result-dialog aria-labelledby="result-title">
  <h2 id="result-title" data-result-title></h2>
  <p data-result-message></p>
  <p>Intentos: <span data-result-attempts></span></p>
  <p>Tiempo: <span data-result-time></span></p>
  <p>Puntos de esta ronda: <span data-result-points></span></p>
  <p>Puntaje de la sesión: <span data-result-total></span></p>
  <button type="button" data-result-next>Siguiente nivel</button>
  <button type="button" data-result-retry>Reintentar nivel</button>
  <button type="button" data-result-difficulty>Elegir dificultad</button>
</dialog>
```

Registra estas referencias en `src/variables/globals.js`. Cuando termine una
ronda, rellena el modal usando `textContent` y ábrelo con
`resultDialog.showModal()`. Usa un resultado de victoria distinto al de
derrota: la victoria muestra los intentos, el tiempo y los puntos; la derrota
también revela el número secreto. No programes el comienzo automático de la
siguiente ronda.

Desactiva el envío mientras el modal está abierto. Al elegir una acción:

- **Siguiente nivel:** incrementa `states.actualLevel` y llama a `startRound()`.
- **Reintentar nivel:** conserva el nivel actual y llama a `startRound()`.
- **Elegir dificultad:** cierra el modal y enfoca los botones de dificultad; el
  manejador existente reinicia el nivel al seleccionar otra dificultad.

En el nivel máximo, cambia el texto de la acción principal a **“Reiniciar
dificultad”** y vuelve al nivel 1 en vez de superar el tope. Para que el usuario
no quede bloqueado, impide cerrar el modal con Escape o implementa un cierre
que reactive una acción clara.

Para enlazar el HTML con el JavaScript, agrega las referencias del diálogo y
sus controles a `src/variables/globals.js`:

```js
resultDialog: selector('[data-result-dialog]'),
resultTitle: selector('[data-result-title]'),
resultMessage: selector('[data-result-message]'),
resultAttempts: selector('[data-result-attempts]'),
resultTime: selector('[data-result-time]'),
resultPoints: selector('[data-result-points]'),
resultTotal: selector('[data-result-total]'),
resultNextButton: selector('[data-result-next]'),
resultRetryButton: selector('[data-result-retry]'),
resultDifficultyButton: selector('[data-result-difficulty]'),
```

### 4. Centralizar la finalización y calcular el puntaje

Separa el cierre de ronda de la lógica que procesa el número ingresado. Por
ejemplo, crea `src/modules/finishRound.js`. El multiplicador y la fórmula son una propuesta inicial que puedes ajustar:

```js
import { getHTMLRefs } from 'variables/globals.js';
import { states } from 'variables/constants.js';
import { gameConfiguration } from 'helpers/gameConfiguration.js';
import { savedLevelReached } from 'hooks/storage.js';

const multipliers = {
  easy: 1,
  medium: 1.5,
  hard: 2,
  super_hard: 3,
};

export function finishRound(won) {
  if (!states.roundActive) return;

  const completedLevel = states.actualLevel;
  const seconds = Math.floor((Date.now() - states.roundStartedAt) / 1000);
  const points = won
    ? Math.round(
        (100 +
          states.remainingAttempts * 20 +
          Math.max(0, 60 - seconds)) *
          multipliers[states.mainDifficult],
      )
    : 0;
  const config = gameConfiguration[states.mainDifficult];

  clearInterval(states.roundTimerId);
  states.roundTimerId = null;
  states.roundActive = false;
  states.totalScore += points;

  if (won) savedLevelReached(completedLevel);

  states.lastRoundResult = {
    won,
    completedLevel,
    seconds,
    points,
    totalScore: states.totalScore,
    campaignComplete: won && completedLevel >= config.maxLevel,
  };

  const {
    inputField,
    resultDialog,
    resultTitle,
    resultMessage,
    resultAttempts,
    resultTime,
    resultPoints,
    resultTotal,
    resultNextButton,
    resultRetryButton,
  } = getHTMLRefs();

  inputField.disabled = true;
  resultTitle.textContent = states.lastRoundResult.campaignComplete
    ? '¡Dificultad completada!'
    : won ? '¡Victoria!' : 'Fin de la partida';
  resultMessage.textContent = won
    ? `Completaste el nivel ${completedLevel}.`
    : `El número secreto era ${states.secretNumber}.`;
  resultAttempts.textContent =
    `${states.attempts} / ${states.maximumAttempts}`;
  resultTime.textContent = `${seconds} s`;
  resultPoints.textContent = String(points);
  resultTotal.textContent = String(states.totalScore);
  resultNextButton.hidden = !won;
  resultNextButton.textContent =
    states.lastRoundResult.campaignComplete
      ? 'Reiniciar dificultad'
      : 'Siguiente nivel';
  resultRetryButton.hidden = won;

  resultDialog.showModal();
}
```

El estado `states.lastRoundResult` permite conservar los datos mostrados y
determinar si se completó el último nivel. Actualiza el récord con el nivel que
se acaba de completar (`savedLevelReached(completedLevel)`), no con el nivel
siguiente.

En `src/handlers/gameControllers.js`, el orden recomendado en el envío es:

```js
import { finishRound } from 'modules/finishRound.js';

if (!states.gameStarted || !states.roundActive || inputField.disabled) return;

// Después de validar el número:
states.attempts += 1;
states.remainingAttempts = states.maximumAttempts - states.attempts;

selector('[data-attempt-count]').textContent = String(states.attempts);
selector('[data-progress]').value = states.attempts;

if (userNumber === states.secretNumber) {
  finishRound(true);
  return;
}

if (states.remainingAttempts === 0) {
  finishRound(false);
  return;
}
```

Actualiza el progreso y presenta la pista solo si la ronda sigue activa. Esta
condición permite gastar todos los intentos y ganar incluso en el último.
No llames `startRound()` automáticamente al terminar; las acciones del diálogo
se encargan de continuar.

En `src/handlers/events.js`, conecta las acciones del modal una sola vez
durante la configuración de eventos:

```js
const {
  resultDialog,
  resultNextButton,
  resultRetryButton,
  resultDifficultyButton,
  difficultyButtons,
} = getHTMLRefs();

resultDialog.addEventListener('cancel', event => event.preventDefault());

resultNextButton.addEventListener('click', () => {
  const { maxLevel } = gameConfiguration[states.mainDifficult];
  states.actualLevel =
    states.actualLevel >= maxLevel ? 1 : states.actualLevel + 1;
  resultDialog.close();
  startRound();
});

resultRetryButton.addEventListener('click', () => {
  resultDialog.close();
  startRound();
});

resultDifficultyButton.addEventListener('click', () => {
  resultDialog.close();
  difficultyButtons[0].focus();
});
```

Importa `gameConfiguration` si aún no está importado en ese módulo. Asegúrate
de añadir `data-result-difficulty` al HTML y mostrar este botón en ambos
resultados. Cambiar dificultad usa el manejador existente, que vuelve al nivel
1 e inicia una ronda nueva.

Al reiniciar la partida desde `src/handlers/events.js`, vuelve a poner
`states.totalScore` a cero. Si se cambia de dificultad, decide si también se
reinicia el puntaje; una opción sencilla es tratar cada dificultad como una
nueva sesión. Reintentar una ronda no debe sumar intentos anteriores: conserva
el reinicio de `attempts` y `remainingAttempts` que ya realiza `startRound()`.

### 5. Estilos y pruebas

Agrega estilos para el modal y su fondo en `src/assets/css/styles.css`. El
elemento nativo `<dialog>` ofrece `showModal()` y una capa de fondo; comprueba
que los colores y el foco sean visibles en ambos temas.

Como punto de partida:

```css
[data-result-dialog] {
  position: fixed;
  inset: 0;
  width: min(90vw, 32rem);
  margin: auto;
  padding: 2rem;
  border: 1px solid var(--clr-stroke);
  border-radius: 1rem;
  color: var(--clr-white);
  background: var(--clr-hud);
}

[data-result-dialog]::backdrop {
  background: rgb(0 0 0 / 70%);
}
```

En `src/__tests__/gameControllers.test.js`, ajusta o añade pruebas para
verificar que:

- Una respuesta incorrecta con 1 intento restante **no** termina la ronda.
- Una respuesta incorrecta con 0 intentos restantes muestra derrota.
- Un acierto en el último intento muestra victoria.
- Las rondas nuevas reinician los intentos, pero mantienen el puntaje de la
  sesión.
- Fácil conserva el máximo de intentos y no supera `maxLevel`.
- Victoria y derrota muestran los datos correctos y no inician otra ronda
  automáticamente.

Ejecuta la suite con el gestor ya definido por el proyecto:

```bash
pnpm test
```