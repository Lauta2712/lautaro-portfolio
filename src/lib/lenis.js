import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Scroll suave para toda la página. Si el sistema pide menos movimiento,
// queda el scroll nativo.
let lenis = null;

export function startLenis() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return lenis;
  lenis = new Lenis({ autoRaf: true, anchors: { offset: -64 }, lerp: 0.1 });
  return lenis;
}

export function stopLenis() {
  lenis?.destroy();
  lenis = null;
}

export function pauseScroll() {
  lenis?.stop();
}

export function resumeScroll() {
  lenis?.start();
}
