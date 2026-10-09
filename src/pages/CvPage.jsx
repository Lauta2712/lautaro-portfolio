import { useTranslation } from 'react-i18next';
import Experience from '../components/Experience/Experience';
import TechStack from '../components/TechStack/TechStack';
import styles from './CvPage.module.css';

export default function CvPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <header className={`wrap ${styles.head}`}>
        <a href="/" className={styles.back}>← {t('cv.back')}</a>
        <h1 className={styles.title}>{t('nav.cv')}</h1>
        <div className={styles.downloads}>
          <a href="/docs/Lautaro_Rodriguez_CV.pdf" download>PDF · ES ↓</a>
          <a href="/docs/Lautaro_Rodriguez_CV_EN.pdf" download>PDF · EN ↓</a>
        </div>
      </header>
      <Experience />
      <TechStack />
    </div>
  );
}
