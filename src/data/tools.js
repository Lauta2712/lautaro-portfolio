import compassImg from '../assets/projects/compass.webp';
import compassAppImg from '../assets/projects/compass-app.webp';

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
    stack: ['React 19', 'Vite', 'Supabase', 'Zustand', 'TanStack Query', '@dnd-kit'],
    url: 'https://compass-ps.vercel.app/',
    shots: [
      { image: compassImg, alt: 'Compass: portada con funciones y precios' },
      { image: compassAppImg, alt: 'Compass: dashboard de una agencia' },
    ],
  },
];
