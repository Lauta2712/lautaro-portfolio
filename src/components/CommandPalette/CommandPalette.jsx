import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { PIECES } from '../../data/pieces';
import { copyEmail } from '../../lib/contact';
import { pauseScroll, resumeScroll, scrollToTarget } from '../../lib/lenis';
import { OPEN_PALETTE_EVENT, OPEN_PIECE_EVENT } from '../../lib/palette';
import styles from './CommandPalette.module.css';

const isHome = () => window.location.pathname.replace(/\/+$/, '') === '';
const normalize = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function goSection(hash) {
  if (isHome()) scrollToTarget(hash);
  else window.location.href = `/${hash}`;
}

function openPiece(id) {
  if (isHome()) window.dispatchEvent(new CustomEvent(OPEN_PIECE_EVENT, { detail: id }));
  else window.location.href = `/#p-${id}`;
}

function useCommands() {
  const { t, i18n } = useTranslation();
  const es = i18n.language?.startsWith('es');

  return useMemo(() => [
    { group: 'go', label: t('nav.projects'), run: () => goSection('#archivo') },
    { group: 'go', label: t('nav.about'), run: () => goSection('#info') },
    { group: 'go', label: t('nav.contact'), run: () => goSection('#contacto') },
    { group: 'go', label: t('nav.tools'), run: () => { window.location.href = '/tools'; } },
    { group: 'go', label: t('nav.cv'), run: () => { window.location.href = '/cv'; } },
    ...PIECES.filter(p => p.type === 'project').map(p => ({
      group: 'pieces',
      label: p.name,
      hint: p.stack?.slice(0, 3).join(' · '),
      keywords: p.stack?.join(' '),
      run: () => openPiece(p.id),
    })),
    { group: 'do', label: t('palette.copyEmail'), keepOpen: true, run: copyEmail, done: t('palette.copied') },
    { group: 'do', label: t('palette.language'), hint: es ? 'EN' : 'ES', run: () => i18n.changeLanguage(es ? 'en' : 'es') },
    { group: 'do', label: t('palette.downloadCv'), hint: 'PDF', run: () => window.open(es ? '/docs/Lautaro_Rodriguez_CV.pdf' : '/docs/Lautaro_Rodriguez_CV_EN.pdf', '_blank') },
    { group: 'do', label: 'GitHub', hint: '↗', run: () => window.open('https://github.com/Lauta2712', '_blank') },
    { group: 'do', label: 'LinkedIn', hint: '↗', run: () => window.open('https://linkedin.com/in/lautaro-rodriguez-marcon', '_blank') },
  ], [t, i18n, es]);
}

function Palette({ onClose }) {
  const { t } = useTranslation();
  const commands = useCommands();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(null);
  const listRef = useRef(null);

  const results = useMemo(() => {
    const words = normalize(query).split(/\s+/).filter(Boolean);
    return commands.filter(c => {
      const hay = normalize(`${c.label} ${c.keywords ?? ''} ${t(`palette.groups.${c.group}`)}`);
      return words.every(w => hay.includes(w));
    });
  }, [commands, query, t]);

  useEffect(() => {
    pauseScroll();
    return resumeScroll;
  }, []);

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  async function run(command) {
    if (!command) return;
    if (command.keepOpen) {
      const ok = await command.run();
      if (ok !== false) setDone(command.label);
      setTimeout(onClose, 700);
      return;
    }
    onClose();
    // Se corre después de cerrar, con el scroll ya liberado.
    requestAnimationFrame(() => command.run());
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(i => (i + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(i => (i - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  }

  return (
    <motion.div
      className={styles.backdrop}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={t('palette.open')}
        data-lenis-prevent
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <label className={styles.prompt}>
          <span aria-hidden="true">&gt;</span>
          <input
            autoFocus
            value={query}
            onChange={e => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            placeholder={t('palette.placeholder')}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[active] ? `palette-${active}` : undefined}
            spellCheck="false"
            autoComplete="off"
          />
        </label>

        <ul ref={listRef} id="palette-list" className={styles.list} role="listbox">
          {results.length === 0 && <li className={styles.empty}>{t('palette.empty')}</li>}
          {results.map((c, i) => {
            const heading = c.group !== results[i - 1]?.group;
            return (
              <li key={`${c.group}-${c.label}`} role="presentation">
                {heading && <p className={styles.group}>{t(`palette.groups.${c.group}`)}</p>}
                <button
                  type="button"
                  id={`palette-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className={styles.item}
                  onPointerMove={() => setActive(i)}
                  onClick={() => run(c)}
                >
                  <span>{done === c.label ? c.done : c.label}</span>
                  {c.hint && <span className={styles.hint}>{c.hint}</span>}
                </button>
              </li>
            );
          })}
        </ul>

        <p className={styles.keys} aria-hidden="true">
          <span><kbd>↑</kbd><kbd>↓</kbd> {t('palette.keys.move')}</span>
          <span><kbd>↵</kbd> {t('palette.keys.run')}</span>
          <span><kbd>esc</kbd> {t('palette.keys.close')}</span>
        </p>
      </motion.div>
    </motion.div>
  );
}

// ⌘K / Ctrl+K desde cualquier página.
export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(v => !v);
      }
    }
    window.addEventListener(OPEN_PALETTE_EVENT, show);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener(OPEN_PALETTE_EVENT, show);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return createPortal(
    <AnimatePresence>
      {open && <Palette onClose={() => setOpen(false)} />}
    </AnimatePresence>,
    document.body,
  );
}
