import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './TechStack.module.css';

const TECH = [
  {
    categoryKey: 'tech.frontend',
    items: ['React', 'Next.js', 'Vite', 'JavaScript (ES2022+)', 'CSS Modules', 'HTML5'],
  },
  {
    categoryKey: 'tech.backend',
    items: ['Node.js', 'Supabase', 'PostgreSQL', 'REST APIs', 'Webhooks'],
  },
  {
    categoryKey: 'tech.tools',
    items: ['Git', 'GitHub', 'Vercel', 'VS Code', 'Docker', 'Postman'],
  },
  {
    categoryKey: 'tech.ai',
    items: ['n8n', 'Claude API', 'Anthropic SDK', 'Salesforce', 'Telegram Bot API', 'Playwright'],
  },
];

export default function TechStack() {
  const { t } = useTranslation();
  const ref = useScrollReveal();

  return (
    <section id="tech" className={`section ${styles.tech}`}>
      <div className="container" ref={ref}>
        <p className="section-label">{t('tech.label')}</p>
        <h2 className="section-title">{t('tech.title')}</h2>
        <div className="section-divider" />

        <div className={styles.grid}>
          {TECH.map((group, i) => (
            <div
              key={group.categoryKey}
              className={`reveal ${styles.group}`}
              style={{ '--delay': `${i * 0.08}s` }}
            >
              <span className="reg-corners" aria-hidden="true" />
              <h3 className={styles.category}>{t(group.categoryKey)}</h3>
              <ul className={styles.list}>
                {group.items.map(item => (
                  <li key={item} className={styles.item}>
                    <span className={styles.dot} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
