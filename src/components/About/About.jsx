import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import styles from './About.module.css';

const LATELY = [
  'about.skills.collab',
  'about.skills.ownership',
  'about.skills.learning',
  'about.skills.async',
  'about.skills.attention',
];

// El texto se va prendiendo palabra por palabra a medida que bajás.
export default function About() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const textRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: textRef, offset: ['start 85%', 'end 45%'] });

  const words = ['about.bio1', 'about.bio2', 'about.bio3']
    .map(key => t(key).split(' '))
    .flatMap((list, block) => list.map((word, i) => ({ word, br: block > 0 && i === 0 })));

  function apply(p) {
    const spans = textRef.current?.querySelectorAll('[data-word]') ?? [];
    const lit = reduceMotion ? spans.length : p * spans.length;
    spans.forEach((el, i) => {
      el.style.opacity = String(0.14 + 0.86 * Math.min(1, Math.max(0, lit - i)));
    });
  }

  useLayoutEffect(() => apply(scrollYProgress.get()));
  useMotionValueEvent(scrollYProgress, 'change', apply);

  return (
    <section id="info" className={styles.about}>
      <div className={`wrap ${styles.grid}`}>
        <p className={styles.label}>{t('about.label')}</p>

        <p ref={textRef} className={styles.text}>
          {words.map(({ word, br }, i) => (
            <span key={i}>
              {br && <span className={styles.pilcrow} aria-hidden="true"> / </span>}
              <span data-word>{word}</span>{' '}
            </span>
          ))}
        </p>

        <div className={styles.lately}>
          <p className={styles.label}>{t('about.softSkillsTitle')}</p>
          <ul>
            {LATELY.map(key => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
