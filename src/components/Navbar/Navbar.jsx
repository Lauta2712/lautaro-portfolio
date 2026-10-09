import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Signature from '../Signature/Signature';
import { MOTHER } from '../../data/pieces';
import { useCurrentPiece } from '../../lib/currentPiece';
import styles from './Navbar.module.css';

const HOME_LINKS = [
  { key: 'nav.projects', href: '/#archivo' },
  { key: 'nav.about',    href: '/#info' },
  { key: 'nav.contact',  href: '/#contacto' },
  { key: 'nav.cv',       href: '/cv' },
];

export default function Navbar({ page = 'home' }) {
  const { t } = useTranslation();
  const piece = useCurrentPiece();
  const [past, setPast] = useState(page !== 'home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (page !== 'home') return undefined;
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 1.2);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [page]);

  const close = () => setMenuOpen(false);
  const label = piece && past ? `${t('hero.signatureOf')} ${piece.name}` : 'L20N';

  return (
    <header className={`${styles.header} ${past ? styles.past : ''}`}>
      <div className={`wrap ${styles.inner}`}>
        <a href="/#top" className={styles.logo} onClick={close} aria-label="L20N" title={label}>
          {piece && past && page === 'home'
            ? <Signature seed={piece.name ?? piece.id} small />
            : <Signature data={MOTHER} small />}
        </a>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          {HOME_LINKS.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              className={`${styles.link} ${page === 'cv' && href === '/cv' ? styles.active : ''}`}
              aria-current={page === 'cv' && href === '/cv' ? 'page' : undefined}
              onClick={close}
            >
              {t(key)}
            </a>
          ))}
          <div className={styles.langMobile}>
            <LanguageSwitcher />
          </div>
        </nav>

        <div className={styles.actions}>
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