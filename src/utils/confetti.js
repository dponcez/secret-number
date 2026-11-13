export const lanchConfetti =  (timeout) => {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.5 },
    colors: ["#e71616", "#13d813", "#13dfff", "#ffb700", "#549dff"],
  });

  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 55,
      angle: 60,
      origin: { x: 0 }
    });

    confetti({
      particleCount: 100,
      spread: 55,
      angle: 160,
      origin: { x: 1 }
    });
  }, timeout)
}