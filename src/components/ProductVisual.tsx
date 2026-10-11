import type { CollectionId } from '../data/products';

/**
 * Illustrazione indicativa di una collezione. Non è una foto di prodotto:
 * sostituire con immagini reali quando disponibili (vedi README, sezione Asset).
 */
export function ProductVisual({ collection, className = '' }: { collection: CollectionId; className?: string }) {
  return (
    <div className={`visual visual--${collection} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" focusable="false">
        {collection === 'welcome' && (
          <>
            <rect x="30" y="110" width="140" height="62" rx="4" className="fill-wood" />
            <path d="M70 62 L100 40 L130 62 L150 80 L134 96 L122 86 L122 170 L78 170 L78 86 L66 96 L50 80 Z" className="fill-soft" />
            <rect x="92" y="30" width="6" height="28" className="fill-silver" />
          </>
        )}
        {collection === 'tech' && (
          <>
            <rect x="30" y="150" width="140" height="20" rx="10" className="fill-graphite" />
            <rect x="60" y="82" width="80" height="60" rx="18" className="fill-graphite" />
            <circle cx="100" cy="112" r="16" className="stroke-blue" />
          </>
        )}
        {collection === 'outdoor' && (
          <>
            <path d="M62 60 Q100 20 138 60 L146 170 L54 170 Z" className="fill-forest" />
            <path d="M80 60 Q100 44 120 60" className="stroke-soft" />
            <rect x="82" y="110" width="36" height="28" rx="4" className="fill-stone" />
          </>
        )}
        {collection === 'signage' && (
          <>
            <rect x="40" y="60" width="120" height="84" rx="6" className="fill-wood" />
            <rect x="60" y="80" width="80" height="6" className="fill-soft" />
            <rect x="60" y="96" width="50" height="6" className="fill-soft" />
            <rect x="32" y="148" width="136" height="8" rx="3" className="fill-graphite" />
          </>
        )}
        {collection === 'keychains' && (
          <>
            <circle cx="100" cy="60" r="16" className="stroke-silver" />
            <path d="M100 76 L100 110" className="stroke-silver" />
            <rect x="80" y="110" width="40" height="56" rx="10" className="fill-metal" />
          </>
        )}
      </svg>
    </div>
  );
}
