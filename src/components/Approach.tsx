import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const STAGES = [
  {
    id: 'idea',
    label: 'IDEA',
    title: 'Partiamo dal tuo brand',
    copy: 'Ascoltiamo obiettivi, pubblico e valori: colori, logo e messaggio sono il punto di partenza.',
  },
  {
    id: 'progettazione',
    label: 'PROGETTAZIONE',
    title: 'Scegliamo il prodotto giusto',
    copy: 'Definiamo collezione, materiali e personalizzazione, con un’anteprima indicativa per ogni scelta.',
  },
  {
    id: 'risultato',
    label: 'RISULTATO',
    title: 'Un’identità coerente nel tempo',
    copy: 'Il prodotto diventa il punto di contatto fisico tra il brand e chi lo incontra, in ogni occasione.',
  },
] as const;

export function Approach() {
  const [stage, setStage] = useState(0);
  const reduced = useReducedMotion();

  // Avanza automaticamente solo se l'utente non ha richiesto riduzione del movimento.
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => setStage((s) => (s + 1) % STAGES.length), 5000);
    return () => window.clearInterval(t);
  }, [reduced]);

  const current = STAGES[stage];

  return (
    <div className="approach">
      <ol className="approach__steps" aria-label="Fasi del progetto">
        {STAGES.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className="approach__step"
              aria-current={i === stage ? 'step' : undefined}
              onClick={() => setStage(i)}
            >
              <span className="approach__num">0{i + 1}</span>
              <span>{s.label}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="approach__panel" key={current.id} aria-live="polite">
        <p className="eyebrow">{current.label}</p>
        <h3>{current.title}</h3>
        <p>{current.copy}</p>
      </div>
    </div>
  );
}
