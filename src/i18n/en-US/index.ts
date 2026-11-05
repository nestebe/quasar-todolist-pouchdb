export default {
  form: {
    label: 'New task',
    placeholder: 'What needs to be done?',
    add: 'Add',
  },
  search: {
    label: 'Search',
    placeholder: 'Search (pouchdb-find)',
  },
  filters: {
    all: 'All',
    active: 'To do',
    done: 'Done',
  },
  todo: {
    createdAt: 'Created {date}',
    markDone: 'Mark as done',
    markActive: 'Mark as to do',
    edit: 'Edit',
    remove: 'Delete',
  },
  list: {
    remaining: 'All done 🎉 | {n} task to do | {n} tasks to do',
    results: 'No result | {n} result | {n} results',
    removeCompleted: 'Delete completed',
    empty: {
      search: 'No result for “{search}”',
      done: 'No completed task',
      active: 'Nothing to do, enjoy!',
      all: 'No task yet',
    },
  },
  actions: {
    failed: 'The operation failed',
    editTitle: 'Edit task',
    removed: '“{title}” deleted',
    undo: 'Undo',
    removeCompletedTitle: 'Delete completed tasks',
    removeCompletedMessage:
      '{n} completed task will be deleted. | {n} completed tasks will be deleted.',
    removeCompletedOk: 'Delete',
    removedCount: '{n} task deleted | {n} tasks deleted',
  },
  sync: {
    disabled: {
      label: 'Local',
      hint: 'Data stored in the browser (IndexedDB). Set QCLI_COUCHDB_URL to sync.',
    },
    connecting: { label: 'Connecting…', hint: 'Connecting to CouchDB' },
    active: { label: 'Syncing…', hint: 'Replication in progress' },
    paused: { label: 'Synced', hint: 'Up to date with CouchDB' },
    offline: {
      label: 'Offline',
      hint: 'CouchDB unreachable: changes will be sent once the network is back',
    },
    error: { label: 'Error', hint: 'Synchronization error' },
  },
  layout: {
    lightTheme: 'Light theme',
    darkTheme: 'Dark theme',
    language: 'Language',
  },
  notFound: {
    message: 'Oops. Nothing here…',
    home: 'Go home',
  },
};
