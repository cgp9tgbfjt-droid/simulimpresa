import { useEffect, useState } from 'react';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'collezioni', label: 'Collezioni' },
  { id: 'personalizzazione', label: 'Personalizzazione' },
  { id: 'approccio', label: 'Il nostro approccio' },
  { id: 'contatti', label: 'Contatti' },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Stato attivo in base alla sezione visibile.
  useEffect(() => {
    const sections = NAV_ITEMS.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Chiudi il menu con Esc.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="container nav__inner">
        <a href="#home" className="nav__brand" onClick={close}>SIMULIMPRESA</a>
        <nav aria-label="Navigazione principale" id="site-nav" className="nav__menu">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={close}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={active === item.id ? 'is-active' : ''}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn-primary nav__cta" href="#contatti">Hai un’idea?</a>
        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? 'Chiudi menu' : 'Apri menu'}</span>
          <span aria-hidden="true" className="nav__bars" />
        </button>
      </div>
    </header>
  );
}
