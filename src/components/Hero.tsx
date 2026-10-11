import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ProductVisual } from './ProductVisual';

const HEADLINE_LINES = ['Il tuo brand', 'prende forma.'];

export function Hero() {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Il contenuto è sempre leggibile: l'intro parte dopo il primo paint e non blocca nulla.
    const t = window.setTimeout(() => setReady(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  // Parallasse legato al puntatore, con requestAnimationFrame e pulizia dei listener.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced || window.matchMedia('(pointer: coarse)').matches) return;
    let frame = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      stage.style.setProperty('--px', cx.toFixed(4));
      stage.style.setProperty('--py', cy.toFixed(4));
      frame = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, [reduced]);

  return (
    <section id="home" className={`hero ${ready || reduced ? 'is-ready' : ''}`} aria-labelledby="hero-title">
      <div className="hero__beam" aria-hidden="true" />
      <div className="hero__stage" ref={stageRef} aria-hidden="true">
        <div className="hero__layer hero__layer--back"><ProductVisual collection="signage" /></div>
        <div className="hero__layer hero__layer--mid"><ProductVisual collection="welcome" /></div>
        <div className="hero__layer hero__layer--front"><ProductVisual collection="tech" /></div>
      </div>
      <div className="container hero__content">
        <p className="eyebrow hero__eyebrow">SIMULIMPRESA — Personalizzazione aziendale</p>
        <h1 id="hero-title" className="hero__title">
          {HEADLINE_LINES.map((line) => (
            <span className="mask-line" key={line}><span>{line}</span></span>
          ))}
        </h1>
        <p className="hero__lead">Oggetti personalizzati. Identità riconoscibili. Esperienze memorabili.</p>
        <p className="hero__support">Trasformiamo le idee in prodotti personalizzati che raccontano chi sei.</p>
        <div className="hero__ctas">
          <a className="btn btn-primary" href="#collezioni">Scopri le collezioni</a>
          <a className="btn btn-ghost" href="#personalizzazione">Progettiamo insieme</a>
        </div>
      </div>
    </section>
  );
}
