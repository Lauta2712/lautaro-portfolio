// Historias destacadas para @l20n.archive (en exploración). 1080×1920.
// Tipos:
//   tapa     → { g: glifo de la portada del destacado (se recorta en círculo) }
//   intro    → { t: palabra gigante, label }
//   item     → { n, t, lines: [], img, crop?, de: [proyectos de donde sale] }
//   cierre   → { t, lines: [] }
// Los títulos y las líneas son borradores: reescribilos a tu manera y volvé a renderizar.

window.HISTORIAS = {
  servicios: {
    slides: [
      { type: 'tapa', g: 'S' },
      { type: 'intro', t: 'servicios', label: 'lo que ya anda' },
      {
        type: 'item', n: '01', t: 'sitios',
        lines: ['landings que traen consultas', 'rápidas, en español e inglés'],
        img: 'monteca-d-0', de: ['monteca', 'compass', 'brief'],
      },
      {
        type: 'item', n: '02', t: 'sistemas',
        lines: ['clientes, pagos, recibos, roles', 'hechos para cómo trabajás vos'],
        img: 'compass-app', de: ['monteca', 'compass', 'crew'],
      },
      {
        type: 'item', n: '03', t: 'automatizaciones',
        lines: ['avisos por email y whatsapp', 'newsletters, resúmenes, reportes', 'corren solas todos los días'],
        img: 'brief-m-1', crop: 'phone', de: ['notificador monteca', 'brief'],
      },
      {
        type: 'item', n: '04', t: 'ia útil',
        lines: ['resumir, clasificar, traducir', 'donde suma, no para decorar'],
        img: 'brief-d-1', de: ['brief'],
      },
      { type: 'cierre', t: 'escribime', lines: ['l20n.archive@gmail.com', 'l20n.vercel.app'] },
    ],
  },

  proceso: {
    slides: [
      { type: 'tapa', g: 'P' },
      { type: 'intro', t: 'proceso', label: 'cómo laburo' },
      { type: 'item', n: '01', t: 'entender', lines: ['qué duele y a quién', 'antes de hablar de pantallas'] },
      {
        type: 'item', n: '02', t: 'dibujar',
        lines: ['el plano antes de la obra', 'arquitectura, datos, flujos'],
        img: 'blueprint', de: ['blueprint'],
      },
      { type: 'item', n: '03', t: 'construir', lines: ['una versión que se use rápido', 'y después se pule'] },
      { type: 'item', n: '04', t: 'que ande solo', lines: ['deploy, avisos, mantenimiento', 'si se rompe, me entero yo primero'] },
      { type: 'cierre', t: 'escribime', lines: ['l20n.archive@gmail.com', 'l20n.vercel.app'] },
    ],
  },
};
