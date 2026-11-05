<template>
  <q-chip dense square :icon="display.icon" :color="display.color" text-color="white">
    {{ t(`sync.${status}.label`) }}
    <q-tooltip>{{ t(`sync.${status}.hint`) }}</q-tooltip>
  </q-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { SyncStatus } from '@/services/sync';

const props = defineProps<{ status: SyncStatus }>();

const { t } = useI18n();

const displays: Record<SyncStatus, { icon: string; color: string }> = {
  disabled: { icon: 'storage', color: 'blue-grey-6' },
  connecting: { icon: 'cloud_sync', color: 'blue-grey-6' },
  active: { icon: 'sync', color: 'info' },
  paused: { icon: 'cloud_done', color: 'positive' },
  offline: { icon: 'cloud_off', color: 'warning' },
  error: { icon: 'error_outline', color: 'negative' },
};

const display = computed(() => displays[props.status]);
</script>
