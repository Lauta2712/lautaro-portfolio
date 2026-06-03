import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './About.module.css';

const SOFT_SKILLS = [
  'about.skills.collab',
  'about.skills.ownership',
  'about.skills.learning',
  'about.skills.async',
  'about.skills.attention',
];

export default function About() {
  const { t } = useTranslation();
  const ref = useScrollReveal();

  return (
    <section id="about" className={`section ${styles.about}`}>
      <div className="container" ref={ref}>
        <p className="section-label">{t('about.label')}</p>
        <h2 className="section-title">{t('about.title')}</h2>
        <div className="section-divider" />

        <div className={styles.grid}>
          <div className={`reveal ${styles.bio}`}>
            <p>{t('about.bio1')}</p>
            <p>{t('about.bio2')}</p>
            <p>{t('about.bio3')}</p>

            <div className={styles.focus}>
              <span className={styles.focusLabel}>{t('about.focusLabel')}</span>
              <span className={styles.focusValue}>{t('about.focusValue')}</span>
            </div>
          </div>

          <div className={`reveal ${styles.skills}`} style={{ '--delay': '0.1s' }}>
            <h3 className={styles.skillsTitle}>{t('about.softSkillsTitle')}</h3>
            <ul className={styles.skillList}>
              {SOFT_SKILLS.map((key) => (
                <li key={key} className={styles.skillItem}>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
