<template>
  <q-item tag="label" class="todo-item">
    <q-item-section side>
      <q-checkbox
        :model-value="todo.done"
        color="positive"
        :aria-label="todo.done ? t('todo.markActive') : t('todo.markDone')"
        @update:model-value="emit('toggle')"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="{ 'todo-item__title--done': todo.done }" class="todo-item__title">
        {{ todo.title }}
      </q-item-label>
      <q-item-label caption>
        {{ t('todo.createdAt', { date: d(new Date(todo.createdAt), 'long') }) }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="row no-wrap q-gutter-x-xs">
        <q-btn
          flat
          round
          dense
          icon="edit"
          :aria-label="t('todo.edit')"
          @click.prevent="emit('edit')"
        >
          <q-tooltip>{{ t('todo.edit') }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          dense
          icon="delete_outline"
          color="negative"
          :aria-label="t('todo.remove')"
          @click.prevent="emit('remove')"
        >
          <q-tooltip>{{ t('todo.remove') }}</q-tooltip>
        </q-btn>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import type { Todo } from '@/models/todo';

defineProps<{ todo: Todo }>();

const emit = defineEmits<{
  toggle: [];
  edit: [];
  remove: [];
}>();

const { t, d } = useI18n();
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
