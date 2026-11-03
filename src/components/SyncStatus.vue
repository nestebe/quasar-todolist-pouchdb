<template>
  <q-chip dense square :icon="display.icon" :color="display.color" text-color="white">
    {{ display.label }}
    <q-tooltip>{{ display.hint }}</q-tooltip>
  </q-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { SyncStatus } from '@/services/sync';

const props = defineProps<{ status: SyncStatus }>();

interface StatusDisplay {
  icon: string;
  color: string;
  label: string;
  hint: string;
}

const displays: Record<SyncStatus, StatusDisplay> = {
  disabled: {
    icon: 'storage',
    color: 'blue-grey-6',
    label: 'Local',
    hint: 'Données stockées dans le navigateur (IndexedDB). Définissez QCLI_COUCHDB_URL pour synchroniser.',
  },
  connecting: {
    icon: 'cloud_sync',
    color: 'blue-grey-6',
    label: 'Connexion…',
    hint: 'Connexion à CouchDB en cours',
  },
  active: { icon: 'sync', color: 'info', label: 'Synchro…', hint: 'Réplication en cours' },
  paused: {
    icon: 'cloud_done',
    color: 'positive',
    label: 'Synchronisé',
    hint: 'À jour avec CouchDB',
  },
  offline: {
    icon: 'cloud_off',
    color: 'warning',
    label: 'Hors ligne',
    hint: 'CouchDB injoignable : les modifications seront envoyées au retour du réseau',
  },
  error: {
    icon: 'error_outline',
    color: 'negative',
    label: 'Erreur',
    hint: 'Erreur de synchronisation',
  },
};

const display = computed(() => displays[props.status]);
</script>
