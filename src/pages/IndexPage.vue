<template>
  <q-page padding class="row justify-center items-start">
    <div class="todo-page column q-gutter-y-md">
      <TodoForm @submit="actions.add" />

      <q-card flat bordered>
        <q-input
          :model-value="store.search"
          dense
          borderless
          clearable
          debounce="250"
          class="q-px-md"
          placeholder="Rechercher (pouchdb-find $regex)"
          aria-label="Rechercher"
          @update:model-value="(value) => void store.setSearch(String(value ?? ''))"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-separator />

        <TodoFilters
          v-model="store.filter"
          :active-count="store.activeCount"
          :done-count="store.doneCount"
        />

        <q-separator />

        <q-list v-if="store.visibleTodos.length > 0" separator>
          <TodoItem
            v-for="todo in store.visibleTodos"
            :key="todo._id"
            :todo="todo"
            @toggle="actions.toggle(todo)"
            @edit="actions.edit(todo)"
            @remove="actions.remove(todo)"
          />
        </q-list>

        <div v-else class="column items-center q-pa-xl text-grey-6">
          <q-icon :name="emptyState.icon" size="56px" />
          <div class="q-mt-sm text-subtitle1">{{ emptyState.message }}</div>
        </div>

        <template v-if="store.todos.length > 0">
          <q-separator />
          <q-card-actions class="q-px-md text-grey-7">
            <span>{{ remainingLabel }}</span>
            <q-space />
            <q-btn
              flat
              dense
              no-caps
              color="negative"
              icon="delete_sweep"
              label="Supprimer les terminées"
              :disable="store.doneCount === 0"
              @click="actions.removeCompleted"
            />
          </q-card-actions>
        </template>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import TodoFilters from '@/components/TodoFilters.vue';
import TodoForm from '@/components/TodoForm.vue';
import TodoItem from '@/components/TodoItem.vue';
import { useTodoActions } from '@/composables/useTodoActions';
import { useTodoStore } from '@/stores/todo-store';

const store = useTodoStore();
const actions = useTodoActions();

const remainingLabel = computed(() => {
  if (store.search) {
    const results = store.todos.length;
    return `${results} résultat${results > 1 ? 's' : ''}`;
  }
  const count = store.activeCount;
  return count === 0 ? 'Tout est fait 🎉' : `${count} tâche${count > 1 ? 's' : ''} à faire`;
});

const emptyState = computed(() => {
  if (store.search) {
    return { icon: 'search_off', message: `Aucun résultat pour « ${store.search} »` };
  }
  if (store.filter === 'done') {
    return { icon: 'hourglass_empty', message: 'Aucune tâche terminée' };
  }
  if (store.filter === 'active' && store.todos.length > 0) {
    return { icon: 'celebration', message: 'Rien à faire, profitez-en !' };
  }
  return { icon: 'checklist', message: 'Aucune tâche pour le moment' };
});
</script>

<style lang="scss" scoped>
.todo-page {
  width: 100%;
  max-width: 720px;
}
</style>
