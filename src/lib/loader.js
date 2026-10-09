// Saca el loader de index.html cuando la fuente y la página están listas.
// Un mínimo para que la animación se lea, un máximo para no hacer esperar,
// y cualquier tecla, clic o scroll lo salta. Se muestra una vez por sesión.
const MIN_MS = 1800;
const MAX_MS = 3500;
const SETTLE_MS = 550;
const EXIT_MS = 900;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const pageLoaded = () =>
  document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise(resolve => window.addEventListener('load', resolve, { once: true }));

export function hideLoader() {
  const loader = document.getElementById('l20n-loader');
  const html = document.documentElement;
  if (!loader || html.classList.contains('ll-seen')) {
    loader?.remove();
    return;
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fontReady = document.fonts?.load('900 1em "Roboto Flex"', 'L20N') ?? Promise.resolve();
  const minLeft = Math.max(0, (reduced ? 500 : MIN_MS) - performance.now());
  let leaving = false;

  async function leave() {
    if (leaving) return;
    leaving = true;
    removeSkips();
    try {
      sessionStorage.setItem('l20n:loader', '1');
    } catch {
      // Sin storage se vuelve a ver en la próxima visita; no pasa nada.
    }
    loader.classList.add('is-settled');
    await wait(reduced ? 0 : SETTLE_MS);
    loader.classList.add('is-hidden');
    html.classList.remove('is-loading');
    await wait(reduced ? 50 : EXIT_MS);
    loader.remove();
  }

  const skip = () => leave();
  const skipEvents = ['wheel', 'touchmove', 'pointerdown', 'keydown'];
  skipEvents.forEach(type => window.addEventListener(type, skip, { passive: true }));
  function removeSkips() {
    skipEvents.forEach(type => window.removeEventListener(type, skip));
  }

  Promise.race([Promise.all([pageLoaded(), fontReady.catch(() => {}), wait(minLeft)]), wait(MAX_MS)]).then(leave);
}
