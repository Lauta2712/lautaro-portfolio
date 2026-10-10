import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TOOLS } from '../data/tools';
import Signature from '../components/Signature/Signature';
import styles from './ToolsPage.module.css';

const pad = n => String(n).padStart(2, '0');

export default function ToolsPage() {
  const { t } = useTranslation();

  useEffect(() => {
    const previous = document.title;
    document.title = 'Tools · L20N';
    return () => { document.title = previous; };
  }, []);

  return (
    <div className={styles.page}>
      <header className={`wrap ${styles.head}`}>
        <a href="/" className={styles.back}>← {t('cv.back')}</a>
        <h1 className={styles.title}>{t('nav.tools')}</h1>
        <p className={styles.intro}>{t('tools.intro')}</p>
      </header>

      <div className={`wrap ${styles.list}`}>
        {TOOLS.map((tool, i) => (
          <article key={tool.id} className={styles.tool}>
            <div className={styles.meta}>
              <span className={styles.number}>{pad(i + 1)}</span>
              <p className={styles.kind}>{t(tool.statusKey)}</p>
              <h2 className={styles.name}>{tool.name}</h2>
              <p className={styles.tagline}>{t(tool.taglineKey)}</p>

              <ol className={styles.features}>
                {tool.features.map((f, j) => (
                  <li key={f}><span>{pad(j + 1)}</span>{f}</li>
                ))}
              </ol>

              <p className={styles.stack}>{tool.stack.join(' · ')}</p>

              <a href={tool.url} target="_blank" rel="noreferrer" className={styles.cta}>
                {t('tools.open')} {tool.name} ↗
              </a>

              <p className={styles.sig}>
                {t('hero.signatureOf')} <Signature seed={tool.name} small className={styles.sigMark} />
              </p>
            </div>

            <div className={styles.shots}>
              {tool.shots.map(shot => (
                <a key={shot.image} href={tool.url} target="_blank" rel="noreferrer" className={styles.shot} data-cursor={t('archive.go')}>
                  <img src={shot.image} alt={shot.alt} loading="lazy" />
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
