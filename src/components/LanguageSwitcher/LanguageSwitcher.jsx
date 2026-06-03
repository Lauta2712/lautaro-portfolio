import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith('es') ? 'es' : 'en';

  const toggle = () => {
    i18n.changeLanguage(current === 'es' ? 'en' : 'es');
  };

  return (
    <button className={styles.switcher} onClick={toggle} aria-label="Switch language">
      <span className={current === 'es' ? styles.active : styles.inactive}>ES</span>
      <span className={styles.sep}>/</span>
      <span className={current === 'en' ? styles.active : styles.inactive}>EN</span>
    </button>
  );
}
