// Catalogo prodotti SIMULIMPRESA — dati separati dalla presentazione.
// Non inserire specifiche tecniche, prezzi, tempi di consegna o capacità produttive
// che non siano verificati. Il campo `materials` è valorizzato solo dove il materiale
// è stato dichiarato nel materiale aziendale esistente.

export type CollectionId = 'welcome' | 'tech' | 'outdoor' | 'signage' | 'keychains';

export interface Collection {
  id: CollectionId;
  /** Etichetta breve per navigazione e filtri */
  label: string;
  /** Titolo di categoria mostrato nell'esplorazione */
  title: string;
  description: string;
  /** Colore d'accento della scena (token CSS) */
  accent: 'warm' | 'cool' | 'forest' | 'wood' | 'metal';
  /** Primary = una delle quattro grandi categorie commerciali */
  primary: boolean;
}

export interface Product {
  id: string;
  name: string;
  collection: CollectionId;
  description: string;
  tags: string[];
  /** Materiali verificati; vuoto se non dichiarati */
  materials: string[];
  /** Ordine di visualizzazione nella collezione */
  order: number;
  /** Visibile nel catalogo pubblico */
  visible: boolean;
  /** Opzioni di personalizzazione disponibili (testo generico, nessuna promessa) */
  customization: string[];
}

export const COLLECTIONS: Collection[] = [
  {
    id: 'welcome',
    label: 'Welcome Kits',
    title: 'Welcome kit e abbigliamento aziendale',
    description:
      'Un kit coordinato: box, abbigliamento, borraccia, lanyard e block notes condividono un’unica identità visiva.',
    accent: 'warm',
    primary: true,
  },
  {
    id: 'tech',
    label: 'Tech & Office',
    title: 'Tech e ufficio',
    description:
      'Accessori da scrivania pratici e curati: ricarica, comfort di lavoro e agende con dettagli metallici.',
    accent: 'cool',
    primary: true,
  },
  {
    id: 'outdoor',
    label: 'Outdoor & Leisure',
    title: 'Outdoor e tempo libero',
    description:
      'Prodotti tecnici e lifestyle per sport, palestre, centri benessere ed eventi all’aperto.',
    accent: 'forest',
    primary: true,
  },
  {
    id: 'signage',
    label: 'Displays & Signage',
    title: 'Espositori e segnaletica',
    description:
      'Targhe e display con logo in primo piano: plexiglass, legno e lettering in rilievo per reception e punti vendita.',
    accent: 'wood',
    primary: true,
  },
  {
    id: 'keychains',
    label: 'Portachiavi & Merchandising',
    title: 'Portachiavi e merchandising promozionale',
    description:
      'Piccoli dettagli con grande identità: portachiavi in metallo, legno, pelle e gomma, e gadget per eventi e fiere.',
    accent: 'metal',
    primary: false,
  },
];

const welcomeCustom = ['Logo e testo personalizzati', 'Colori da definire in preventivo'];

