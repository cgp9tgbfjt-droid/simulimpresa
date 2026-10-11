import { describe, expect, it } from 'vitest';
import { validateContact, validateLogoFile, validateQuantity, MAX_LOGO_BYTES, NOTES_MAX } from '../lib/validation';

const base = {
  name: 'Mario Rossi', company: 'Acme Srl', email: 'mario@example.com',
  collection: 'welcome', quantity: '100', description: 'Vorremmo un kit di benvenuto.',
};

function file(type: string, size: number) {
  return new File([new Uint8Array(size)], 'logo', { type });
}

describe('validazione logo', () => {
  it('accetta PNG, JPG e WebP entro il limite', () => {
    expect(validateLogoFile(file('image/png', 1000))).toBeNull();
    expect(validateLogoFile(file('image/jpeg', 1000))).toBeNull();
    expect(validateLogoFile(file('image/webp', 1000))).toBeNull();
  });
  it('rifiuta SVG e altri tipi', () => {
    expect(validateLogoFile(file('image/svg+xml', 100))).not.toBeNull();
    expect(validateLogoFile(file('application/pdf', 100))).not.toBeNull();
  });
  it('rifiuta file oltre 5 MB', () => {
    expect(validateLogoFile(file('image/png', MAX_LOGO_BYTES + 1))).not.toBeNull();
  });
  it('rifiuta file vuoti e accetta l’assenza di file', () => {
    expect(validateLogoFile(file('image/png', 0))).not.toBeNull();
    expect(validateLogoFile(null)).toBeNull();
  });
});

describe('validazione quantità', () => {
  it('accetta interi nell’intervallo', () => {
    expect(validateQuantity('1')).toBeNull();
    expect(validateQuantity('10000')).toBeNull();
  });
  it('rifiuta vuoto, decimali, fuori intervallo', () => {
    expect(validateQuantity('')).not.toBeNull();
    expect(validateQuantity('2.5')).not.toBeNull();
    expect(validateQuantity('0')).not.toBeNull();
    expect(validateQuantity('10001')).not.toBeNull();
  });
});

describe('validazione contatti', () => {
  it('accetta una richiesta completa', () => {
    expect(validateContact(base)).toEqual({});
  });
  it('segnala email non valida e campi mancanti', () => {
    const e = validateContact({ ...base, email: 'non-una-email', name: 'a' });
    expect(e.email).toBeDefined();
    expect(e.name).toBeDefined();
  });
  it('richiede collezione e descrizione minima', () => {
    const e = validateContact({ ...base, collection: '', description: 'corta' });
    expect(e.collection).toBeDefined();
    expect(e.description).toBeDefined();
  });
  it('limita la lunghezza della descrizione', () => {
    const e = validateContact({ ...base, description: 'x'.repeat(NOTES_MAX + 1) });
    expect(e.description).toBeDefined();
  });
});
