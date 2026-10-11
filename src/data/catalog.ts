import { COLLECTIONS, PRODUCTS, type CollectionId, type Product } from './products';

export interface CatalogFilter {
  query: string;
  collection: CollectionId | 'all';
  /** 'all' = qualsiasi; 'declared' = solo prodotti con materiali dichiarati */
  material: string | 'all' | 'undeclared';
}

export const EMPTY_FILTER: CatalogFilter = { query: '', collection: 'all', material: 'all' };

/** Prodotti visibili, ordinati per collezione e ordine di visualizzazione. */
export function visibleProducts(list: Product[] = PRODUCTS): Product[] {
  const rank = new Map(COLLECTIONS.map((c, i) => [c.id, i]));
  return list
    .filter((p) => p.visible)
    .sort((a, b) => (rank.get(a.collection)! - rank.get(b.collection)!) || a.order - b.order);
}

export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function filterProducts(filter: CatalogFilter, list: Product[] = PRODUCTS): Product[] {
  const q = normalize(filter.query);
  const terms = q ? q.split(/\s+/) : [];
  return visibleProducts(list).filter((p) => {
    if (filter.collection !== 'all' && p.collection !== filter.collection) return false;
    if (filter.material === 'declared' && p.materials.length === 0) return false;
    if (filter.material === 'undeclared' && p.materials.length > 0) return false;
    if (filter.material !== 'all' && filter.material !== 'declared' && filter.material !== 'undeclared') {
      if (!p.materials.some((m) => normalize(m).includes(normalize(filter.material)))) return false;
    }
    if (terms.length) {
      const haystack = normalize([p.name, p.description, ...p.tags, ...p.materials].join(' '));
      if (!terms.every((t) => haystack.includes(t))) return false;
    }
    return true;
  });
}

/** Tutti i materiali dichiarati nel catalogo, senza duplicati. */
export function declaredMaterials(list: Product[] = PRODUCTS): string[] {
  return [...new Set(list.flatMap((p) => p.materials))].sort();
}
