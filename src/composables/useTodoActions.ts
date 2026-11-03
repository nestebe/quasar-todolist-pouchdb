import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import type { Todo } from '@/models/todo';
import { useTodoStore } from '@/stores/todo-store';

/** UI-level actions on todos: dialogs, notifications, undo and error reporting. */
export function useTodoActions() {
  const $q = useQuasar();
  const { t } = useI18n();
  const store = useTodoStore();

  async function run(action: () => Promise<unknown>): Promise<void> {
    try {
      await action();
    } catch (error) {
      console.error(error);
      $q.notify({ type: 'negative', message: t('actions.failed'), caption: String(error) });
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
      title: t('actions.editTitle'),
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
        message: t('actions.removed', { title: todo.title }),
        icon: 'delete',
        timeout: 4000,
        actions: [
          {
            label: t('actions.undo'),
            color: 'yellow',
            handler: () => void run(() => store.restore(todo)),
          },
        ],
      });
    });
  }

  function removeCompleted(): void {
    $q.dialog({
      title: t('actions.removeCompletedTitle'),
      message: t('actions.removeCompletedMessage', store.doneCount),
      cancel: true,
      ok: { label: t('actions.removeCompletedOk'), color: 'negative', flat: true },
    }).onOk(
      () =>
        void run(async () => {
          const count = await store.removeCompleted();
          $q.notify({ type: 'positive', message: t('actions.removedCount', count) });
        }),
    );
  }

  return { add, toggle, edit, remove, removeCompleted };
}
