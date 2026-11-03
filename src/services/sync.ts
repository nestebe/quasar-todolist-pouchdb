import PouchDB from 'pouchdb-browser';

import type { TodoContent, TodoDatabase } from '@/models/todo';

export type SyncStatus = 'disabled' | 'connecting' | 'active' | 'paused' | 'offline' | 'error';

export interface SyncConfig {
  url: string;
  username?: string | undefined;
  password?: string | undefined;
}

/** Reads the optional CouchDB configuration from QCLI_* env variables. */
export function getSyncConfig(): SyncConfig | null {
  const url = import.meta.env.QCLI_COUCHDB_URL;
  if (!url) {
    return null;
  }
  return {
    url,
    username: import.meta.env.QCLI_COUCHDB_USER,
    password: import.meta.env.QCLI_COUCHDB_PASSWORD,
  };
}

/**
 * Starts a live, bidirectional replication between the local database
 * and a remote CouchDB. Returns a function that stops the replication.
 */
export function startSync(
  local: TodoDatabase,
  config: SyncConfig,
  onStatus: (status: SyncStatus) => void,
): () => void {
  const remote = new PouchDB<TodoContent>(config.url, {
    skip_setup: false,
    ...(config.username && config.password
      ? { auth: { username: config.username, password: config.password } }
      : {}),
  });

  onStatus('connecting');

  const sync = local
    .sync(remote, { live: true, retry: true })
    .on('active', () => onStatus('active'))
    .on('paused', (error) => onStatus(error ? 'offline' : 'paused'))
    .on('denied', () => onStatus('error'))
    .on('error', (error) => {
      console.error('[pouchdb] sync error', error);
      onStatus('error');
    });

  return () => sync.cancel();
}
