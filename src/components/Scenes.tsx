import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { PRODUCTS, type CollectionId } from '../data/products';
import { ProductVisual } from './ProductVisual';

interface Scene {
  id: string;
  collection: CollectionId;
  eyebrow: string;
  headline: string;
  copy: string;
  /** Prodotti citati nella scena (nomi dal catalogo) */
  items: string[];
}

// Testi delle cinque scene. I nomi dei prodotti provengono dal catalogo.
const SCENES: Scene[] = [
  {
    id: 'scena-welcome',
    collection: 'welcome',
    eyebrow: 'Scena 01 · Welcome Kit',
    headline: 'Un benvenuto che lascia il segno.',
    copy: 'Box, t-shirt, borraccia, lanyard e block notes: un’esperienza coordinata, con la stessa identità visiva in ogni pezzo.',
    items: ['Scatole di presentazione premium', 'T-shirt aziendali personalizzate', 'Borracce termiche', 'Lanyard personalizzati', 'Block notes coordinati'],
  },
  {
    id: 'scena-tech',
    collection: 'tech',
    eyebrow: 'Scena 02 · Tech & Office',
    headline: 'Tecnologia, con stile.',
    copy: 'Hub di ricarica, tappetino ergonomico e agende con dettagli metallici incisi al laser: accessori pratici, con un aspetto curato.',
    items: ['Hub di ricarica wireless', 'Tappetino mouse ergonomico', 'Agende rilegate', 'Agende con dettagli metallici incisi al laser'],
  },
  {
    id: 'scena-outdoor',
    collection: 'outdoor',
    eyebrow: 'Scena 03 · Outdoor & Leisure',
    headline: 'Il tuo brand, in movimento.',
    copy: 'Zaini tecnici impermeabili, cappellini ricamati e asciugamani in microfibra per sport, palestre e centri benessere.',
    items: ['Zaini tecnici impermeabili', 'Cappellini ricamati', 'Asciugamani in microfibra compatti'],
  },
  {
    id: 'scena-signage',
    collection: 'signage',
    eyebrow: 'Scena 04 · Displays & Signage',
    headline: 'Il tuo logo, in primo piano.',
    copy: 'Targhe in plexiglass e in legno, segnaletica con logo in rilievo ed espositori per reception e punti vendita.',
    items: ['Targhe da scrivania in plexiglass', 'Targhe da scrivania in legno', 'Segnaletica con logo in rilievo'],
  },
];

// Materiali dei portachiavi: descrizioni visive e tattili, senza specifiche tecniche inventate.
const KEYCHAIN_MATERIALS = [
  { id: 'metal', label: 'Metallo', name: 'Portachiavi in metallo', look: 'Aspetto solido e riflettente, con una presenza compatta e netta.' },
  { id: 'wood', label: 'Legno', name: 'Portachiavi in legno', look: 'Venature naturali e un tono caldo: ogni pezzo ha un carattere proprio.' },
  { id: 'leather', label: 'Pelle', name: 'Portachiavi in pelle', look: 'Superficie morbida e un tocco elegante, adatto a un’immagine raffinata.' },
  { id: 'rubber', label: 'Gomma', name: 'Portachiavi in gomma', look: 'Superficie uniforme e leggera, pratica per uso quotidiano ed eventi.' },
] as const;

function SceneBlock({ scene, index }: { scene: Scene; index: number }) {
  const { ref, inView } = useInView<HTMLElement>(0.25);
  const reverse = index % 2 === 1;
  return (
    <article
      id={scene.id}
      ref={ref}
      className={`scene scene--${scene.collection} ${reverse ? 'scene--reverse' : ''} fade-up ${inView ? 'is-visible' : ''}`}
      aria-labelledby={`${scene.id}-title`}
    >
      <div className="scene__copy">
        <p className="eyebrow">{scene.eyebrow}</p>
        <h3 id={`${scene.id}-title`} className="scene__headline">{scene.headline}</h3>
        <p>{scene.copy}</p>
        <ul className="scene__items">
          {scene.items.map((i) => <li key={i}>{i}</li>)}
        </ul>
      </div>
      <ProductVisual collection={scene.collection} className="scene__visual" />
    </article>
  );
}

function KeychainScene() {
  const [active, setActive] = useState<(typeof KEYCHAIN_MATERIALS)[number]['id']>('metal');
  const { ref, inView } = useInView<HTMLElement>(0.25);
  const current = KEYCHAIN_MATERIALS.find((m) => m.id === active)!;
  const product = PRODUCTS.find((p) => p.name === current.name);
  return (
    <article
      id="scena-portachiavi"
      ref={ref}
      className={`scene scene--keychains fade-up ${inView ? 'is-visible' : ''}`}
      aria-labelledby="scena-portachiavi-title"
    >
      <div className="scene__copy">
        <p className="eyebrow">Scena 05 · Portachiavi personalizzati</p>
        <h3 id="scena-portachiavi-title" className="scene__headline">Piccoli dettagli. Grande identità.</h3>
        <p>Confronta i quattro materiali disponibili. Le descrizioni sono visive e indicative: le caratteristiche tecniche si verificano in preventivo.</p>
        <div className="materials" role="tablist" aria-label="Materiali dei portachiavi">
          {KEYCHAIN_MATERIALS.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              id={`mat-${m.id}`}
              aria-selected={active === m.id}
              aria-controls="mat-panel"
              tabIndex={active === m.id ? 0 : -1}
              className="materials__tab"
              onClick={() => setActive(m.id)}
              onKeyDown={(e) => {
                const ids = KEYCHAIN_MATERIALS.map((x) => x.id);
                const i = ids.indexOf(active);
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                  e.preventDefault();
                  setActive(ids[(i + 1) % ids.length]);
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  setActive(ids[(i - 1 + ids.length) % ids.length]);
                }
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div id="mat-panel" role="tabpanel" aria-labelledby={`mat-${active}`} className="materials__panel">
          <h4>{current.name}</h4>
          <p>{current.look}</p>
          {product && <p className="muted">Scheda catalogo: {product.tags.join(', ')}.</p>}
        </div>
      </div>
      <ProductVisual collection="keychains" className="scene__visual" />
    </article>
  );
}

export function Scenes() {
  return (
    <div className="scenes">
      {SCENES.map((s, i) => <SceneBlock key={s.id} scene={s} index={i} />)}
      <KeychainScene />
    </div>
  );
}
