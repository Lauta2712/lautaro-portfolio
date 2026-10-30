// Carruseles de proyectos para @l20n.archive (en exploración).
// Cada slide tiene un tipo:
//   cover  → { t: título gigante }
//   shot   → { img: una captura o varias apiladas, label }
//   phones → { imgs: [2 o 3 capturas mobile], label }
//   number → { value, label, lines?: [] }                    un dato grande con la regla de la firma
//   flow   → { label, steps: [], side?: { at, steps } }      un diagrama de pasos
//   end    → { url }

window.CARRUSELES = {
  brief: {
    slides: [
      { type: 'cover', t: 'brief.' },
      { type: 'shot', img: ['brief-d-0', 'brief-d-1'], label: 'front · escritorio' },
      { type: 'phones', imgs: ['brief-m-0', 'brief-m-1', 'brief-m-3'], label: 'front · celular' },
      { type: 'number', value: '39', label: 'fuentes', lines: ['medios de acá y de afuera', 'cada nota lleva al original'] },
      {
        type: 'flow', label: 'pipeline',
        steps: ['39 fuentes', 'normalizar', 'deduplicar', 'afuera el ruido', 'resumir y traducir', 'clasificar', 'brief.'],
        side: { at: 6, steps: ['newsletter', 'a la mañana'] },
      },
      { type: 'number', value: '3', label: 'veces por día', lines: ['corre solo', 'nadie aprieta nada'] },
      { type: 'end', url: 'hibrief.site' },
    ],
  },

  compass: {
    slides: [
      { type: 'cover', t: 'compass' },
      { type: 'shot', img: ['compass-d-0', 'compass-app'], label: 'landing · adentro' },
      { type: 'phones', imgs: ['compass-m-0', 'compass-m-1'], label: 'celular' },
      { type: 'number', value: '6', label: 'módulos', lines: ['clientes', 'proyectos', 'board', 'finanzas', 'cuentas', 'docs'] },
      { type: 'end', url: 'compass-ps.vercel.app' },
    ],
  },

  monteca: {
    slides: [
      { type: 'cover', t: 'monteca' },
      { type: 'shot', img: ['monteca-d-0', 'monteca-d-1'], label: 'front · escritorio' },
      { type: 'phones', imgs: ['monteca-m-0', 'monteca-m-1'], label: 'front · celular' },
      {
        type: 'flow', label: 'notificador',
        steps: ['una vez por día', 'leer la base', '¿qué vence?', '¿ya se avisó?', 'email / whatsapp', 'resumen interno'],
      },
      { type: 'number', value: '4', label: 'avisos', lines: ['cuota por vencer', 'cuota vencida', 'póliza por vencer', 'póliza vencida'] },
      { type: 'number', value: '1', label: 'vez por canal', lines: ['nunca el mismo aviso dos veces'] },
      { type: 'end', url: 'monteca-system.vercel.app' },
    ],
  },
};
