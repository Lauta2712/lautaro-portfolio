import compassImg from '../assets/projects/compass.webp';
import crewImg from '../assets/projects/crew.webp';
import briefImg from '../assets/projects/brief.webp';
import montecaImg from '../assets/projects/monteca.webp';
import noodleImg from '../assets/projects/noodle-landing.webp';

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
    id: 'brief',
    type: 'project',
    name: 'Brief.',
    descKey: 'projects.brief.desc',
    stack: ['React 19', 'TypeScript', 'Vite', 'CSS Modules', 'Supabase', 'Vercel Functions', 'n8n'],
    github: null,
    live: 'https://hibrief.vercel.app/',
    status: 'projects.status.live',
    cover: 'image',
    image: briefImg,
  },
  {
    id: 'pulso',
    type: 'project',
    name: 'Compass',
    descKey: 'projects.pulso.desc',
    stack: ['React 19', 'Vite', 'Supabase', 'TanStack Query', 'Zustand', '@dnd-kit', 'react-konva'],
    github: null,
    live: 'https://compass-ps.vercel.app/',
    status: 'projects.status.live',
    cover: 'image',
    image: compassImg,
  },
  {
    id: 'monteca',
    type: 'project',
    name: 'Monteca',
    descKey: 'projects.insurance.desc',
    stack: ['React 19', 'Vite', 'Supabase', 'jsPDF', 'Vitest', 'Python', 'WhatsApp Cloud API'],
    github: null,
    live: 'https://monteca-system.vercel.app/',
    status: 'projects.status.live',
    cover: 'image',
    image: montecaImg,
  },
  {
    id: 'crew',
    type: 'project',
    name: 'Crew',
    descKey: 'projects.crew.desc',
    stack: ['React 19', 'Vite', 'Tailwind CSS 4', 'Supabase', 'Mercado Pago', 'Recharts'],
    github: null,
    live: 'https://crew-ps.vercel.app/',
    status: 'projects.status.beta',
    cover: 'image',
    image: crewImg,
  },
  {
    id: 'noodle',
    type: 'project',
    name: 'Noodle',
    descKey: 'projects.noodle.desc',
    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS 4', 'Dexie', 'Web Audio API', 'PWA'],
    github: null,
    live: 'https://noodle-music.vercel.app/',
    status: 'projects.status.beta',
    cover: 'image',
    image: noodleImg,
  },
];

export const TYPES = ['project', 'photo', 'video', 'note'];
