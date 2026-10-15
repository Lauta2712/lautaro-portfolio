import compassImg from '../assets/projects/compass.webp';
import compassAppImg from '../assets/projects/compass-app.webp';
import noodleLandingImg from '../assets/projects/noodle-landing.webp';
import zielImg from '../assets/projects/ziel.webp';

// Las herramientas que se pueden usar hoy, con link para entrar.
// Cada una: nombre, estado, para qué sirve (taglineKey), qué trae
// (features, nombres tal cual aparecen en la app) y capturas.
export const TOOLS = [
  {
    id: 'compass',
    name: 'Compass',
    statusKey: 'tools.status.beta',
    taglineKey: 'tools.compass.tagline',
    features: ['Clientes', 'Proyectos', 'Board', 'Finanzas', 'Cuentas', 'Docs'],
    stack: ['React 19', 'Vite', 'Supabase', 'TanStack Query', 'Zustand', '@dnd-kit', 'react-konva'],
    url: 'https://compass-ps.vercel.app/',
    shots: [
      { image: compassImg, alt: 'Compass: portada con funciones y precios' },
      { image: compassAppImg, alt: 'Compass: dashboard de una agencia' },
    ],
  },
  {
    id: 'noodle',
    name: 'Noodle',
    statusKey: 'tools.status.beta',
    taglineKey: 'tools.noodle.tagline',
    features: ['Afinador', 'Escalas', 'Teoría', 'Jam', 'Compositor', 'Cancionero', 'Entrenador de oído'],
    stack: ['React 19', 'Vite', 'TypeScript', 'Tailwind', 'Dexie', 'PWA'],
    url: 'https://noodle-music.vercel.app/',
    shots: [
      { image: noodleLandingImg, alt: 'Noodle: portada con la cuerda' },
    ],
  },
  {
    id: 'ziel',
    name: 'Ziel',
    statusKey: 'tools.status.beta',
    taglineKey: 'tools.ziel.tagline',
    features: ['Tareas', 'Checklists', 'Notas', 'Links', 'Eventos', 'Archivos', 'Calendario', 'Mapa'],
    stack: ['React 19', 'Vite', 'TypeScript', 'Supabase', 'Leaflet', 'PWA'],
    url: 'https://ziel-l20n.vercel.app/',
    shots: [
      { image: zielImg, alt: 'Ziel: pantalla de acceso' },
    ],
  },
];
