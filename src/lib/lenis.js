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

const NAV_OFFSET = -64;

// Lleva la página hasta un elemento o un #id. immediate salta sin animar,
// incluso con el scroll pausado (por ejemplo, detrás de un modal).
export function scrollToTarget(target, { immediate = false, offset = NAV_OFFSET } = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset, immediate, force: true });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' });
}
