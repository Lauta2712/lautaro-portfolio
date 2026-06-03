import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { key: 'nav.about',      href: '#about' },
  { key: 'nav.experience', href: '#experience' },
  { key: 'nav.projects',   href: '#projects' },
  { key: 'nav.tech',       href: '#tech' },
  { key: 'nav.contact',    href: '#contact' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#hero" className={styles.logo} onClick={close}>
          <span className={styles.logoAccent}>{'<'}</span>LR
          <span className={styles.logoAccent}>{'/>'}</span>
        </a>

        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          {NAV_LINKS.map(({ key, href }) => (
            <a key={key} href={href} className={styles.link} onClick={close}>
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
            className={styles.burger}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
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
