import { useEffect, useRef, useState } from 'react';
import styles from './Gridlines.module.css';

// Capas del fondo. base: cómo se dibujan las columnas ('lines' | 'dots' | 'cross' | 'none').
// field: matriz de puntos · coords: numeración tipo editor · scan: scanlines · cursor: bloque bajo el mouse.
const GRID = { base: 'none', field: false, coords: false, scan: false, cursor: true };

const ROW = 24;
const LABEL_EVERY = 4;
const pad = n => String(n).padStart(3, '0');

// Numeración del margen: avanza con el scroll como el gutter de un editor.
function Gutter() {
  const ref = useRef(null);
  const [count] = useState(() => Math.ceil(window.innerHeight / (ROW * LABEL_EVERY)) + 2);

  useEffect(() => {
    let frame;
    function update() {
      frame = null;
      const step = ROW * LABEL_EVERY;
      const y = window.scrollY;
      const first = Math.floor(y / step);
      ref.current.style.transform = `translate3d(0, ${-(y % step)}px, 0)`;
      [...ref.current.children].forEach((el, k) => {
        el.textContent = pad((first + k) * LABEL_EVERY);
      });
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={styles.gutter}>
      <div ref={ref}>
        {Array.from({ length: count }, (_, k) => <span key={k} />)}
      </div>
    </div>
  );
}

// Cursor de bloque: una celda de terminal que salta de a una bajo el mouse.
function BlockCursor() {
  const ref = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const cw = ROW / 2;
    function onMove(e) {
      const x = Math.floor(e.clientX / cw) * cw;
      const y = Math.floor(e.clientY / ROW) * ROW;
      ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ref.current.style.opacity = 1;
    }
    function onLeave() {
      ref.current.style.opacity = 0;
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <div ref={ref} className={styles.block} />;
}

export default function Gridlines() {
  const grid = GRID;

  return (
    <>
      <div className={styles.gridlines} data-base={grid.base} aria-hidden="true">
        {grid.field && <div className={styles.field} />}
        <div className="wrap">
          <div className={styles.cols}>
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i} style={{ '--i': i }}>
                {grid.coords && i < 6 && <em data-d={pad(i).slice(1)} data-m={pad(i / 3).slice(1)} />}
              </span>
            ))}
          </div>
        </div>
        {grid.coords && <Gutter />}
        {grid.cursor && <BlockCursor />}
      </div>
      {grid.scan && <div className={styles.scan} aria-hidden="true" />}
    </>
  );
}
