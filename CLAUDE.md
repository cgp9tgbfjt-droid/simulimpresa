# SIMULIMPRESA — guida per lo sviluppo

Sito vetrina cinematografico e configuratore per SIMULIMPRESA (merchandising aziendale personalizzato).
Tutti i testi visibili sono in italiano.

## Deploy
- Hosting: GitHub Pages, pubblicato dal workflow `.github/workflows/deploy-pages.yml` a ogni push su `main`.
- Il build imposta `BASE_PATH=/<nome-repo>/` (variabile letta da `vite.config.ts`). In locale resta `/`.
- Il workflow esegue test e build prima del deploy.
- Modulo contatti: impostare la variabile del repository `VITE_CONTACT_ENDPOINT` (Settings → Secrets and variables → Actions → Variables) con l'URL del backend. Se assente, il modulo dichiara che la richiesta non è stata inviata.

## Comandi
- `npm install` — dipendenze
- `npm run dev` — server di sviluppo (http://localhost:5173)
- `npm run build` — type check (`tsc -b`) + build di produzione in `dist/`
- `npm run typecheck` — solo type check
- `npm test` — test unitari (Vitest, catalogo e validazioni)

## Architettura
- `src/data/products.ts` — **unica fonte** di collezioni e prodotti (modello dati). Aggiungere, modificare o nascondere (`visible: false`) un prodotto qui, senza toccare i componenti.
- `src/data/catalog.ts` — logica pura di ricerca, filtro e ordinamento (testata in `src/__tests__`).
- `src/lib/validation.ts` — validazione di logo (tipo, dimensione), quantità e modulo contatti.
- `src/lib/contact.ts` — invio del modulo tramite `VITE_CONTACT_ENDPOINT`. Non simula mai un invio riuscito.
- `src/components/` — presentazione: Nav, Hero, Explorer, Scenes, Customizer, Approach, Contact, ProductVisual, ErrorBoundary.
- `src/styles/tokens.css` — design token (colori, tipografia, spaziatura, ombre, durate, easing, larghezze, z-index). Usare sempre i token, non valori letterali.
- `src/styles/global.css`, `src/styles/components.css` — stili globali e di componente.

## Convenzioni di design
- Palette: Obsidian `#08090B`, Graphite `#17191E`, Soft White `#F5F5F7`, Metallic Silver `#C5CAD2`, Electric Blue `#8AB4FF`, Muted Grey `#9298A3`. Legno e verde bosco/pietra solo come accenti scenici.
- Niente gradienti generici, niente glassmorphism eccessivo, niente card ripetitive.

## Regole di animazione
- L'intro dell'hero (circa 5 s) non blocca la navigazione: il contenuto è leggibile da subito.
- Le animazioni di reveal usano `IntersectionObserver` e si attivano una sola volta.
- Il parallasse dell'hero usa `requestAnimationFrame` e solo su dispositivi con puntatore fine.
- `prefers-reduced-motion` disattiva animazioni e rotazioni automatiche (vedi `global.css` e `useReducedMotion`).
- Nessuna trappola di scroll: nessuna sezione è fissata (pinned).

## Regole di contenuto e sicurezza
- Non inventare prezzi, tempi di consegna, certificazioni, recensioni, clienti, specifiche tecniche o capacità produttive. I materiali compaiono solo se dichiarati (`materials`).
- Le illustrazioni in `ProductVisual` sono **indicative**, non foto di prodotto. Sostituire con immagini reali quando disponibili.
- Il configuratore non carica file: il logo resta nel browser solo per l'anteprima (PNG/JPG/WebP, max 5 MB, SVG escluso).
- Il modulo contatti non dichiara mai "inviato" senza una risposta 2xx del backend.
- Nessun segreto nel frontend. Solo variabili `VITE_*` pubbliche.

## Asset
Non sono presenti in questo progetto foto di prodotto, modelli 3D o font del brand.
Il file `Logo Tradizionale Bianco (PNG).png` presente nella cartella Download appartiene a un altro marchio (Einaudi C'è Web TV) e **non** va usato come logo SIMULIMPRESA.

## Limitazioni note
- Nessuna scena 3D (React Three Fiber): non ci sono modelli GLB. Le scene sono composizioni CSS/SVG.
- Nessun backend: il modulo contatti è pronto ma richiede `VITE_CONTACT_ENDPOINT`.
- Nessun audio ambientale (funzione opzionale non implementata).
- Nessun test end-to-end Playwright: i flussi principali sono stati verificati nel browser durante lo sviluppo.
- Font: stack di sistema con Inter come preferenza; nessun font caricato.
- URL canonico, sitemap e Open Graph puntano a `https://cgp9tgbfjt-droid.github.io/simulimpresa/` (GitHub Pages). Se si cambia dominio, aggiornare `index.html`, `public/robots.txt` e `public/sitemap.xml`.
- Dati aziendali (indirizzo, P.IVA, privacy) da completare prima della pubblicazione.
