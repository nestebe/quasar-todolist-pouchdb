import type enUS from '../en-US';

export default {
  form: {
    label: 'Nouvelle tâche',
    placeholder: 'Que faut-il faire ?',
    add: 'Ajouter',
  },
  search: {
    label: 'Rechercher',
    placeholder: 'Rechercher (pouchdb-find)',
  },
  filters: {
    all: 'Toutes',
    active: 'À faire',
    done: 'Terminées',
  },
  todo: {
    createdAt: 'Créée le {date}',
    markDone: 'Marquer comme terminée',
    markActive: 'Marquer comme à faire',
    edit: 'Modifier',
    remove: 'Supprimer',
  },
  list: {
    remaining: 'Tout est fait 🎉 | {n} tâche à faire | {n} tâches à faire',
    results: 'Aucun résultat | {n} résultat | {n} résultats',
    removeCompleted: 'Supprimer les terminées',
    empty: {
      search: 'Aucun résultat pour « {search} »',
      done: 'Aucune tâche terminée',
      active: 'Rien à faire, profitez-en !',
      all: 'Aucune tâche pour le moment',
    },
  },
  actions: {
    failed: "L'opération a échoué",
    editTitle: 'Modifier la tâche',
    removed: '« {title} » supprimée',
    undo: 'Annuler',
    removeCompletedTitle: 'Supprimer les tâches terminées',
    removeCompletedMessage:
      '{n} tâche terminée sera supprimée. | {n} tâches terminées seront supprimées.',
    removeCompletedOk: 'Supprimer',
    removedCount: '{n} tâche supprimée | {n} tâches supprimées',
  },
  sync: {
    disabled: {
      label: 'Local',
      hint: 'Données stockées dans le navigateur (IndexedDB). Définissez QCLI_COUCHDB_URL pour synchroniser.',
    },
    connecting: { label: 'Connexion…', hint: 'Connexion à CouchDB en cours' },
    active: { label: 'Synchro…', hint: 'Réplication en cours' },
    paused: { label: 'Synchronisé', hint: 'À jour avec CouchDB' },
    offline: {
      label: 'Hors ligne',
      hint: 'CouchDB injoignable : les modifications seront envoyées au retour du réseau',
    },
    error: { label: 'Erreur', hint: 'Erreur de synchronisation' },
  },
  layout: {
    lightTheme: 'Thème clair',
    darkTheme: 'Thème sombre',
    language: 'Langue',
  },
  notFound: {
    message: "Oups, il n'y a rien ici…",
    home: "Retour à l'accueil",
  },
} satisfies typeof enUS;
