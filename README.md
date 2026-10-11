# SIMULIMPRESA — sito

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # produzione in dist/
npm test         # test unitari
```

Vedi [CLAUDE.md](CLAUDE.md) per architettura, convenzioni, limitazioni e configurazione.

Per collegare il modulo contatti, copia `.env.example` in `.env.local` e imposta `VITE_CONTACT_ENDPOINT` con l'URL pubblico del backend.
