import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Signature from '../Signature/Signature';
import { MOTHER } from '../../data/pieces';
import { useCurrentPiece } from '../../lib/currentPiece';
import { useLanded } from '../../lib/landing';
import { openPalette } from '../../lib/palette';
import styles from './Navbar.module.css';

const HOME_LINKS = [
  { key: 'nav.projects', href: '/#archivo' },
  { key: 'nav.about',    href: '/#info' },
  { key: 'nav.contact',  href: '/#contacto' },
  { key: 'nav.tools',    href: '/tools' },
  { key: 'nav.cv',       href: '/cv' },
];

export default function Navbar({ page = 'home' }) {
  const { t } = useTranslation();
  const { piece, index, total } = useCurrentPiece();
  const landed = useLanded();
  // En home el logo aparece cuando la firma del intro aterriza en su lugar.
  const past = page !== 'home' || landed;
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);
  const showPiece = piece && past && page === 'home';
  const label = showPiece ? `${t('hero.signatureOf')} ${piece.name}` : 'L20N';
  const pad = n => String(n).padStart(2, '0');

  return (
    <header className={`${styles.header} ${past ? styles.past : ''}`}>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.brand}>
          <a href="/#top" className={styles.logo} onClick={close} aria-label="L20N" title={label} data-logo>
            {showPiece
              ? <Signature seed={piece.name ?? piece.id} small />
              : <Signature data={MOTHER} small />}
          </a>
          {showPiece && total > 0 && (
            <span className={styles.count} aria-label={`${index + 1} / ${total}`}>
              <span key={index} className={styles.countNow}>{pad(index + 1)}</span> / {pad(total)}
            </span>
          )}
        </div>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          {HOME_LINKS.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              className={`${styles.link} ${href === `/${page}` ? styles.active : ''}`}
              aria-current={href === `/${page}` ? 'page' : undefined}
              onClick={close}
            >
              {t(key)}
            </a>
          ))}
          <button
            type="button"
            className={`${styles.link} ${styles.searchMobile}`}
            onClick={() => { close(); openPalette(); }}
          >
            {t('palette.open')}
          </button>
          <div className={styles.langMobile}>
            <LanguageSwitcher />
          </div>
        </nav>

        <div className={styles.actions}>
          <button type="button" className={styles.palette} onClick={openPalette} aria-label={t('palette.open')}>
            <kbd>{navigator.platform?.startsWith('Mac') ? '⌘' : 'Ctrl'}</kbd><kbd>K</kbd>
          </button>
          <LanguageSwitcher />
          <button
            type="button"
            className={styles.burger}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
          </button>
        </div>
      </div>

      {menuOpen && <div className={styles.backdrop} onClick={close} />}
    </header>
  );
}