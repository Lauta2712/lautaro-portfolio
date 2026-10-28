import { useSyncExternalStore } from 'react';

// Si la firma del intro ya aterrizó en el navbar. El navbar toma la posta desde ahí.
let landed = false;
const listeners = new Set();

export function setLanded(value) {
  if (value === landed) return;
  landed = value;
  listeners.forEach(fn => fn());
}

export function useLanded() {
  return useSyncExternalStore(
    fn => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => landed,
  );
}
