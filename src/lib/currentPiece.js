import { useSyncExternalStore } from 'react';

// La pieza que está en pantalla. El navbar dibuja su firma.
let current = null;
const listeners = new Set();

export function setCurrentPiece(piece) {
  if (piece === current) return;
  current = piece;
  listeners.forEach(fn => fn());
}

export function useCurrentPiece() {
  return useSyncExternalStore(
    fn => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => current,
  );
}
