import { defineBoot } from '#q-app';

import { useTodoStore } from '@/stores/todo-store';

/** Opens the local database (and the optional CouchDB sync) before the app mounts. */
export default defineBoot(async ({ store }) => {
  await useTodoStore(store).init();
});
