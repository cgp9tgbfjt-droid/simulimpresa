import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';

function subscribe(callback: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

/** true se l'utente ha richiesto riduzione del movimento. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
