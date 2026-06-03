import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './Experience.module.css';

const EXPERIENCE = [
  {
    id: 'pulso',
    company: 'Pulso Studio',
    role: 'exp.pulso.role',
    period: 'exp.pulso.period',
    desc: 'exp.pulso.desc',
    stack: ['React', 'Vite', 'CSS Modules', 'Supabase', 'n8n', 'Claude API'],
    highlight: true,
  },
  {
    id: 'ant',
    company: 'ANT Automation',
    role: 'exp.ant.role',
    period: 'Jul 2023 — Mar 2026',
    desc: 'exp.ant.desc',
    stack: ['React', 'Redux', 'Material UI', 'Highcharts', 'C#', '.NET', 'SQL Server', 'Docker'],
    highlight: true,
  },
  {
    id: 'coneq',
    company: 'Coneq',
    role: 'exp.coneq.role',
    period: 'Dec 2024 — Jan 2025',
    desc: 'exp.coneq.desc',
    stack: ['React', 'CSS', 'EmailJS', 'LeafletJS'],
    highlight: false,
  },
  {
    id: 'qxm',
    company: 'QXM — Quien x Mi',
    role: 'exp.qxm.role',
    period: 'Sep 2023 — Dec 2023',
    desc: 'exp.qxm.desc',
    stack: ['React', 'Angular', 'SCSS', 'Bootstrap', 'NestJS'],
    highlight: false,
  },
];

export default function Experience() {
  const { t } = useTranslation();
  const ref = useScrollReveal();

  return (
    <section id="experience" className={`section ${styles.experience}`}>
      <div className="container" ref={ref}>
        <p className="section-label">{t('exp.label')}</p>
        <h2 className="section-title">{t('exp.title')}</h2>
        <div className="section-divider" />

        <div className={styles.timeline}>
          {EXPERIENCE.map((item, i) => (
            <div
              key={item.id}
              className={`reveal ${styles.item} ${item.highlight ? styles.highlighted : ''}`}
              style={{ '--delay': `${i * 0.1}s` }}
            >
              <div className={styles.dot}>
                <div className={styles.dotInner} />
              </div>

              <div className={styles.card}>
                <div className={styles.cardTop}>
                  <div>
                    <h3 className={styles.company}>{item.company}</h3>
                    <p className={styles.role}>{t(item.role)}</p>
                  </div>
                  <span className={styles.period}>
                    {item.period.startsWith('exp.') ? t(item.period) : item.period}
                  </span>
                </div>

                <p className={styles.desc}>{t(item.desc)}</p>

                <div className={styles.stack}>
                  {item.stack.map(tech => (
                    <span key={tech} className={styles.badge}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
