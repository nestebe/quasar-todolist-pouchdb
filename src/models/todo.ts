/** Content of a todo document as stored in PouchDB. */
export interface TodoContent {
  type: 'todo';
  title: string;
  done: boolean;
  /** ISO 8601 date */
  createdAt: string;
  /** ISO 8601 date */
  updatedAt: string;
}

/** A todo document read from the database (with `_id` and `_rev`). */
export type Todo = PouchDB.Core.ExistingDocument<TodoContent>;

export type TodoDatabase = PouchDB.Database<TodoContent>;

export type TodoFilter = 'all' | 'active' | 'done';

export interface TodoQuery {
  /** Case-insensitive text searched in the title */
  search?: string;
}
