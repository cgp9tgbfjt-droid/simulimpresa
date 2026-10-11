import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { COLLECTIONS, PRODUCTS } from '../data/products';
import { validateContact, validateLogoFile, NOTES_MAX, type ContactInput, type Errors } from '../lib/validation';
import { submitContact } from '../lib/contact';
import type { InquiryDraft } from './Customizer';

interface Props {
  draft: InquiryDraft | null;
}

const EMPTY: ContactInput = { name: '', company: '', email: '', collection: '', quantity: '', description: '' };

export function Contact({ draft }: Props) {
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<Errors<keyof ContactInput>>({});
  const [logoName, setLogoName] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ kind: 'idle' | 'sending' | 'sent' | 'not-configured' | 'error'; message?: string }>({ kind: 'idle' });
  const [privacy, setPrivacy] = useState(false);
  const [privacyError, setPrivacyError] = useState<string | null>(null);

  // Riceve la bozza dal configuratore: precompila collezione, quantità e descrizione.
  useEffect(() => {
    if (!draft) return;
    const product = PRODUCTS.find((p) => p.id === draft.productId);
    const intro = product ? `Interesse per: ${product.name}.` : '';
    const notes = draft.notes ? ` ${draft.notes}` : '';
    setValues((v) => ({
      ...v,
      collection: product?.collection ?? v.collection,
      quantity: String(draft.quantity),
      description: `${intro}${notes}`.trim() || v.description,
    }));
  }, [draft]);

  const set = (k: keyof ContactInput) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [k]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateContact(values);
    if (!privacy) setPrivacyError('Per inviare la richiesta devi accettare l’informativa privacy.');
    else setPrivacyError(null);
    setErrors(found);
    if (Object.keys(found).length > 0 || !privacy) {
      const first = document.querySelector<HTMLElement>('[aria-invalid="true"] input, [aria-invalid="true"] select, [aria-invalid="true"] textarea');
      first?.focus();
      setStatus({ kind: 'idle' });
      return;
    }
    setStatus({ kind: 'sending' });
    const result = await submitContact(values, logoName ?? undefined);
    if (result.status === 'sent') {
      setStatus({ kind: 'sent', message: 'Richiesta inviata. Ti risponderemo all’indirizzo indicato.' });
      setValues(EMPTY);
      setLogoName(null);
    } else if (result.status === 'not-configured') {
      setStatus({
        kind: 'not-configured',
        message: 'Il modulo non è ancora collegato a un servizio di invio. La richiesta NON è stata inviata: contattaci all’indirizzo che il sito pubblicherà al momento del collegamento.',
      });
    } else {
      setStatus({ kind: 'error', message: result.message });
    }
  };

  const onLogo = (file: File | undefined) => {
    const err = validateLogoFile(file ?? null);
    setLogoError(err);
    setLogoName(err || !file ? null : file.name);
  };

  return (
    <form className="contact" onSubmit={onSubmit} noValidate aria-describedby="contact-status">
      <div className="contact__grid">
        <Field id="ct-name" label="Nome e cognome" value={values.name} onChange={set('name')} error={errors.name} autoComplete="name" />
        <Field id="ct-company" label="Azienda" value={values.company} onChange={set('company')} error={errors.company} autoComplete="organization" />
        <Field id="ct-email" label="Email" type="email" value={values.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <div className="field" aria-invalid={!!errors.collection}>
          <label htmlFor="ct-collection">Collezione di interesse</label>
          <select id="ct-collection" value={values.collection} onChange={set('collection')} aria-describedby={errors.collection ? 'ct-collection-error' : undefined}>
            <option value="">Seleziona…</option>
            {COLLECTIONS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          {errors.collection && <span id="ct-collection-error" className="error" role="alert">{errors.collection}</span>}
        </div>
        <Field id="ct-qty" label="Quantità indicativa" type="number" value={values.quantity} onChange={set('quantity')} error={errors.quantity} inputMode="numeric" />
        <div className="field" aria-invalid={!!logoError}>
          <label htmlFor="ct-logo">Logo (facoltativo)</label>
          <input id="ct-logo" type="file" accept="image/png,image/jpeg,image/webp" aria-describedby="ct-logo-hint" onChange={(e) => onLogo(e.target.files?.[0])} />
          <span id="ct-logo-hint" className="hint">PNG, JPG o WebP, massimo 5 MB.</span>
          {logoError && <span className="error" role="alert">{logoError}</span>}
        </div>
      </div>
      <div className="field" aria-invalid={!!errors.description}>
        <label htmlFor="ct-desc">Descrizione del progetto</label>
        <textarea id="ct-desc" value={values.description} onChange={set('description')} maxLength={NOTES_MAX + 100} aria-describedby="ct-desc-error" />
        {errors.description && <span id="ct-desc-error" className="error" role="alert">{errors.description}</span>}
      </div>

      <div className="field">
        <label className="check">
          <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} aria-describedby="ct-privacy-hint" />
          <span>Ho letto l’informativa privacy e accetto che i dati siano usati per rispondere alla richiesta.</span>
        </label>
        <span id="ct-privacy-hint" className="hint">I dati saranno usati solo per rispondere alla tua richiesta e non per marketing senza consenso.</span>
        {privacyError && <span className="error" role="alert">{privacyError}</span>}
      </div>

      <div className="contact__actions">
        <button type="submit" className="btn btn-primary" disabled={status.kind === 'sending'}>
          {status.kind === 'sending' ? 'Invio in corso…' : 'Hai un’idea? Realizziamola insieme.'}
        </button>
      </div>
      <p id="contact-status" role="status" className={`contact__status contact__status--${status.kind}`}>
        {status.message}
      </p>
    </form>
  );
}

function Field({ id, label, value, onChange, error, type = 'text', autoComplete, inputMode }: {
  id: string; label: string; value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string; type?: string; autoComplete?: string; inputMode?: 'numeric';
}) {
  return (
    <div className="field" aria-invalid={!!error}>
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} value={value} onChange={onChange} autoComplete={autoComplete} inputMode={inputMode}
        aria-describedby={error ? `${id}-error` : undefined} />
      {error && <span id={`${id}-error`} className="error" role="alert">{error}</span>}
    </div>
  );
}
