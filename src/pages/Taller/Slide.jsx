import { useLayoutEffect, useRef } from 'react';
import Signature from '../../components/Signature/Signature';
import { MOTHER } from '../../data/pieces';
import styles from './Slide.module.css';

// Ancho útil del slide (1080 menos los márgenes).
const INNER_WIDTH = 936;

// Achica el texto hasta que entre en una línea. Se mide sobre el DOM real,
// así respeta los ejes variables de la fuente.
function useFitText(text, max) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = `${max}px`;
      const ratio = INNER_WIDTH / el.scrollWidth;
      if (ratio < 1) el.style.fontSize = `${Math.floor(max * ratio)}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
  }, [text, max]);
  return ref;
}

function Frame({ number, index, total, children }) {
  return (
    <>
      <div className={styles.bar}>
        <span>#{number}</span>
        <span>{String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      </div>
      {children}
    </>
  );
}

function NameSlide({ name, reason }) {
  const ref = useFitText(name, 340);
  return (
    <div className={styles.nameBody}>
      <span ref={ref} className={styles.name}>{name}</span>
      {reason && <p className={styles.reason}>{reason}</p>}
    </div>
  );
}

export default function Slide({ slide, number, index, total, ref }) {
  return (
    <div ref={ref} className={styles.slide}>
      <Frame number={number} index={index} total={total}>
        {slide.kind === 'cover' && <p className={styles.cover}>{slide.text}</p>}
        {slide.kind === 'name' && <NameSlide name={slide.name} reason={slide.reason} />}
        {slide.kind === 'end' && (
          <div className={styles.end}>
            <Signature data={MOTHER} />
          </div>
        )}
      </Frame>
      {slide.kind !== 'end' && (
        <div className={styles.foot}>
          <Signature seed={number} small />
        </div>
      )}
    </div>
  );
}
