import { useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { MOTHER } from '../../data/pieces';
import { setLanded } from '../../lib/landing';
import styles from './Intro.module.css';

const LETTERS = [...'L20N'];
const BASE_WGHT = [1000, 1000, 1000, 500 + MOTHER[3] * 500];
const BASE_WDTH = [4, 5, 6, 7].map(i => 40 + MOTHER[i] * 111);
const THIN = 140;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = v => v * v * (3 - 2 * v);
// Escalones chicos: a este tamaño no se notan y ahorran re-layouts del texto.
const step = (v, n) => Math.round(v / n) * n;

// Mientras scrolleás, la letra fina da una vuelta entera: 0 → N → L → 2 → 0.
// Termina donde empezó, en la firma madre.
function lettersAt(p) {
  const pos = (2 + clamp(p / 0.72) * 4) % 4;
  return LETTERS.map((_, i) => {
    const d = Math.min(Math.abs(pos - i), 4 - Math.abs(pos - i));
    const thin = smooth(clamp(1 - d));
    const wght = BASE_WGHT[i] - (BASE_WGHT[i] - THIN) * thin;
    const wdth = BASE_WDTH[i] + (i === 2 ? 0 : 24 * thin);
    return `"wght" ${step(wght, 10)}, "wdth" ${step(wdth, 2)}, "opsz" 144`;
  });
}

export default function Intro() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const sigRef = useRef(null);
  const restRef = useRef(null);
  const hintRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const lastRef = useRef([]);
  const flightRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  // Cuánto tiene que viajar y achicarse la firma para caer justo sobre el logo del navbar.
  // Se mide con la firma en reposo (la forma madre), que es la misma del logo.
  function measureFlight() {
    const sig = sigRef.current;
    const logo = document.querySelector('[data-logo]');
    if (!sig || !logo?.firstElementChild) return null;
    const prev = sig.style.transform;
    sig.style.transform = 'none';
    const a = sig.getBoundingClientRect();
    const stage = sig.parentElement.getBoundingClientRect();
    sig.style.transform = prev;
    const b = logo.firstElementChild.getBoundingClientRect();
    const s = parseFloat(getComputedStyle(logo).fontSize) / parseFloat(getComputedStyle(sig).fontSize);
    return {
      s,
      dx: b.left + (a.width * s) / 2 - (a.left - stage.left + a.width / 2),
      dy: b.top + b.height / 2 - (a.top - stage.top + a.height / 2),
    };
  }

  function apply(p) {
    const settings = lettersAt(reduceMotion ? 0 : p);
    // Cambiar el eje de la fuente re-maqueta la letra: solo tocamos las que cambiaron.
    [...(sigRef.current?.children ?? [])].forEach((el, i) => {
      if (lastRef.current[i] === settings[i]) return;
      lastRef.current[i] = settings[i];
      el.style.fontVariationSettings = settings[i];
    });
    if (reduceMotion) {
      setLanded(p >= 0.95);
      return;
    }
    // Al final la firma viaja hasta el navbar y se convierte en el logo.
    const out = smooth(clamp((p - 0.72) / 0.28));
    if (out > 0 && !flightRef.current) flightRef.current = measureFlight();
    const f = flightRef.current ?? { s: 0.4, dx: 0, dy: 0 };
    sigRef.current.style.transform = `translate3d(${f.dx * out}px, ${f.dy * out}px, 0) scale(${f.s ** out})`;
    sigRef.current.style.visibility = out >= 1 ? 'hidden' : '';
    setLanded(out >= 1);
    const away = smooth(clamp(p / 0.2));
    restRef.current.style.opacity = 1 - away;
    restRef.current.style.transform = `translate3d(0, ${away * -4}rem, 0)`;
    hintRef.current.style.opacity = 1 - away;
  }

  useLayoutEffect(() => apply(scrollYProgress.get()));
  useMotionValueEvent(scrollYProgress, 'change', apply);

  useEffect(() => {
    // Si cambia el tamaño o carga la fuente, el viaje se vuelve a medir.
    const reset = () => {
      flightRef.current = null;
      apply(scrollYProgress.get());
    };
    window.addEventListener('resize', reset);
    document.fonts?.ready.then(reset);
    return () => window.removeEventListener('resize', reset);
  });

  useEffect(() => () => setLanded(false), []);

  return (
    <section id="top" ref={sectionRef} className={`${styles.intro} ${reduceMotion ? styles.static : ''}`}>
      <div className={styles.stage}>
        <h1 ref={sigRef} className={styles.signature} aria-label="L20N">
          {LETTERS.map((letter, i) => (
            <span key={i} aria-hidden="true">{letter}</span>
          ))}
        </h1>

        <div ref={restRef} className={styles.rest}>
          <p className={styles.name}>Lautaro Rodriguez Marcon</p>
          <p className={styles.title}>{t('hero.title')}</p>
          <p className={styles.tagline}>{t('hero.tagline')}</p>
        </div>

        <span ref={hintRef} className={styles.hint} aria-hidden="true">{t('intro.scroll')}</span>
      </div>
    </section>
  );
}
