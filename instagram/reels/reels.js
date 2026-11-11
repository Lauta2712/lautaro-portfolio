// Reels para @l20n.archive y TikTok (en exploración). 1080×1920, 30 fps.
// music: { track, bar } → pista de musica/ (ver music.py) y compás en el que arranca.
// El copy es BORRADOR: reescribilo a tu manera y volvé a renderizar.
//
// Escenas (dur en segundos):
//   word  → { t: palabra gigante, label?: línea mono, above?: true pone la línea arriba }
//   log   → { rows: [[hora, texto], …] }       registro que se escribe solo
//   list  → { items: [] }                       tareas a mano que se van tachando
//   flow  → { label?, nodes: [] }               flujo vertical que se enciende paso a paso
//   end   → { t, cta }                          cierre: palabra + llamado a la acción
// caption: texto sugerido para la publicación (reescribilo).

window.REELS = {
  '01-seguros-registro': {
    music: { track: 'noche', bar: 4 },
    caption: 'Un productor de seguros no debería acordarse de cada vencimiento. Avisos y reportes que salen solos, todos los días. Escribime "avisos" por DM.',
    scenes: [
      { type: 'word', t: '08:00', label: 'mientras dormías', dur: 2.4 },
      {
        type: 'log', dur: 6.6,
        rows: [
          ['07:59', 'revisando vencimientos'],
          ['08:00', 'póliza 0213 vence en 7 días'],
          ['08:00', 'whatsapp al asegurado'],
          ['08:00', 'mail con el detalle'],
          ['08:01', 'aviso al productor'],
          ['08:01', 'próxima revisión: mañana 08:00'],
        ],
      },
      { type: 'word', t: 'automático', label: 'avisos y reportes que corren solos', dur: 2.4 },
      { type: 'end', t: 'avisos', cta: 'escribime "avisos" por dm', dur: 2.6 },
    ],
  },

  '02-a-mano': {
    music: { track: 'progresivo', bar: 8 },
    caption: 'Copiar, pegar, perseguir, repetir. Si todavía hacés esto a mano, escribime por DM.',
    scenes: [
      { type: 'word', t: 'en loop', label: 'tu semana:', above: true, dur: 2.4 },
      {
        type: 'list', dur: 7,
        items: [
          'copiar datos de la planilla al chat',
          'confirmar pagos uno por uno',
          'recordar turnos por whatsapp',
          'perseguir señas que no llegaron',
          'armar el reporte del mes',
        ],
      },
      { type: 'word', t: 'conectar', label: 'que los datos pasen solos', dur: 2.2 },
      { type: 'end', t: 'trabajemos', cta: 'escribime por dm', dur: 2.4 },
    ],
  },

  '03-turnos-estetica': {
    music: { track: 'brillante', bar: 4 },
    caption: 'Peluquerías, estética, masajes: turnos, señas y recordatorios que no dependen de que te acuerdes. Escribime "turnos" por DM.',
    scenes: [
      { type: 'word', t: 'turnos', label: 'peluquerías · estética · masajes', dur: 2.4 },
      {
        type: 'flow', label: 'así puede andar solo', dur: 6.6,
        nodes: ['reserva por instagram', 'seña por mercado pago', 'recordatorio 24 h antes', 'reseña en google', 'te escribe a los 30 días'],
      },
      { type: 'end', t: 'turnos', cta: 'escribime "turnos" por dm', dur: 2.6 },
    ],
  },

  '04-consultas-inmobiliaria': {
    music: { track: 'tenso', bar: 6 },
    caption: 'La consulta que se responde en tres horas ya se fue con otra inmobiliaria. Respuesta, visita y seguimiento sin perseguir a nadie. Escribime por DM.',
    scenes: [
      { type: 'word', t: 'consultas', label: 'inmobiliarias', dur: 2.4 },
      {
        type: 'flow', label: 'así puede andar solo', dur: 6.6,
        nodes: ['consulta desde el portal', 'respuesta en un minuto', 'visita agendada', 'recordatorio al interesado', 'seguimiento a los 3 días'],
      },
      { type: 'end', t: 'trabajemos', cta: 'escribime por dm', dur: 2.4 },
    ],
  },

  '05-cuotas-desarrolladora': {
    music: { track: 'tranqui', bar: 4 },
    caption: 'Cuotas, recibos y avance de obra sin planillas cruzadas ni mensajes uno por uno. Escribime "cuotas" por DM.',
    scenes: [
      { type: 'word', t: 'cuotas', label: 'desarrolladoras · constructoras', dur: 2.4 },
      {
        type: 'flow', label: 'así puede andar solo', dur: 6.6,
        nodes: ['cuota del mes', 'aviso de vencimiento', 'pago conciliado', 'recibo automático', 'avance de obra al comprador'],
      },
      { type: 'end', t: 'cuotas', cta: 'escribime "cuotas" por dm', dur: 2.6 },
    ],
  },
};
