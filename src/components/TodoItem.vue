<template>
  <q-item tag="label" class="todo-item">
    <q-item-section side>
      <q-checkbox
        :model-value="todo.done"
        color="positive"
        :aria-label="todo.done ? 'Marquer comme à faire' : 'Marquer comme terminée'"
        @update:model-value="emit('toggle')"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="{ 'todo-item__title--done': todo.done }" class="todo-item__title">
        {{ todo.title }}
      </q-item-label>
      <q-item-label caption>{{ createdLabel }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="row no-wrap q-gutter-x-xs">
        <q-btn flat round dense icon="edit" aria-label="Modifier" @click.prevent="emit('edit')">
          <q-tooltip>Modifier</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          dense
          icon="delete_outline"
          color="negative"
          aria-label="Supprimer"
          @click.prevent="emit('remove')"
        >
          <q-tooltip>Supprimer</q-tooltip>
        </q-btn>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { Todo } from '@/models/todo';

const props = defineProps<{ todo: Todo }>();

const emit = defineEmits<{
  toggle: [];
  edit: [];
  remove: [];
}>();

const dateFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });

const createdLabel = computed(
  () => `Créée le ${dateFormat.format(new Date(props.todo.createdAt))}`,
);
</script>

<style lang="scss" scoped>
.todo-item__title {
  word-break: break-word;
  transition:
    opacity 0.2s,
    color 0.2s;
}

.todo-item__title--done {
  text-decoration: line-through;
  opacity: 0.55;
}
</style>
