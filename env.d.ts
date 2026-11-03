/**
 * Types for custom env variables (only QCLI_* ones are exposed to the client).
 *
 * https://v2.quasar.dev/quasar-cli-vite/handling-import-meta-env#type-inference
 */
interface ImportMetaEnv {
  /** Optional CouchDB database URL to sync with, e.g. http://localhost:5984/todos */
  readonly QCLI_COUCHDB_URL?: string;
  readonly QCLI_COUCHDB_USER?: string;
  readonly QCLI_COUCHDB_PASSWORD?: string;
}
