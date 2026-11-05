import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';

import type { TodoContent, TodoDatabase } from '@/models/todo';
import { TodoRepository } from '@/repositories/todo-repository';

PouchDB.plugin(PouchDBFind);

/** Name of the local (IndexedDB) database. */
export const LOCAL_DB_NAME = 'todos';

export const db: TodoDatabase = new PouchDB<TodoContent>(LOCAL_DB_NAME);

export const todoRepository = new TodoRepository(db);
