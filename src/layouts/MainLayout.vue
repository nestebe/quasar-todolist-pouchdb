<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-icon name="checklist" size="sm" class="q-mr-sm" />
        <q-toolbar-title>Todo PouchDB</q-toolbar-title>

        <SyncStatus :status="store.syncStatus" />
        <LanguageSwitcher class="q-ml-sm" />

        <q-btn
          flat
          round
          dense
          class="q-ml-sm"
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          :aria-label="$q.dark.isActive ? t('layout.lightTheme') : t('layout.darkTheme')"
          @click="$q.dark.toggle()"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import SyncStatus from '@/components/SyncStatus.vue';
import { useTodoStore } from '@/stores/todo-store';

const store = useTodoStore();
const { t } = useI18n();
</script>
