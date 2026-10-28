import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { useMagnetic } from '../../hooks/useMagnetic';
import Signature from '../Signature/Signature';
import { pauseScroll, resumeScroll } from '../../lib/lenis';
import styles from './ProjectModal.module.css';

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const EASE = [0.16, 1, 0.3, 1];
const pad = n => String(n).padStart(2, '0');

const rectOf = el => {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
};

function placeGhost(ghost, r, objectPosition) {
  Object.assign(ghost.style, {
    display: 'block',
    top: `${r.top}px`,
    left: `${r.left}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
    objectPosition,
  });
}

const onScreen = r => r.width > 0 && r.top < window.innerHeight && r.top + r.height > 0;

export default function ProjectModal({ project, originRef, position, onPrev, onNext, onClose }) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const coverRef = useRef(null);
  const ghostRef = useRef(null);
  const closeBtnRef = useRef(null);
  const closingRef = useRef(false);
  const swipeRef = useRef(null);
  const [dir, setDir] = useState(0);
  const liveCta = useMagnetic(0.25, 40);

  // La imagen de la ficha sale de la imagen del archivo que tocaste, y vuelve ahí al cerrar.
  const morphFrom = useCallback(() => {
    const origin = originRef?.current;
    if (reduceMotion || !project.image || origin?.dataset.morph === undefined) return null;
    const r = rectOf(origin);
    return onScreen(r) ? r : null;
  }, [originRef, project.image, reduceMotion]);

  useLayoutEffect(() => {
    const from = morphFrom();
    const cover = coverRef.current;
    const ghost = ghostRef.current;
    if (!from || !cover || !ghost) return;
    const to = rectOf(cover);
    cover.style.visibility = 'hidden';
    placeGhost(ghost, from, '50% 50%');
    animate(ghost, { ...to, objectPosition: '50% 0%' }, { duration: 0.7, ease: EASE }).then(() => {
      cover.style.visibility = '';
      ghost.style.display = 'none';
    });
    // Solo al abrir: al pasar de proyecto la imagen cambia sin viajar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestClose = useCallback(async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    const to = morphFrom();
    const cover = coverRef.current;
    const ghost = ghostRef.current;
    const fades = [
      animate(backdropRef.current, { opacity: 0 }, { duration: to ? 0.55 : 0.2 }),
      animate(panelRef.current, { opacity: 0 }, { duration: 0.2 }),
    ];
    if (to && cover && ghost) {
      const from = rectOf(cover);
      placeGhost(ghost, from, '50% 0%');
      cover.style.visibility = 'hidden';
      fades.push(animate(ghost, { ...to, objectPosition: '50% 50%' }, { duration: 0.6, ease: EASE }));
    }
    await Promise.all(fades);
    onClose();
  }, [morphFrom, onClose]);

  const go = useCallback(d => {
    if (!position) return;
    setDir(d);
    (d > 0 ? onNext : onPrev)();
  }, [position, onNext, onPrev]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    pauseScroll();
    closeBtnRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      resumeScroll();
    };
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') requestClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [requestClose, go]);

  // Swipe horizontal en pantallas táctiles: pasa de proyecto.
  function onPointerDown(e) {
    if (e.pointerType === 'touch') swipeRef.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerUp(e) {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  }

  return createPortal(
    <>
      <motion.div
        ref={backdropRef}
        className={styles.backdrop}
        onClick={requestClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          ref={panelRef}
          className={styles.panel}
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-label={project.name}
          onClick={e => e.stopPropagation()}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { swipeRef.current = null; }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <button
            ref={closeBtnRef}
            type="button"
            className={styles.close}
            onClick={requestClose}
            aria-label={t('projects.close')}
          >
            <CloseIcon />
          </button>

          <motion.div
            key={project.id}
            initial={dir ? { opacity: 0, x: dir * 32 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className={styles.cover}>
              {project.cover === 'image' ? (
                <img ref={coverRef} src={project.image} alt="" className={styles.coverImage} />
              ) : (
                <div className={styles.coverAbstract}>
                  <Signature seed={project.name} />
                </div>
              )}
            </div>

            <div className={styles.content}>
              <div className={styles.header}>
                <h3 className={styles.name}>{project.name}</h3>
                <span className={styles.status}>{t(project.status)}</span>
              </div>

              <p className={styles.desc}>{t(project.descKey)}</p>

              <div className={styles.stack}>
                {project.stack.map(tech => (
                  <span key={tech} className={styles.badge}>{tech}</span>
                ))}
              </div>

              <div className={styles.links}>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.btnSecondary}
                  >
                    <GitHubIcon />
                    <span>{t('projects.code')}</span>
                  </a>
                )}
                {project.live && (
                  <motion.a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.btnPrimary}
                    style={liveCta.style}
                    onMouseMove={liveCta.onMouseMove}
                    onMouseLeave={liveCta.onMouseLeave}
                  >
                    <ExternalIcon />
                    <span>{t('projects.live')}</span>
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>

          {position && (
            <nav className={styles.pager} aria-label={t('projects.pager')}>
              <button type="button" onClick={() => go(-1)}>← {t('projects.prev')}</button>
              <span>{pad(position[0])} / {pad(position[1])}</span>
              <button type="button" onClick={() => go(1)}>{t('projects.next')} →</button>
            </nav>
          )}
        </motion.div>
      </motion.div>
      <img ref={ghostRef} src={project.image} alt="" className={styles.ghost} aria-hidden="true" />
    </>,
    document.body
  );
}
