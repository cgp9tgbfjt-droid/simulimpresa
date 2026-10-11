import { lazy, Suspense, useState } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Explorer } from './components/Explorer';
import { Approach } from './components/Approach';
import { Contact } from './components/Contact';
import { Scenes } from './components/Scenes';
import { ProductVisual } from './components/ProductVisual';
import { COLLECTIONS, PRODUCT_COUNT } from './data/products';
import type { InquiryDraft } from './components/Customizer';
import { ErrorBoundary } from './components/ErrorBoundary';

// Il configuratore è caricato in modo differito per ridurre il bundle iniziale.
const Customizer = lazy(() => import('./components/Customizer').then((m) => ({ default: m.Customizer })));

export default function App() {
  const [productId, setProductId] = useState<string | null>(null);
  const [draft, setDraft] = useState<InquiryDraft | null>(null);

  const goToCustomizer = (id: string) => {
    setProductId(id);
    document.getElementById('personalizzazione')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const onPrepareInquiry = (d: InquiryDraft) => {
    setDraft(d);
    document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <a className="skip-link" href="#main">Vai al contenuto</a>
      <Nav />
      <main id="main">
        <Hero />

        <section id="collezioni" className="section" aria-labelledby="collezioni-title">
          <div className="container">
            <p className="eyebrow">Collezioni</p>
            <h2 id="collezioni-title">Quattro mondi.<br />Un’unica identità.</h2>
            <p className="section__lead">
              Welcome kit, tech e ufficio, outdoor, espositori e segnaletica. Ogni collezione è accompagnata da
              portachiavi e merchandising promozionale, sempre visibili nel catalogo.
            </p>
            <p className="muted small">Catalogo di {PRODUCT_COUNT} prodotti. Dettagli e disponibilità si confermano in preventivo.</p>
            <div className="collection-grid">
              {COLLECTIONS.map((c) => (
                <a key={c.id} className="collection-tile" href="#explorer">
                  <ProductVisual collection={c.id} className="collection-tile__visual" />
                  <span className="collection-tile__label">{c.label}</span>
                </a>
              ))}
            </div>
            <div id="explorer" className="explorer-wrap">
              <Explorer onCustomize={goToCustomizer} />
            </div>
          </div>
        </section>

        <section id="scene" className="section section--cinematic" aria-labelledby="scene-title">
          <div className="container">
            <p className="eyebrow">Storie di prodotto</p>
            <h2 id="scene-title" className="sr-only">Cinque storie di prodotto</h2>
            <Scenes />
          </div>
        </section>

        <section id="personalizzazione" className="section" aria-labelledby="cz-title">
          <div className="container">
            <p className="eyebrow">Personalizzazione</p>
            <h2 id="cz-title">Progettiamo insieme.</h2>
            <p className="section__lead">
              Scegli un prodotto, prova un’anteprima del logo e prepara la richiesta. L’anteprima è indicativa:
              non è una prova di produzione.
            </p>
            <ErrorBoundary fallback={<p className="error">Il configuratore non è disponibile. Usa il modulo contatti qui sotto.</p>}>
              <Suspense fallback={<p className="muted">Caricamento configuratore…</p>}>
                <Customizer productId={productId} onProductChange={setProductId} onPrepareInquiry={onPrepareInquiry} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </section>

        <section id="approccio" className="section" aria-labelledby="approccio-title">
          <div className="container">
            <p className="eyebrow">Il nostro approccio</p>
            <h2 id="approccio-title">Dall’idea al prodotto.</h2>
            <Approach />
          </div>
        </section>

        <section id="finale" className="section section--final" aria-labelledby="finale-title">
          <div className="container final">
            <h2 id="finale-title">Quattro mondi.<br />Un’unica identità.</h2>
            <p className="section__lead">
              Dal welcome kit agli accessori tech, dallo sport alla segnaletica, fino ai piccoli dettagli del
              merchandising: diamo forma alle tue idee.
            </p>
            <a className="btn btn-primary" href="#contatti">Hai un’idea? Realizziamola insieme.</a>
          </div>
        </section>

        <section id="contatti" className="section" aria-labelledby="contatti-title">
          <div className="container">
            <p className="eyebrow">Contatti</p>
            <h2 id="contatti-title">Hai un’idea?<br />Realizziamola insieme.</h2>
            <p className="section__lead">
              Compila il modulo: ti risponderemo per discutere il progetto. Nessun prezzo o tempo di consegna è
              indicato in questa pagina.
            </p>
            <Contact draft={draft} />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <span>SIMULIMPRESA</span>
          <nav aria-label="Link del piè di pagina">
            <a href="#collezioni">Collezioni</a>
            <a href="#personalizzazione">Personalizzazione</a>
            <a href="#contatti">Contatti</a>
          </nav>
          <span className="muted">Informazioni aziendali e privacy da completare prima della pubblicazione.</span>
        </div>
      </footer>
    </>
  );
}
