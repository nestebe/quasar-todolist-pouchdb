import type { Todo, TodoContent, TodoDatabase, TodoQuery } from '@/models/todo';

const TODO_TYPE = 'todo';

/** Escapes a user input so it can be safely used inside a RegExp. */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds a case-insensitive pattern without flags (pouchdb-find `$regex`
 * only accepts a string): "Ab" -> "[aA][bB]".
 */
export function toCaseInsensitivePattern(search: string): string {
  return Array.from(escapeRegExp(search), (char) => {
    const lower = char.toLowerCase();
    const upper = char.toUpperCase();
    return lower === upper ? char : `[${lower}${upper}]`;
  }).join('');
}

function newId(createdAt: string): string {
  // Prefixed by the creation date so ids are naturally sorted,
  // suffixed by a random part to avoid collisions between synced devices.
  return `todo:${createdAt}:${crypto.randomUUID().slice(0, 8)}`;
}

/** Data access layer for todos, built on top of PouchDB + pouchdb-find. */
export class TodoRepository {
  constructor(private readonly db: TodoDatabase) {}

  /** Creates the Mango index used by `find()`. Idempotent. */
  async init(): Promise<void> {
    await this.db.createIndex({
      index: { fields: ['type', 'createdAt'], name: 'todo-by-date', ddoc: 'todo-by-date' },
    });
  }

  /** Lists todos, most recent first, optionally filtered by title. */
  async find(query: TodoQuery = {}): Promise<Todo[]> {
    const selector: PouchDB.Find.Selector = {
      type: TODO_TYPE,
      createdAt: { $gt: null },
    };

    const search = query.search?.trim();
    if (search) {
      selector.title = { $regex: toCaseInsensitivePattern(search) };
    }

    const result = await this.db.find({
      selector,
      sort: [{ type: 'desc' }, { createdAt: 'desc' }],
      use_index: 'todo-by-date',
    });
    return result.docs;
  }

  async get(id: string): Promise<Todo> {
    return this.db.get(id);
  }

  async create(title: string): Promise<Todo> {
    const now = new Date().toISOString();
    const content: TodoContent = {
      type: TODO_TYPE,
      title: title.trim(),
      done: false,
      createdAt: now,
      updatedAt: now,
    };
    const { id, rev } = await this.db.put({ _id: newId(now), ...content });
    return { _id: id, _rev: rev, ...content };
  }

  async update(todo: Todo, changes: Partial<Pick<TodoContent, 'title' | 'done'>>): Promise<Todo> {
    const updated: Todo = { ...todo, ...changes, updatedAt: new Date().toISOString() };
    const { rev } = await this.db.put(updated);
    return { ...updated, _rev: rev };
  }

  async toggle(todo: Todo): Promise<Todo> {
    return this.update(todo, { done: !todo.done });
  }

  async remove(todo: Todo): Promise<void> {
    await this.db.remove(todo);
  }

  /** Re-creates a previously removed todo (used to undo a deletion). */
  async restore(todo: Todo): Promise<Todo> {
    const { _rev, ...doc } = todo;
    const { rev } = await this.db.put({ ...doc, updatedAt: new Date().toISOString() });
    return { ...doc, _rev: rev };
  }

  /** Deletes every completed todo in a single bulk request. Returns the count. */
  async removeCompleted(): Promise<number> {
    const completed = (await this.find()).filter((todo) => todo.done);
    if (completed.length > 0) {
      await this.db.bulkDocs(completed.map((todo) => ({ ...todo, _deleted: true })));
    }
    return completed.length;
  }

  /**
   * Listens to every change (local edits, other tabs, remote sync).
   * Returns a function that stops listening.
   */
  watch(onChange: () => void): () => void {
    const feed = this.db
      .changes({ since: 'now', live: true })
      .on('change', (change) => {
        if (!change.id.startsWith('_design/')) {
          onChange();
        }
      })
      .on('error', (error) => console.error('[pouchdb] changes feed error', error));

    return () => feed.cancel();
  }
}
