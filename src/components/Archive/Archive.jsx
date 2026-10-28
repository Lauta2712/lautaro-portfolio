import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { PIECES, TYPES } from '../../data/pieces';
import { setCurrentPiece } from '../../lib/currentPiece';
import { scrollToTarget } from '../../lib/lenis';
import { OPEN_PIECE_EVENT } from '../../lib/palette';
import Signature from '../Signature/Signature';
import ProjectModal from '../Projects/ProjectModal';
import ArchiveIndex from './ArchiveIndex';
import styles from './Archive.module.css';

const pad = n => String(n).padStart(2, '0');
const VIEW_KEY = 'l20n:archive-view';

function readView() {
  try {
    return localStorage.getItem(VIEW_KEY) === 'index' ? 'index' : 'gallery';
  } catch {
    return 'gallery';
  }
}

const pieceEl = id => document.querySelector(`[data-piece="${id}"]`);
const isTyping = e => e.target.closest?.('input, textarea, [contenteditable="true"]');

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

function Piece({ piece, index, total, onOpen, reduceMotion }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });

  useEffect(() => {
    if (inView) setCurrentPiece(piece, index, total);
  }, [inView, piece, index, total]);

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
      data-piece={piece.id}
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

      <Tag className={styles.frame} data-morph data-cursor={opens ? t('archive.open') : href ? t('archive.go') : undefined} {...tagProps}>
        <Media piece={piece} reduceMotion={reduceMotion} />
      </Tag>
    </motion.article>
  );
}

export default function Archive() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState(readView);
  const [selected, setSelected] = useState(null);
  const triggerRef = useRef(null);

  const counts = useMemo(() => {
    const c = {};
    PIECES.forEach(p => { c[p.type] = (c[p.type] ?? 0) + 1; });
    return c;
  }, []);
  const types = TYPES.filter(type => counts[type]);
  const visible = useMemo(() => (filter === 'all' ? PIECES : PIECES.filter(p => p.type === filter)), [filter]);
  const projects = visible.filter(p => p.type === 'project');

  function changeView(next) {
    setView(next);
    try { localStorage.setItem(VIEW_KEY, next); } catch { /* sin storage, sigue igual */ }
  }

  function open(piece, e) {
    triggerRef.current = e?.currentTarget ?? null;
    setSelected(piece);
  }

  const close = useCallback(() => {
    setSelected(null);
    triggerRef.current?.focus?.({ preventScroll: true });
  }, []);

  // Abrir una pieza desde afuera (paleta o link /#p-id): primero la página va hasta ella.
  const openById = useCallback(id => {
    const piece = PIECES.find(p => p.id === id && p.type === 'project');
    if (!piece) return;
    // Un frame para quitar el filtro y otro para que la pieza ya esté en la página.
    requestAnimationFrame(() => {
      setFilter('all');
      requestAnimationFrame(() => {
        const el = pieceEl(id);
        if (el) scrollToTarget(el, { immediate: true });
        triggerRef.current = el?.querySelector('[data-morph], [data-row]') ?? null;
        setSelected(piece);
      });
    });
  }, []);

  useEffect(() => {
    const onOpen = e => openById(e.detail);
    window.addEventListener(OPEN_PIECE_EVENT, onOpen);
    const hash = window.location.hash.match(/^#p-(.+)$/);
    if (hash) openById(hash[1]);
    return () => window.removeEventListener(OPEN_PIECE_EVENT, onOpen);
  }, [openById]);

  // Anterior / siguiente dentro de la ficha: detrás, el archivo acompaña.
  function step(dir) {
    const i = projects.findIndex(p => p.id === selected?.id);
    const next = projects[(i + dir + projects.length) % projects.length];
    const el = pieceEl(next.id);
    if (el) scrollToTarget(el, { immediate: true });
    triggerRef.current = el?.querySelector('[data-morph], [data-row]') ?? null;
    setSelected(next);
  }

  // j / k saltan de pieza en pieza en la galería.
  useEffect(() => {
    if (view !== 'gallery') return undefined;
    function onKeyDown(e) {
      if (selected || e.metaKey || e.ctrlKey || e.altKey || isTyping(e)) return;
      const dir = e.key === 'j' ? 1 : e.key === 'k' ? -1 : 0;
      if (!dir) return;
      const els = visible.map(p => pieceEl(p.id)).filter(Boolean);
      const anchor = 64 + 40;
      const tops = els.map(el => el.getBoundingClientRect().top - anchor);
      // La pieza en la que estás: la última que ya pasó el borde de arriba.
      const current = tops.findLastIndex(top => top <= 4);
      const target = dir > 0
        ? current + 1
        : current > -1 && tops[current] < -4 ? current : current - 1;
      const el = els[Math.max(0, Math.min(els.length - 1, target))];
      if (el) scrollToTarget(el, { offset: -anchor });
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [view, visible, selected]);

  const position = projects.findIndex(p => p.id === selected?.id);

  return (
    <section id="archivo" className={styles.archive}>
      <header className={`wrap ${styles.head}`}>
        <h2 className={styles.title}>{t('archive.title')}</h2>
        <div className={styles.controls}>
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
          <div className={styles.views} role="group" aria-label={t('archive.view.label')}>
            {['gallery', 'index'].map(v => (
              <button
                key={v}
                type="button"
                className={`${styles.filter} ${view === v ? styles.filterOn : ''}`}
                aria-pressed={view === v}
                onClick={() => changeView(v)}
              >
                {t(`archive.view.${v}`)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {view === 'index' ? (
        <ArchiveIndex pieces={visible} onOpen={open} />
      ) : (
        <div className={`wrap ${styles.list}`}>
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((piece, i) => (
              <Piece key={piece.id} piece={piece} index={i} total={visible.length} onOpen={open} reduceMotion={reduceMotion} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <ProjectModal
            project={selected}
            originRef={triggerRef}
            position={projects.length > 1 ? [position + 1, projects.length] : null}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
