import { useEffect, useRef, useState } from 'react';
import styles from './Cursor.module.css';

// Un punto que sigue al mouse y dice qué pasa si hacés clic (data-cursor).
export default function Cursor() {
  const ref = useRef(null);
  const [label, setLabel] = useState('');
  const [enabled] = useState(
    () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (!enabled) return undefined;
    const pos = { x: -100, y: -100 };
    const shown = { x: -100, y: -100 };
    let frame;
    let last = null;

    function read() {
      const target = last?.closest?.('[data-cursor]');
      setLabel(target ? target.dataset.cursor : '');
    }

    function onMove(e) {
      pos.x = e.clientX;
      pos.y = e.clientY;
      last = e.target;
      read();
    }

    // Después de un clic la etiqueta puede cambiar (por ejemplo, "copiado").
    function onClick() {
      setTimeout(read, 50);
    }

    function tick() {
      shown.x += (pos.x - shown.x) * 0.2;
      shown.y += (pos.y - shown.y) * 0.2;
      ref.current.style.transform = `translate3d(${shown.x}px, ${shown.y}px, 0)`;
      frame = requestAnimationFrame(tick);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('click', onClick);
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ref} className={styles.cursor} aria-hidden="true">
      <span className={`${styles.dot} ${label ? styles.big : ''}`}>{label}</span>
    </div>
  );
}