export const PRODUCTS: Product[] = [
  // Welcome Kits
  { id: 'tshirt-aziendali', name: 'T-shirt aziendali personalizzate', collection: 'welcome', order: 1, visible: true,
    description: 'T-shirt con il logo e l’identità della tua azienda, pensate per il team.', tags: ['abbigliamento', 'team'], materials: [], customization: welcomeCustom },
  { id: 'abbigliamento-aziendale', name: 'Abbigliamento aziendale personalizzato', collection: 'welcome', order: 2, visible: true,
    description: 'Capi coordinati per uffici, eventi e presenza sul territorio.', tags: ['abbigliamento', 'divisa'], materials: [], customization: welcomeCustom },
  { id: 'sportwear-tecnico', name: 'Abbigliamento sportivo tecnico personalizzato', collection: 'welcome', order: 3, visible: true,
    description: 'Abbigliamento tecnico sportivo con branding personalizzato, per gruppi sportivi e palestre.', tags: ['sport', 'tecnico'], materials: [], customization: welcomeCustom },
  { id: 'borracce-termiche', name: 'Borracce termiche', collection: 'welcome', order: 4, visible: true,
    description: 'Borracce termiche con stampa personalizzata, da inserire nel kit o da usare come gadget.', tags: ['borraccia', 'kit'], materials: [], customization: welcomeCustom },
  { id: 'lanyard', name: 'Lanyard personalizzati', collection: 'welcome', order: 5, visible: true,
    description: 'Cordini identificativi con il tuo brand, per badge, eventi e accrediti.', tags: ['accessorio', 'evento'], materials: [], customization: welcomeCustom },
  { id: 'block-notes', name: 'Block notes coordinati', collection: 'welcome', order: 6, visible: true,
    description: 'Block notes nella stessa grafica del kit, per riunioni e appunti quotidiani.', tags: ['ufficio', 'kit'], materials: [], customization: welcomeCustom },
  { id: 'scatole-presentazione', name: 'Scatole di presentazione premium', collection: 'welcome', order: 7, visible: true,
    description: 'Confezione di presentazione per raccogliere e consegnare il kit con cura.', tags: ['packaging', 'kit'], materials: [], customization: welcomeCustom },
  { id: 'kit-benvenuto-dipendenti', name: 'Kit di benvenuto per dipendenti', collection: 'welcome', order: 8, visible: true,
    description: 'Un kit completo per il primo giorno: il nuovo arrivato riceve un’esperienza coordinata.', tags: ['HR', 'kit'], materials: [], customization: welcomeCustom },
  { id: 'kit-benvenuto-clienti', name: 'Kit di benvenuto per clienti', collection: 'welcome', order: 9, visible: true,
    description: 'Un kit coordinato per accogliere nuovi clienti e rafforzare la relazione con il brand.', tags: ['clienti', 'kit'], materials: [], customization: welcomeCustom },

  // Tech & Office
  { id: 'hub-ricarica-wireless', name: 'Hub di ricarica wireless', collection: 'tech', order: 1, visible: true,
    description: 'Hub di ricarica wireless con il tuo logo, per una scrivania ordinata e riconoscibile.', tags: ['tech', 'scrivania'], materials: [], customization: ['Logo personalizzato'] },
  { id: 'tappetino-ergonomico', name: 'Tappetino mouse ergonomico', collection: 'tech', order: 2, visible: true,
    description: 'Tappetino ergonomico personalizzato per il comfort quotidiano alla scrivania.', tags: ['ergonomia', 'scrivania'], materials: [], customization: ['Logo personalizzato'] },
  { id: 'agenda-rilegata', name: 'Agende rilegate', collection: 'tech', order: 3, visible: true,
    description: 'Agende rilegate personalizzate, per appunti, pianificazione e riunioni.', tags: ['ufficio', 'agenda'], materials: [], customization: ['Logo personalizzato'] },
  { id: 'agenda-metallo-inciso', name: 'Agende con dettagli metallici incisi al laser', collection: 'tech', order: 4, visible: true,
    description: 'Agende con dettagli metallici incisi al laser, per una finitura più raffinata.', tags: ['agenda', 'premium', 'inciso'], materials: ['Metallo inciso al laser'], customization: ['Logo inciso'] },
  { id: 'accessori-ufficio', name: 'Accessori da ufficio coordinati', collection: 'tech', order: 5, visible: true,
    description: 'Una linea di accessori da scrivania che condividono la stessa identità visiva.', tags: ['ufficio', 'coordinato'], materials: [], customization: ['Logo personalizzato'] },

  // Outdoor & Leisure
  { id: 'zaino-impermeabile', name: 'Zaini tecnici impermeabili', collection: 'outdoor', order: 1, visible: true,
    description: 'Zaino tecnico impermeabile con branding personalizzato, per uso quotidiano e all’aperto.', tags: ['tecnico', 'zaino'], materials: [], customization: ['Logo personalizzato'] },
  { id: 'cappellino-ricamato', name: 'Cappellini ricamati', collection: 'outdoor', order: 2, visible: true,
    description: 'Cappellino con logo ricamato, pratico e riconoscibile.', tags: ['abbigliamento', 'ricamo'], materials: [], customization: ['Logo ricamato'] },
  { id: 'asciugamano-microfibra', name: 'Asciugamani in microfibra compatti', collection: 'outdoor', order: 3, visible: true,
    description: 'Asciugamano compatto in microfibra, comodo per sport, palestre e viaggi.', tags: ['sport', 'compatto'], materials: ['Microfibra'], customization: ['Logo personalizzato'] },
  { id: 'accessori-sport-palestre', name: 'Accessori promozionali per sport e palestre', collection: 'outdoor', order: 4, visible: true,
    description: 'Accessori promozionali pensati per società sportive e palestre.', tags: ['sport', 'palestra'], materials: [], customization: ['Logo personalizzato'] },
  { id: 'accessori-benessere', name: 'Accessori promozionali per centri benessere', collection: 'outdoor', order: 5, visible: true,
    description: 'Accessori promozionali pensati per centri benessere e spa.', tags: ['benessere'], materials: [], customization: ['Logo personalizzato'] },

  // Displays & Signage
  { id: 'targa-plexiglass', name: 'Targhe da scrivania in plexiglass', collection: 'signage', order: 1, visible: true,
    description: 'Targa da scrivania in plexiglass con logo, per reception e uffici.', tags: ['plexiglass', 'targa'], materials: ['Plexiglass'], customization: ['Logo e testo'] },
  { id: 'targa-legno', name: 'Targhe da scrivania in legno', collection: 'signage', order: 2, visible: true,
    description: 'Targa da scrivania in legno naturale, con un’impronta calda e materica.', tags: ['legno', 'targa'], materials: ['Legno naturale'], customization: ['Logo e testo'] },
  { id: 'logo-rilievo', name: 'Segnaletica con logo in rilievo', collection: 'signage', order: 3, visible: true,
    description: 'Segnaletica con logo e lettering in rilievo, per un effetto dimensionale.', tags: ['rilievo', 'segnaletica'], materials: [], customization: ['Logo in rilievo'] },
  { id: 'espositore-reception', name: 'Espositori per reception', collection: 'signage', order: 4, visible: true,
    description: 'Espositore per reception che presenta il brand al primo sguardo.', tags: ['reception', 'espositore'], materials: [], customization: ['Logo e testo'] },
  { id: 'espositore-punto-vendita', name: 'Espositori per punti vendita', collection: 'signage', order: 5, visible: true,
    description: 'Espositore da banco per retail e punti vendita.', tags: ['retail', 'espositore'], materials: [], customization: ['Logo e testo'] },
  { id: 'segnaletica-tavolo-premium', name: 'Segnaletica premium da tavolo', collection: 'signage', order: 6, visible: true,
    description: 'Segnaletica da tavolo di fascia alta per eventi, uffici e punti di accoglienza.', tags: ['premium', 'tavolo'], materials: [], customization: ['Logo e testo'] },

  // Portachiavi e merchandising
  { id: 'portachiavi-metallo', name: 'Portachiavi in metallo', collection: 'keychains', order: 1, visible: true,
    description: 'Portachiavi in metallo con il tuo logo: un oggetto solido e durevole.', tags: ['portachiavi', 'metallo'], materials: ['Metallo'], customization: ['Logo e testo'] },
  { id: 'portachiavi-legno', name: 'Portachiavi in legno', collection: 'keychains', order: 2, visible: true,
    description: 'Portachiavi in legno con un’impronta naturale e calda.', tags: ['portachiavi', 'legno'], materials: ['Legno'], customization: ['Logo e testo'] },
  { id: 'portachiavi-pelle', name: 'Portachiavi in pelle', collection: 'keychains', order: 3, visible: true,
    description: 'Portachiavi in pelle, con un tocco elegante e tattile.', tags: ['portachiavi', 'pelle'], materials: ['Pelle'], customization: ['Logo e testo'] },
  { id: 'portachiavi-gomma', name: 'Portachiavi in gomma', collection: 'keychains', order: 4, visible: true,
    description: 'Portachiavi in gomma, leggero e pratico per uso quotidiano ed eventi.', tags: ['portachiavi', 'gomma'], materials: ['Gomma'], customization: ['Logo e testo'] },
  { id: 'merchandising-promozionale', name: 'Merchandising promozionale personalizzato', collection: 'keychains', order: 5, visible: true,
    description: 'Gadget e merchandising promozionale personalizzato con il tuo brand.', tags: ['gadget', 'promo'], materials: [], customization: ['Logo e testo'] },
  { id: 'gadget-eventi-aziendali', name: 'Gadget per eventi aziendali', collection: 'keychains', order: 6, visible: true,
    description: 'Piccoli omaggi per eventi aziendali e giornate di lavoro.', tags: ['evento', 'gadget'], materials: [], customization: ['Logo e testo'] },
  { id: 'accessori-fiere', name: 'Accessori promozionali per fiere', collection: 'keychains', order: 7, visible: true,
    description: 'Accessori promozionali pensati per fiere ed eventi di settore.', tags: ['fiera', 'promo'], materials: [], customization: ['Logo e testo'] },
];

export const PRODUCT_COUNT = PRODUCTS.length;
