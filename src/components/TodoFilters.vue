<template>
  <q-tabs
    v-model="filter"
    dense
    no-caps
    align="justify"
    active-color="primary"
    indicator-color="primary"
  >
    <q-tab v-for="tab in tabs" :key="tab.name" :name="tab.name">
      <div class="row no-wrap items-center q-gutter-x-sm q-py-xs">
        <span>{{ t(`filters.${tab.name}`) }}</span>
        <q-badge :color="tab.color" rounded :label="tab.count" />
      </div>
    </q-tab>
  </q-tabs>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { TodoFilter } from '@/models/todo';

const props = defineProps<{ activeCount: number; doneCount: number }>();

const filter = defineModel<TodoFilter>({ required: true });

const { t } = useI18n();

const tabs = computed<{ name: TodoFilter; color: string; count: number }[]>(() => [
  { name: 'all', color: 'blue-grey-5', count: props.activeCount + props.doneCount },
  { name: 'active', color: 'primary', count: props.activeCount },
  { name: 'done', color: 'positive', count: props.doneCount },
]);
</script>
