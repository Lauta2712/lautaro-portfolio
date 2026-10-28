import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { setCurrentPiece } from '../../lib/currentPiece';
import Signature from '../Signature/Signature';
import styles from './ArchiveIndex.module.css';

const pad = n => String(n).padStart(2, '0');

// La imagen de la fila que tenés abajo del mouse, siguiéndolo con un poco de retraso.
function Preview({ piece }) {
  const ref = useRef(null);

  useEffect(() => {
    const pos = { x: -999, y: -999 };
    const shown = { x: -999, y: -999 };
    let frame;
    function onMove(e) {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (shown.x === -999) Object.assign(shown, pos);
    }
    function tick() {
      shown.x += (pos.x - shown.x) * 0.14;
      shown.y += (pos.y - shown.y) * 0.14;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${shown.x}px, ${shown.y}px, 0)`;
        // Al lado del cursor para no tapar el nombre; cerca del borde derecho, del otro lado.
        ref.current.dataset.side = shown.x > window.innerWidth * 0.6 ? 'left' : 'right';
      }
      frame = requestAnimationFrame(tick);
    }
    window.addEventListener('pointermove', onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={styles.preview} aria-hidden="true">
      <div className={`${styles.previewFrame} ${piece ? styles.previewOn : ''}`}>
        {piece?.image
          ? <img key={piece.id} src={piece.image} alt="" />
          : piece && <div key={piece.id} className={styles.previewSig}><Signature seed={piece.name ?? piece.id} /></div>}
      </div>
    </div>
  );
}

export default function ArchiveIndex({ pieces, onOpen }) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(null);
  const [canHover] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches);

  function focus(piece, i) {
    setHovered(piece);
    setCurrentPiece(piece, i, pieces.length);
  }

  return (
    <div className={`wrap ${styles.index}`} onPointerLeave={() => setHovered(null)}>
      <div className={styles.headRow} aria-hidden="true">
        <span>Nº</span>
        <span>{t('archive.cols.name')}</span>
        <span>{t('archive.cols.kind')}</span>
        <span>{t('archive.cols.stack')}</span>
      </div>

      <ul>
        {pieces.map((piece, i) => {
          const opens = piece.type === 'project';
          const href = opens ? undefined : piece.url;
          const Tag = opens ? 'button' : href ? 'a' : 'div';
          const tagProps = opens
            ? { type: 'button', onClick: e => onOpen(piece, e) }
            : href ? { href, target: '_blank', rel: 'noreferrer' } : {};

          return (
            <motion.li
              key={piece.id}
              data-piece={piece.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <Tag
                className={`${styles.row} ${hovered && hovered !== piece ? styles.dim : ''}`}
                data-row
                data-cursor={opens ? t('archive.open') : href ? t('archive.go') : undefined}
                onPointerEnter={() => focus(piece, i)}
                onFocus={() => focus(piece, i)}
                {...tagProps}
              >
                <span className={styles.number}>{pad(i + 1)}</span>
                <span className={styles.name}>
                  {piece.image && <img className={styles.thumb} src={piece.image} alt="" loading="lazy" />}
                  {piece.name ?? piece.caption}
                </span>
                <span className={styles.kind}>
                  {t(`archive.types.${piece.type}`)}
                  {piece.status && <> · {t(piece.status)}</>}
                </span>
                <span className={styles.stack}>{piece.stack?.slice(0, 4).join(' · ')}</span>
                <span className={styles.arrow} aria-hidden="true">{opens ? '→' : href ? '↗' : ''}</span>
              </Tag>
            </motion.li>
          );
        })}
      </ul>

      {canHover && !reduceMotion && <Preview piece={hovered} />}
    </div>
  );
}
