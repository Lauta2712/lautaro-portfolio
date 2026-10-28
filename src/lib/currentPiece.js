import { useSyncExternalStore } from 'react';

// La pieza que está en pantalla y su lugar en la lista. El navbar dibuja su firma.
let current = { piece: null, index: 0, total: 0 };
const listeners = new Set();

export function setCurrentPiece(piece, index = 0, total = 0) {
  if (piece === current.piece && index === current.index && total === current.total) return;
  current = { piece, index, total };
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
