import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectModal from './ProjectModal';
import compassImg from '../../assets/projects/compass.webp';
import crewImg from '../../assets/projects/crew.webp';
import briefImg from '../../assets/projects/brief.webp';
import montecaImg from '../../assets/projects/monteca.webp';
import styles from './Projects.module.css';

const PROJECTS = [
  {
    id: 'crew',
    name: 'Crew',
    descKey: 'projects.crew.desc',
    stack: ['Vite', 'React', 'Supabase', 'PostgreSQL', 'CSS Modules'],
    github: null,
    live: 'https://crew-ps.vercel.app/',
    status: 'projects.status.inProgress',
    span: 2,
    cover: 'image',
    image: crewImg,
  },
  {
    id: 'pulso',
    name: 'Compass',
    descKey: 'projects.pulso.desc',
    stack: ['React 19', 'Vite', 'Supabase', 'Zustand', 'TanStack Query', '@dnd-kit'],
    github: null,
    live: 'https://compass-ps.vercel.app/',
    status: 'projects.status.live',
    span: 2,
    cover: 'image',
    image: compassImg,
  },
  {
    id: 'brief',
    name: 'Brief.',
    descKey: 'projects.brief.desc',
    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS 4', 'React Router 7', 'Supabase', 'n8n'],
    github: null,
    live: 'https://hibrief.vercel.app/',
    status: 'projects.status.live',
    span: 2,
    cover: 'image',
    image: briefImg,
  },
  {
    id: 'monteca',
    name: 'Monteca',
    descKey: 'projects.insurance.desc',
    stack: ['React 19', 'Vite', 'Supabase', 'PostgreSQL'],
    github: null,
    live: 'https://monteca-system.vercel.app/',
    status: 'projects.status.live',
    span: 2,
    cover: 'image',
    image: montecaImg,
  },
  {
    id: 'agent',
    name: 'Agente Conversacional B2B',
    descKey: 'projects.agent.desc',
    stack: ['n8n', 'Claude API', 'Salesforce', 'Telegram Bot'],
    github: null,
    live: null,
    status: 'projects.status.deployed',
    span: 1,
    cover: 'abstract',
  },
  {
    id: 'landing',
    name: 'B2B Landing Page',
    descKey: 'projects.landing.desc',
    stack: ['React 19', 'Vite', 'CSS Modules'],
    github: 'https://github.com/Lauta2712',
    live: 'https://monteca-landing.vercel.app/',
    status: 'projects.status.live',
    span: 2,
    cover: 'abstract',
  },
  {
    id: 'scraper',
    name: 'Mountain Project Scraper',
    descKey: 'projects.scraper.desc',
    stack: ['Node.js', 'Playwright', 'JSON'],
    github: 'https://github.com/Lauta2712',
    live: null,
    status: 'projects.status.tool',
    span: 1,
    cover: 'abstract',
  },
];

function statusKind(status) {
  return status.split('.').pop();
}

function hueFromId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 360;
  return hash;
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function CompassMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function handleSpotlight(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  e.currentTarget.style.setProperty('--mx', `${x}%`);
  e.currentTarget.style.setProperty('--my', `${y}%`);
}

export default function Projects() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const triggerRef = useRef(null);

  function openModal(project, e) {
    triggerRef.current = e?.currentTarget ?? null;
    setSelected(project);
  }

  function closeModal() {
    setSelected(null);
    triggerRef.current?.focus?.();
  }

  return (
    <section id="projects" className={`section ${styles.projects}`}>
      <div className="container">
        <p className="section-label">{t('projects.label')}</p>
        <h2 className="section-title">{t('projects.title')}</h2>
        <div className="section-divider" />

        <div className={styles.grid}>
          {PROJECTS.map((project, i) => (
            <motion.article
              key={project.id}
              className={`${styles.card} ${styles[`span${project.span}`]}`}
              role="button"
              tabIndex={0}
              aria-label={`${t('projects.viewDetails')} ${project.name}`}
              onClick={e => openModal(project, e)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openModal(project, e);
                }
              }}
              onMouseMove={handleSpotlight}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.spotlight} aria-hidden="true" />
              <span className="reg-corners" aria-hidden="true" />

              <div className={styles.cover}>
                {project.cover === 'image' ? (
                  <div className={styles.coverImage}>
                    <div className={styles.chrome} aria-hidden="true">
                      <span className={styles.dotRed} />
                      <span className={styles.dotAmber} />
                      <span className={styles.dotGreen} />
                    </div>
                    <img src={project.image} alt="" loading="lazy" />
                  </div>
                ) : (
                  <div className={styles.coverAbstract} style={{ '--hue': hueFromId(project.id) }}>
                    <CompassMark />
                  </div>
                )}
              </div>

              <div className={styles.body}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.name}>{project.name}</h3>
                  <span className={`${styles.status} ${styles[`status--${statusKind(project.status)}`]}`}>
                    {t(project.status)}
                  </span>
                </div>

                <p className={styles.desc}>{t(project.descKey)}</p>

                <div className={styles.stack}>
                  {project.stack.slice(0, 4).map(tech => (
                    <span key={tech} className={styles.badge}>{tech}</span>
                  ))}
                  {project.stack.length > 4 && (
                    <span className={styles.badge}>+{project.stack.length - 4}</span>
                  )}
                </div>

                <div className={styles.links}>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.link}
                      aria-label={`${project.name} GitHub`}
                      onClick={e => e.stopPropagation()}
                    >
                      <GitHubIcon />
                      <span>{t('projects.code')}</span>
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className={`${styles.link} ${styles.linkLive}`}
                      aria-label={`${project.name} live demo`}
                      onClick={e => e.stopPropagation()}
                    >
                      <ExternalIcon />
                      <span>{t('projects.live')}</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={closeModal} />}
      </AnimatePresence>
    </section>
  );
}
