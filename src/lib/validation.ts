export const MAX_LOGO_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;
// SVG escluso di proposito: può contenere script. Nessun file viene inviato in questa versione.

export const QUANTITY_MIN = 1;
export const QUANTITY_MAX = 10000;
export const NOTES_MAX = 600;

export type Errors<T extends string> = Partial<Record<T, string>>;

export function validateLogoFile(file: File | null | undefined): string | null {
  if (!file) return null;
  if (!(ALLOWED_LOGO_TYPES as readonly string[]).includes(file.type)) {
    return 'Formato non supportato. Carica un file PNG, JPG o WebP.';
  }
  if (file.size > MAX_LOGO_BYTES) {
    return 'Il file supera 5 MB. Riduci la dimensione e riprova.';
  }
  if (file.size === 0) return 'Il file selezionato è vuoto.';
  return null;
}

export function validateQuantity(raw: string): string | null {
  if (raw.trim() === '') return 'Inserisci una quantità indicativa.';
  const n = Number(raw);
  if (!Number.isInteger(n)) return 'La quantità deve essere un numero intero.';
  if (n < QUANTITY_MIN || n > QUANTITY_MAX) {
    return `La quantità deve essere compresa tra ${QUANTITY_MIN} e ${QUANTITY_MAX}.`;
  }
  return null;
}

// Regex volutamente semplice: verifica il formato, non l'esistenza della casella.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface ContactInput {
  name: string;
  company: string;
  email: string;
  collection: string;
  quantity: string;
  description: string;
}

export function validateContact(input: ContactInput): Errors<keyof ContactInput> {
  const errors: Errors<keyof ContactInput> = {};
  if (input.name.trim().length < 2) errors.name = 'Inserisci il nome e cognome (almeno 2 caratteri).';
  if (input.company.trim().length < 2) errors.company = 'Inserisci il nome dell’azienda o dell’organizzazione.';
  if (!EMAIL_RE.test(input.email.trim())) errors.email = 'Inserisci un indirizzo email valido.';
  if (!input.collection) errors.collection = 'Seleziona una collezione di interesse.';
  const qErr = validateQuantity(input.quantity);
  if (qErr) errors.quantity = qErr;
  if (input.description.trim().length < 10) errors.description = 'Descrivi il progetto in almeno 10 caratteri.';
  if (input.description.length > NOTES_MAX) errors.description = `La descrizione non può superare ${NOTES_MAX} caratteri.`;
  return errors;
}
