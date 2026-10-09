import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { PIECES, TYPES } from '../../data/pieces';
import { setCurrentPiece } from '../../lib/currentPiece';
import Signature from '../Signature/Signature';
import ProjectModal from '../Projects/ProjectModal';
import styles from './Archive.module.css';

const pad = n => String(n).padStart(2, '0');

function Media({ piece, reduceMotion }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const clip = useTransform(scrollYProgress, [0, 0.4], ['inset(22% 14% 22% 14%)', 'inset(0% 0% 0% 0%)']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.14, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);

  const still = reduceMotion ? undefined : { clipPath: clip };
  const inner = reduceMotion ? undefined : { scale, y };

  return (
    <motion.div ref={ref} className={styles.media} style={still}>
      {piece.image ? (
        <motion.img src={piece.image} alt={piece.alt ?? ''} loading="lazy" style={inner} />
      ) : (
        <motion.div className={styles.mediaSignature} style={inner}>
          <Signature seed={piece.name} />
        </motion.div>
      )}
    </motion.div>
  );
}

function Piece({ piece, index, onOpen, reduceMotion }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });

  useEffect(() => {
    if (inView) setCurrentPiece(piece);
  }, [inView, piece]);

  const opens = piece.type === 'project';
  const href = piece.type === 'project' ? undefined : piece.url;
  const Tag = opens ? 'button' : href ? 'a' : 'div';
  const tagProps = opens
    ? { type: 'button', onClick: e => onOpen(piece, e), 'aria-label': `${t('projects.viewDetails')} ${piece.name}` }
    : href
      ? { href, target: '_blank', rel: 'noreferrer' }
      : {};

  return (
    <motion.article
      ref={ref}
      className={`${styles.piece} ${index % 2 ? styles.flip : ''}`}
      layout={!reduceMotion}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.meta}>
        <span className={styles.number}>{pad(index + 1)}</span>
        <div className={styles.metaBody}>
          <p className={styles.kind}>
            {t(`archive.types.${piece.type}`)}
            {piece.status && <span> · {t(piece.status)}</span>}
          </p>
          <h3 className={styles.name}>{piece.name ?? piece.caption}</h3>
          {piece.descKey && <p className={styles.desc}>{t(piece.descKey)}</p>}
          {piece.text && <p className={styles.desc}>{piece.text}</p>}
          <p className={styles.sig}>
            {t('hero.signatureOf')} <Signature seed={piece.name ?? piece.id} small className={styles.sigMark} />
          </p>
        </div>
      </div>

      <Tag className={styles.frame} data-cursor={opens ? t('archive.open') : href ? t('archive.go') : undefined} {...tagProps}>
        <Media piece={piece} reduceMotion={reduceMotion} />
      </Tag>
    </motion.article>
  );
}

export default function Archive() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const triggerRef = useRef(null);

  const counts = useMemo(() => {
    const c = {};
    PIECES.forEach(p => { c[p.type] = (c[p.type] ?? 0) + 1; });
    return c;
  }, []);
  const types = TYPES.filter(type => counts[type]);
  const visible = filter === 'all' ? PIECES : PIECES.filter(p => p.type === filter);

  function open(piece, e) {
    triggerRef.current = e?.currentTarget ?? null;
    setSelected(piece);
  }

  function close() {
    setSelected(null);
    triggerRef.current?.focus?.();
  }

  return (
    <section id="archivo" className={styles.archive}>
      <header className={`wrap ${styles.head}`}>
        <h2 className={styles.title}>{t('archive.title')}</h2>
        <div className={styles.filters} role="group" aria-label={t('archive.filter')}>
          {[['all', PIECES.length], ...types.map(type => [type, counts[type]])].map(([key, n]) => (
            <button
              key={key}
              type="button"
              className={`${styles.filter} ${filter === key ? styles.filterOn : ''}`}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {t(key === 'all' ? 'archive.all' : `archive.plural.${key}`)}
              <sup>{pad(n)}</sup>
            </button>
          ))}
        </div>
      </header>

      <div className={`wrap ${styles.list}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((piece, i) => (
            <Piece key={piece.id} piece={piece} index={i} onOpen={open} reduceMotion={reduceMotion} />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
