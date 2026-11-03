<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-icon name="checklist" size="sm" class="q-mr-sm" />
        <q-toolbar-title>Todo PouchDB</q-toolbar-title>

        <SyncStatus :status="store.syncStatus" />

        <q-btn
          flat
          round
          dense
          class="q-ml-sm"
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          :aria-label="$q.dark.isActive ? 'Thème clair' : 'Thème sombre'"
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
import SyncStatus from '@/components/SyncStatus.vue';
import { useTodoStore } from '@/stores/todo-store';

const store = useTodoStore();
</script>
