// Eventos para hablar con la paleta de comandos y el archivo desde cualquier lado.
export const OPEN_PALETTE_EVENT = 'l20n:palette';
export const OPEN_PIECE_EVENT = 'l20n:open-piece';

export function openPalette() {
  window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
}
