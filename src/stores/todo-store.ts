import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { Todo, TodoFilter } from '@/models/todo';
import { db, todoRepository as repository } from '@/services/database';
import { getSyncConfig, startSync, type SyncStatus } from '@/services/sync';

export const useTodoStore = defineStore('todos', () => {
  const todos = ref<Todo[]>([]);
  const search = ref('');
  const filter = ref<TodoFilter>('all');
  const loading = ref(false);
  const ready = ref(false);
  const syncStatus = ref<SyncStatus>('disabled');

  const activeCount = computed(() => todos.value.filter((todo) => !todo.done).length);
  const doneCount = computed(() => todos.value.length - activeCount.value);

  const visibleTodos = computed(() => {
    switch (filter.value) {
      case 'active':
        return todos.value.filter((todo) => !todo.done);
      case 'done':
        return todos.value.filter((todo) => todo.done);
      default:
        return todos.value;
    }
  });

  async function refresh(): Promise<void> {
    loading.value = true;
    try {
      todos.value = await repository.find({ search: search.value });
    } finally {
      loading.value = false;
    }
  }

  /** Prepares the database, loads todos and reacts to every change (incl. sync). */
  async function init(): Promise<void> {
    if (ready.value) {
      return;
    }
    await repository.init();
    await refresh();
    repository.watch(() => void refresh());

    const syncConfig = getSyncConfig();
    if (syncConfig) {
      startSync(db, syncConfig, (status) => (syncStatus.value = status));
    }
    ready.value = true;
  }

  async function setSearch(value: string): Promise<void> {
    search.value = value;
    await refresh();
  }

  // Mutations only write to PouchDB: the changes feed triggers `refresh()`.
  async function add(title: string): Promise<void> {
    if (title.trim()) {
      await repository.create(title);
    }
  }

  async function rename(todo: Todo, title: string): Promise<void> {
    if (title.trim() && title.trim() !== todo.title) {
      await repository.update(todo, { title: title.trim() });
    }
  }

  async function toggle(todo: Todo): Promise<void> {
    await repository.toggle(todo);
  }

  async function remove(todo: Todo): Promise<void> {
    await repository.remove(todo);
  }

  async function restore(todo: Todo): Promise<void> {
    await repository.restore(todo);
  }

  async function removeCompleted(): Promise<number> {
    return repository.removeCompleted();
  }

  return {
    todos,
    search,
    filter,
    loading,
    syncStatus,
    activeCount,
    doneCount,
    visibleTodos,
    init,
    refresh,
    setSearch,
    add,
    rename,
    toggle,
    remove,
    restore,
    removeCompleted,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTodoStore, import.meta.hot));
}
