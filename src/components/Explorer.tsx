import { useMemo, useState } from 'react';
import { COLLECTIONS, PRODUCTS, type CollectionId, type Product } from '../data/products';
import { EMPTY_FILTER, declaredMaterials, filterProducts, type CatalogFilter } from '../data/catalog';
import { ProductVisual } from './ProductVisual';

type Tab = CollectionId | 'all';

interface Props {
  onCustomize: (productId: string) => void;
}

export function Explorer({ onCustomize }: Props) {
  const [tab, setTab] = useState<Tab>('welcome');
  const [filter, setFilter] = useState<CatalogFilter>({ ...EMPTY_FILTER });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const materials = useMemo(() => declaredMaterials(), []);
  const collection = COLLECTIONS.find((c) => c.id === tab);

  const results = useMemo(
    () => filterProducts({ ...filter, collection: tab }),
    [filter, tab],
  );

  const selected: Product | undefined =
    PRODUCTS.find((p) => p.id === selectedId) ?? results[0];

  const hasActiveFilter = filter.query !== '' || filter.material !== 'all';
  const clear = () => setFilter({ ...EMPTY_FILTER });

  return (
    <div className="explorer">
      <div className="explorer__tabs" role="group" aria-label="Filtra per collezione">
        <button
          type="button"
          className="explorer__tab"
          aria-pressed={tab === 'all'}
          onClick={() => setTab('all')}
        >
          Tutti i prodotti
        </button>
        {COLLECTIONS.map((c) => (
          <button
            key={c.id}
            type="button"
            className="explorer__tab"
            aria-pressed={tab === c.id}
            onClick={() => { setTab(c.id); setSelectedId(null); }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div key={tab} className="explorer__scene" aria-live="polite">
        {collection ? (
          <div className="explorer__intro">
            <p className="eyebrow">{collection.primary ? 'Collezione principale' : 'Collezione aggiuntiva'}</p>
            <h3 className="explorer__title">{collection.title}</h3>
            <p>{collection.description}</p>
          </div>
        ) : (
          <div className="explorer__intro">
            <p className="eyebrow">Catalogo completo</p>
            <h3 className="explorer__title">Tutti i prodotti SIMULIMPRESA</h3>
            <p>Quattro collezioni principali e una linea dedicata a portachiavi e merchandising promozionale.</p>
          </div>
        )}
        <ProductVisual collection={collection?.id ?? 'keychains'} className="explorer__visual" />
      </div>

      <form className="explorer__filters" role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor="catalog-search">Cerca per nome o parola chiave</label>
          <input
            id="catalog-search"
            type="search"
            value={filter.query}
            placeholder="Es. borraccia, legno, ufficio"
            onChange={(e) => setFilter({ ...filter, query: e.target.value })}
            autoComplete="off"
          />
        </div>
        <div className="field">
          <label htmlFor="catalog-material">Materiale dichiarato</label>
          <select
            id="catalog-material"
            value={filter.material}
            onChange={(e) => setFilter({ ...filter, material: e.target.value })}
          >
            <option value="all">Tutti</option>
            <option value="declared">Solo con materiale dichiarato</option>
            {materials.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <button type="button" className="btn btn-ghost" onClick={clear} disabled={!hasActiveFilter}>
          Azzera filtri
        </button>
      </form>

      <p className="explorer__count" role="status">
        {results.length === 0
          ? 'Nessun prodotto corrisponde ai filtri.'
          : `${results.length} ${results.length === 1 ? 'prodotto' : 'prodotti'}`}
      </p>

      <div className="explorer__body">
        <ul className="explorer__list" aria-label="Prodotti">
          {results.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="explorer__item"
                aria-pressed={selected?.id === p.id}
                onClick={() => setSelectedId(p.id)}
              >
                <span className="explorer__item-name">{p.name}</span>
                <span className="explorer__item-meta">
                  {COLLECTIONS.find((c) => c.id === p.collection)?.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {selected && (
          <article className="explorer__detail" aria-labelledby="detail-title">
            <ProductVisual collection={selected.collection} className="explorer__detail-visual" />
            <h4 id="detail-title">{selected.name}</h4>
            <p>{selected.description}</p>
            {selected.materials.length > 0 && (
              <p className="explorer__materials">
                <strong>Materiale dichiarato:</strong> {selected.materials.join(', ')}
              </p>
            )}
            <div className="explorer__tags">
              {selected.tags.map((t) => <span key={t} className="pill">{t}</span>)}
            </div>
            <p className="explorer__custom">
              <strong>Personalizzazione:</strong> {selected.customization.join(' · ')}
            </p>
            <p className="hint muted">Dettagli e disponibilità si confermano in fase di preventivo.</p>
            <button type="button" className="btn btn-primary" onClick={() => onCustomize(selected.id)}>
              Personalizza questo prodotto
            </button>
          </article>
        )}
      </div>
    </div>
  );
}
