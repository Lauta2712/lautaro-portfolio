import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from 'framer-motion';
import Signature from '../Signature/Signature';
import { MOTHER } from '../../data/pieces';
import styles from './Contact.module.css';

const EMAIL = 'l20n.archive@gmail.com';

// Las letras se ensanchan y engordan cerca del puntero.
function WideWord({ text }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  function onMove(e) {
    if (reduceMotion) return;
    [...ref.current.children].forEach(el => {
      const r = el.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const k = Math.max(0, 1 - d * 4);
      el.style.fontVariationSettings = `"wght" ${Math.round(300 + 700 * k)}, "wdth" ${Math.round(40 + 111 * k)}, "opsz" 144`;
    });
  }

  function onLeave() {
    [...ref.current.children].forEach(el => {
      el.style.fontVariationSettings = '';
    });
  }

  return (
    <span ref={ref} className={styles.word} onPointerMove={onMove} onPointerLeave={onLeave} aria-label={text}>
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden="true">{ch}</span>
      ))}
    </span>
  );
}

export default function Contact() {
  const { t } = useTranslation();

  return (
    <section id="contacto" className={styles.contact}>
      <div className="wrap">
        <h2 className={styles.title}>
          <a href={`mailto:${EMAIL}`} data-cursor={t('archive.write')}>
            <WideWord text={t('hero.contactMe')} />
          </a>
        </h2>

        <div className={styles.row}>
          <p className={styles.tagline}>{t('contact.tagline')}</p>
          <a href={`mailto:${EMAIL}`} className={styles.email}>{EMAIL}</a>
          <ul className={styles.links}>
            <li><a href="https://github.com/Lauta2712" target="_blank" rel="noreferrer">GitHub ↗</a></li>
            <li><a href="https://linkedin.com/in/lautaro-rodriguez-marcon" target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
            <li><a href="/cv">{t('nav.cv')}</a></li>
          </ul>
        </div>
      </div>

      <footer className={`wrap ${styles.footer}`}>
        <Signature data={MOTHER} small className={styles.footerSig} />
        <p>{t('contact.location')}</p>
        <p>{t('contact.footer')}</p>
      </footer>
    </section>
  );
}
