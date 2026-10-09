import compassImg from '../assets/projects/compass.webp';
import crewImg from '../assets/projects/crew.webp';
import briefImg from '../assets/projects/brief.webp';
import montecaImg from '../assets/projects/monteca.webp';
import landingImg from '../assets/projects/landing.webp';

// La firma madre: la del logo, con el 0 fino.
export const MOTHER = [1, 1, 0, 0.9, 0.55, 0.55, 0.77, 0.55];

// Todo lo que se muestra en el archivo. Cada pieza tiene un tipo:
//   project → abre la ficha con descripción, stack y links
//   photo   → { image, alt, caption? }
//   video   → { image (miniatura), url }
//   note    → { text, url? }
// Los filtros salen solos de los tipos que haya cargados.
export const PIECES = [
  {
    id: 'crew',
    type: 'project',
    name: 'Crew',
    descKey: 'projects.crew.desc',
    stack: ['Vite', 'React', 'Supabase', 'PostgreSQL', 'CSS Modules'],
    github: null,
    live: 'https://crew-ps.vercel.app/',
    status: 'projects.status.inProgress',
    cover: 'image',
    image: crewImg,
  },
  {
    id: 'pulso',
    type: 'project',
    name: 'Compass',
    descKey: 'projects.pulso.desc',
    stack: ['React 19', 'Vite', 'Supabase', 'Zustand', 'TanStack Query', '@dnd-kit'],
    github: null,
    live: 'https://compass-ps.vercel.app/',
    status: 'projects.status.live',
    cover: 'image',
    image: compassImg,
  },
  {
    id: 'brief',
    type: 'project',
    name: 'Brief.',
    descKey: 'projects.brief.desc',
    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS 4', 'React Router 7', 'Supabase', 'n8n'],
    github: null,
    live: 'https://hibrief.vercel.app/',
    status: 'projects.status.live',
    cover: 'image',
    image: briefImg,
  },
  {
    id: 'monteca',
    type: 'project',
    name: 'Monteca',
    descKey: 'projects.insurance.desc',
    stack: ['React 19', 'Vite', 'Supabase', 'PostgreSQL'],
    github: null,
    live: 'https://monteca-system.vercel.app/',
    status: 'projects.status.live',
    cover: 'image',
    image: montecaImg,
  },
  {
    id: 'agent',
    type: 'project',
    name: 'Agente Conversacional B2B',
    descKey: 'projects.agent.desc',
    stack: ['n8n', 'Claude API', 'Salesforce', 'Telegram Bot'],
    github: null,
    live: null,
    status: 'projects.status.deployed',
    cover: 'abstract',
  },
  {
    id: 'landing',
    type: 'project',
    name: 'B2B Landing Page',
    descKey: 'projects.landing.desc',
    stack: ['React 19', 'Vite', 'CSS Modules'],
    github: 'https://github.com/Lauta2712',
    live: 'https://monteca-landing.vercel.app/',
    status: 'projects.status.live',
    cover: 'image',
    image: landingImg,
  },
  {
    id: 'scraper',
    type: 'project',
    name: 'Mountain Project Scraper',
    descKey: 'projects.scraper.desc',
    stack: ['Node.js', 'Playwright', 'JSON'],
    github: 'https://github.com/Lauta2712',
    live: null,
    status: 'projects.status.tool',
    cover: 'abstract',
  },
];

export const TYPES = ['project', 'photo', 'video', 'note'];
