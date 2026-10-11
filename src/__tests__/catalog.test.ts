import { describe, expect, it } from 'vitest';
import { PRODUCTS, COLLECTIONS, PRODUCT_COUNT } from '../data/products';
import { EMPTY_FILTER, declaredMaterials, filterProducts, visibleProducts } from '../data/catalog';

// Elenco obbligatorio dal brief: ogni prodotto deve essere presente nel catalogo.
const REQUIRED_NAMES = [
  'T-shirt aziendali personalizzate', 'Abbigliamento aziendale personalizzato',
  'Abbigliamento sportivo tecnico personalizzato', 'Borracce termiche', 'Lanyard personalizzati',
  'Block notes coordinati', 'Scatole di presentazione premium', 'Kit di benvenuto per dipendenti',
  'Kit di benvenuto per clienti',
  'Hub di ricarica wireless', 'Tappetino mouse ergonomico', 'Agende rilegate',
  'Agende con dettagli metallici incisi al laser', 'Accessori da ufficio coordinati',
  'Zaini tecnici impermeabili', 'Cappellini ricamati', 'Asciugamani in microfibra compatti',
  'Accessori promozionali per sport e palestre', 'Accessori promozionali per centri benessere',
  'Targhe da scrivania in plexiglass', 'Targhe da scrivania in legno', 'Segnaletica con logo in rilievo',
  'Espositori per reception', 'Espositori per punti vendita', 'Segnaletica premium da tavolo',
  'Portachiavi in metallo', 'Portachiavi in legno', 'Portachiavi in pelle', 'Portachiavi in gomma',
  'Merchandising promozionale personalizzato', 'Gadget per eventi aziendali', 'Accessori promozionali per fiere',
];

describe('catalogo prodotti', () => {
  it('contiene tutti i prodotti richiesti dal brief', () => {
    const names = new Set(PRODUCTS.map((p) => p.name));
    const missing = REQUIRED_NAMES.filter((n) => !names.has(n));
    expect(missing).toEqual([]);
    expect(PRODUCT_COUNT).toBe(PRODUCTS.length);
  });

  it('ha id unici e collezioni valide', () => {
    const ids = PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    const collectionIds = new Set(COLLECTIONS.map((c) => c.id));
    PRODUCTS.forEach((p) => expect(collectionIds.has(p.collection)).toBe(true));
  });

  it('ogni collezione ha almeno un prodotto visibile', () => {
    COLLECTIONS.forEach((c) => {
      expect(visibleProducts().some((p) => p.collection === c.id)).toBe(true);
    });
  });

  it('i portachiavi sono presenti come collezione dedicata e non nascosta', () => {
    const keychains = visibleProducts().filter((p) => p.collection === 'keychains');
    expect(keychains.length).toBeGreaterThan(0);
    expect(declaredMaterials()).toEqual(expect.arrayContaining(['Metallo', 'Legno', 'Pelle', 'Gomma']));
  });

  it('filtra per testo senza distinzione di maiuscole e accenti', () => {
    const r = filterProducts({ ...EMPTY_FILTER, query: 'BORRACCIA' });
    expect(r.map((p) => p.id)).toContain('borracce-termiche');
    const accent = filterProducts({ ...EMPTY_FILTER, query: 'benessere' });
    expect(accent.length).toBeGreaterThan(0);
  });

  it('combina filtro collezione e ricerca', () => {
    const r = filterProducts({ ...EMPTY_FILTER, collection: 'tech', query: 'agenda' });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.collection === 'tech')).toBe(true);
  });

  it('filtra per materiale dichiarato', () => {
    const r = filterProducts({ ...EMPTY_FILTER, material: 'Legno' });
    expect(r.every((p) => p.materials.some((m) => m.includes('Legno')))).toBe(true);
    expect(r.length).toBeGreaterThan(0);
  });

  it('nessun risultato quando la ricerca non corrisponde', () => {
    expect(filterProducts({ ...EMPTY_FILTER, query: 'zzzz-inesistente' })).toEqual([]);
  });

  it('esclude i prodotti non visibili', () => {
    const list = [{ ...PRODUCTS[0], visible: false }];
    expect(visibleProducts(list)).toEqual([]);
  });
});
