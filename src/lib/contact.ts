import type { ContactInput } from './validation';

export type SubmitResult =
  | { status: 'sent' }
  | { status: 'not-configured' }
  | { status: 'error'; message: string };

/**
 * Invia la richiesta solo se un endpoint è configurato via VITE_CONTACT_ENDPOINT
 * (URL pubblico del backend; nessun segreto nel frontend).
 * Senza endpoint NON simula alcun invio: restituisce 'not-configured'.
 * Il successo è riportato solo con conferma HTTP 2xx dal backend.
 */
export async function submitContact(input: ContactInput, logoName?: string): Promise<SubmitResult> {
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;
  if (!endpoint) return { status: 'not-configured' };
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, logoName: logoName ?? null }),
    });
    if (res.ok) return { status: 'sent' };
    return { status: 'error', message: `Il servizio ha risposto con stato ${res.status}.` };
  } catch {
    return { status: 'error', message: 'Connessione non riuscita. Riprova più tardi.' };
  }
}
