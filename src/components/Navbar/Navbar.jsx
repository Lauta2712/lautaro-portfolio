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
  const [active, setActive]       = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean);
    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(entry => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top <= b.boundingClientRect.top ? a : b));
        setActive(`#${topMost.target.id}`);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
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
            <a
              key={key}
              href={href}
              className={`${styles.link} ${active === href ? styles.active : ''}`}
              aria-current={active === href ? 'true' : undefined}
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
