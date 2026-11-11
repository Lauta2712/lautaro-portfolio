// Historias destacadas para @l20n.archive (en exploración). 1080×1920.
// Tipos:
//   tapa     → { g: glifo de la portada del destacado (se recorta en círculo) }
//   intro    → { t: palabra gigante, label }
//   item     → { n, t, lines: [], img?, crop?, flow?: [nodos], mock?: { t, tag, cta }, de?: [proyectos] }
//   cierre   → { t, lines?: [], cta?: texto que apunta a la caja de respuesta }
// Los títulos y las líneas son borradores: reescribilos a tu manera y volvé a renderizar.

window.HISTORIAS = {
  // v3 (2026-11-10): embudo por DM. Sin sitios/landings ni publicidad (en pausa). Copy = borrador para que lo reescribas.
  servicios: {
    slides: [
      { type: 'tapa', g: 'S' },
      { type: 'intro', t: 'sistemas', label: 'operación · integración · automatización' },
      {
        type: 'item', n: '01', t: 'conectar',
        lines: ['planillas, chats, cobros, crm', 'que se pasen los datos solos', 'nadie más copiando y pegando'],
        flow: ['planilla', 'whatsapp', 'cobros', 'crm'], de: ['monteca', 'compass'],
      },
      {
        type: 'item', n: '02', t: 'automático',
        lines: ['pólizas que avisan antes de vencer', 'reportes que llegan sin pedirlos', 'datos al día, todos los días'],
        img: 'brief-m-1', crop: 'phone', de: ['notificador monteca', 'brief'],
      },
      {
        type: 'item', n: '03', t: 'gestión',
        lines: ['clientes, cobros, turnos, roles', 'un sistema hecho a cómo trabajás', 'llave en mano'],
        img: 'compass-app', de: ['compass', 'monteca', 'crew'],
      },
      {
        type: 'item', n: '04', t: 'ia',
        lines: ['resumir, clasificar, responder', 'pedidos y soporte', 'donde suma, no para decorar'],
        img: 'brief-d-1', de: ['brief'],
      },
      {
        type: 'item', n: '05', t: 'guardia',
        lines: ['si algo falla, me entero yo primero', 'mantenimiento y mejoras cada mes', 'datos ordenados, no parches'],
      },
      { type: 'cierre', t: 'trabajemos' },
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
      {
        type: 'cierre', t: 'contame',
        lines: ['en qué andás', 'y lo pensamos juntos'],
        cta: 'respondé esta historia',
      },
    ],
  },
};
