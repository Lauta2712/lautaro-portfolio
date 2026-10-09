import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { MOTHER } from '../../data/pieces';
import styles from './Intro.module.css';

const LETTERS = [...'L20N'];
const BASE_WGHT = [1000, 1000, 1000, 500 + MOTHER[3] * 500];
const BASE_WDTH = [4, 5, 6, 7].map(i => 40 + MOTHER[i] * 111);
const THIN = 140;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = v => v * v * (3 - 2 * v);

// Mientras scrolleás, la letra fina da una vuelta entera: 0 → N → L → 2 → 0.
// Termina donde empezó, en la firma madre.
function lettersAt(p) {
  const pos = (2 + clamp(p / 0.72) * 4) % 4;
  return LETTERS.map((_, i) => {
    const d = Math.min(Math.abs(pos - i), 4 - Math.abs(pos - i));
    const thin = smooth(clamp(1 - d));
    const wght = BASE_WGHT[i] - (BASE_WGHT[i] - THIN) * thin;
    const wdth = BASE_WDTH[i] + (i === 2 ? 0 : 24 * thin);
    return `"wght" ${Math.round(wght)}, "wdth" ${Math.round(wdth)}, "opsz" 144`;
  });
}

export default function Intro() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const sigRef = useRef(null);
  const restRef = useRef(null);
  const hintRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  function apply(p) {
    const settings = lettersAt(reduceMotion ? 0 : p);
    [...(sigRef.current?.children ?? [])].forEach((el, i) => {
      el.style.fontVariationSettings = settings[i];
    });
    if (reduceMotion) return;
    const out = smooth(clamp((p - 0.7) / 0.3));
    sigRef.current.style.transform = `translateY(${-out * 30}vh) scale(${1 - out * 0.6})`;
    sigRef.current.style.opacity = 1 - out;
    const away = smooth(clamp(p / 0.2));
    restRef.current.style.opacity = 1 - away;
    restRef.current.style.transform = `translateY(${away * -4}rem)`;
    hintRef.current.style.opacity = 1 - away;
  }

  useLayoutEffect(() => apply(scrollYProgress.get()));
  useMotionValueEvent(scrollYProgress, 'change', apply);

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
