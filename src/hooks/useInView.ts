import { useEffect, useRef, useState } from 'react';

/** Segnala quando un elemento entra nel viewport (una sola volta). Sempre visibile senza IntersectionObserver. */
export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(
    typeof IntersectionObserver === 'undefined',
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold]);

  return { ref, inView };
}
