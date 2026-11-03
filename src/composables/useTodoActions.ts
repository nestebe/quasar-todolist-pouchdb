import { useQuasar } from 'quasar';

import type { Todo } from '@/models/todo';
import { useTodoStore } from '@/stores/todo-store';

/** UI-level actions on todos: dialogs, notifications, undo and error reporting. */
export function useTodoActions() {
  const $q = useQuasar();
  const store = useTodoStore();

  async function run(action: () => Promise<unknown>): Promise<void> {
    try {
      await action();
    } catch (error) {
      console.error(error);
      $q.notify({ type: 'negative', message: "L'opération a échoué", caption: String(error) });
    }
  }

  function add(title: string): Promise<void> {
    return run(() => store.add(title));
  }

  function toggle(todo: Todo): Promise<void> {
    return run(() => store.toggle(todo));
  }

  function edit(todo: Todo): void {
    $q.dialog({
      title: 'Modifier la tâche',
      prompt: {
        model: todo.title,
        type: 'text',
        isValid: (value: string) => value.trim().length > 0,
      },
      cancel: true,
      persistent: true,
    }).onOk((title: string) => void run(() => store.rename(todo, title)));
  }

  function remove(todo: Todo): Promise<void> {
    return run(async () => {
      await store.remove(todo);
      $q.notify({
        message: `« ${todo.title} » supprimée`,
        icon: 'delete',
        timeout: 4000,
        actions: [
          {
            label: 'Annuler',
            color: 'yellow',
            handler: () => void run(() => store.restore(todo)),
          },
        ],
      });
    });
  }

  function removeCompleted(): void {
    $q.dialog({
      title: 'Supprimer les tâches terminées',
      message: `${store.doneCount} tâche(s) terminée(s) seront supprimées.`,
      cancel: true,
      ok: { label: 'Supprimer', color: 'negative', flat: true },
    }).onOk(
      () =>
        void run(async () => {
          const count = await store.removeCompleted();
          $q.notify({ type: 'positive', message: `${count} tâche(s) supprimée(s)` });
        }),
    );
  }

  return { add, toggle, edit, remove, removeCompleted };
}
