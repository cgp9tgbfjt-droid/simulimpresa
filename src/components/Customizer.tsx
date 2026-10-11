import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { PRODUCTS, COLLECTIONS } from '../data/products';
import { visibleProducts } from '../data/catalog';
import { ProductVisual } from './ProductVisual';
import { QUANTITY_MAX, QUANTITY_MIN, validateLogoFile, validateQuantity, NOTES_MAX } from '../lib/validation';

export interface InquiryDraft {
  productId: string;
  quantity: number;
  notes: string;
  hasLogo: boolean;
}

interface Props {
  productId: string | null;
  onProductChange: (id: string) => void;
  onPrepareInquiry: (draft: InquiryDraft) => void;
}

// Colori indicativi solo per l'anteprima: non indicano colori disponibili in produzione.
const PREVIEW_COLORS = [
  { id: 'soft', label: 'Bianco caldo', value: '#F5F5F7' },
  { id: 'graphite', label: 'Grafite', value: '#17191E' },
  { id: 'forest', label: 'Verde bosco', value: '#2F4A3A' },
  { id: 'wood', label: 'Legno naturale', value: '#B08256' },
  { id: 'blue', label: 'Blu elettrico', value: '#8AB4FF' },
] as const;

export function Customizer({ productId, onProductChange, onPrepareInquiry }: Props) {
  const products = useMemo(() => visibleProducts(), []);
  const product = PRODUCTS.find((p) => p.id === productId) ?? products[0];

  const [color, setColor] = useState<string>(PREVIEW_COLORS[0].id);
  const [quantity, setQuantity] = useState('100');
  const [notes, setNotes] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [scale, setScale] = useState(40);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [notesError, setNotesError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Libera l'URL oggetto alla sostituzione o allo smontaggio.
  useEffect(() => () => { if (logoUrl) URL.revokeObjectURL(logoUrl); }, [logoUrl]);

  const onFile = (file: File | undefined) => {
    const err = validateLogoFile(file ?? null);
    if (err || !file) {
      setLogoError(err);
      return;
    }
    setLogoError(null);
    setLogoName(file.name);
    setLogoUrl(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setLogoUrl(null);
    setLogoName(null);
    setLogoError(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const reset = () => {
    removeLogo();
    setColor(PREVIEW_COLORS[0].id);
    setQuantity('100');
    setNotes('');
    setPos({ x: 50, y: 50 });
    setScale(40);
    setQuantityError(null);
    setNotesError(null);
  };

  const submitDraft = () => {
    const qErr = validateQuantity(quantity);
    const nErr = notes.length > NOTES_MAX ? `Le note non possono superare ${NOTES_MAX} caratteri.` : null;
    setQuantityError(qErr);
    setNotesError(nErr);
    if (qErr || nErr || !product) return;
    onPrepareInquiry({ productId: product.id, quantity: Number(quantity), notes: notes.trim(), hasLogo: !!logoUrl });
  };

  const collectionLabel = COLLECTIONS.find((c) => c.id === product?.collection)?.label;
  const colorLabel = PREVIEW_COLORS.find((c) => c.id === color)?.label;
  const previewColor = PREVIEW_COLORS.find((c) => c.id === color)?.value ?? '#F5F5F7';

  return (
    <div className="customizer">
      <div className="customizer__controls">
        <div className="field">
          <label htmlFor="cz-product">Prodotto</label>
          <select id="cz-product" value={product?.id} onChange={(e) => onProductChange(e.target.value)}>
            {COLLECTIONS.map((c) => (
              <optgroup key={c.id} label={c.label}>
                {products.filter((p) => p.collection === c.id).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <fieldset className="customizer__fieldset">
          <legend>Colore di anteprima</legend>
          <p className="hint">Colori indicativi: la disponibilità si conferma in preventivo.</p>
          <div className="customizer__swatches">
            {PREVIEW_COLORS.map((c) => (
              <label key={c.id} className={`swatch ${color === c.id ? 'is-selected' : ''}`}>
                <input
                  type="radio"
                  name="cz-color"
                  value={c.id}
                  checked={color === c.id}
                  onChange={() => setColor(c.id)}
                />
                <span className="swatch__dot" style={{ background: c.value }} aria-hidden="true" />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field" aria-invalid={!!logoError}>
          <label htmlFor="cz-logo">Logo (facoltativo)</label>
          <input
            id="cz-logo"
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => onFile(e.target.files?.[0])}
            aria-describedby="cz-logo-hint cz-logo-error"
          />
          <span id="cz-logo-hint" className="hint">PNG, JPG o WebP, massimo 5 MB. Il file resta nel browser: serve solo per l’anteprima.</span>
          {logoError && <span id="cz-logo-error" className="error" role="alert">{logoError}</span>}
          {logoUrl && (
            <button type="button" className="btn btn-ghost btn-small" onClick={removeLogo}>
              Rimuovi logo
            </button>
          )}
        </div>

        {logoUrl && (
          <fieldset className="customizer__fieldset">
            <legend>Posizione e dimensione del logo</legend>
            <div className="field">
              <label htmlFor="cz-x">Orizzontale: {pos.x}%</label>
              <input id="cz-x" type="range" min={0} max={100} value={pos.x} onChange={(e) => setPos({ ...pos, x: Number(e.target.value) })} />
            </div>
            <div className="field">
              <label htmlFor="cz-y">Verticale: {pos.y}%</label>
              <input id="cz-y" type="range" min={0} max={100} value={pos.y} onChange={(e) => setPos({ ...pos, y: Number(e.target.value) })} />
            </div>
            <div className="field">
              <label htmlFor="cz-scale">Dimensione: {scale}%</label>
              <input id="cz-scale" type="range" min={10} max={80} value={scale} onChange={(e) => setScale(Number(e.target.value))} />
            </div>
          </fieldset>
        )}

        <div className="field" aria-invalid={!!quantityError}>
          <label htmlFor="cz-qty">Quantità indicativa</label>
          <input
            id="cz-qty"
            type="number"
            inputMode="numeric"
            min={QUANTITY_MIN}
            max={QUANTITY_MAX}
            step={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            aria-describedby="cz-qty-error"
          />
          {quantityError && <span id="cz-qty-error" className="error" role="alert">{quantityError}</span>}
        </div>

        <div className="field" aria-invalid={!!notesError}>
          <label htmlFor="cz-notes">Note sul progetto</label>
          <textarea
            id="cz-notes"
            value={notes}
            maxLength={NOTES_MAX + 50}
            onChange={(e) => setNotes(e.target.value)}
            aria-describedby="cz-notes-hint cz-notes-error"
          />
          <span id="cz-notes-hint" className="hint">{notes.length}/{NOTES_MAX} caratteri</span>
          {notesError && <span id="cz-notes-error" className="error" role="alert">{notesError}</span>}
        </div>

        <div className="customizer__actions">
          <button type="button" className="btn btn-primary" onClick={submitDraft}>Prepara la richiesta</button>
          <button type="button" className="btn btn-ghost" onClick={reset}>Ripristina</button>
        </div>
      </div>

      <div className="customizer__preview">
        <div className="customizer__stage" style={{ '--preview': previewColor } as CSSProperties}>
          <ProductVisual collection={product?.collection ?? 'welcome'} className="customizer__visual" />
          {logoUrl && (
            <img
              className="customizer__logo"
              src={logoUrl}
              alt="Anteprima del logo caricato"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: `${scale}%` }}
            />
          )}
        </div>
        <p className="customizer__disclaimer">
          Anteprima indicativa, non una prova di produzione. Proporzioni, colori e posizionamento definitivi si confermano in preventivo.
        </p>
        <dl className="customizer__summary" aria-label="Riepilogo">
          <div><dt>Prodotto</dt><dd>{product?.name}</dd></div>
          <div><dt>Collezione</dt><dd>{collectionLabel}</dd></div>
          <div><dt>Colore anteprima</dt><dd>{colorLabel}</dd></div>
          <div><dt>Logo</dt><dd>{logoName ?? 'Non caricato'}</dd></div>
          <div><dt>Quantità indicativa</dt><dd>{quantity || '—'}</dd></div>
        </dl>
      </div>
    </div>
  );
}
