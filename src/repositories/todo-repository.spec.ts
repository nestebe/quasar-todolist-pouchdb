import PouchDB from 'pouchdb-core';
import PouchDBMemory from 'pouchdb-adapter-memory';
import PouchDBFind from 'pouchdb-find';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { TodoContent, TodoDatabase } from '@/models/todo';

import { TodoRepository, toCaseInsensitivePattern } from './todo-repository';

PouchDB.plugin(PouchDBMemory).plugin(PouchDBFind);

let db: TodoDatabase;
let repository: TodoRepository;

beforeEach(async () => {
  db = new PouchDB<TodoContent>(`test-${crypto.randomUUID()}`, { adapter: 'memory' });
  repository = new TodoRepository(db);
  await repository.init();
});

afterEach(async () => {
  vi.useRealTimers();
  await db.destroy();
});

describe('toCaseInsensitivePattern', () => {
  it('matches letters regardless of case', () => {
    expect(toCaseInsensitivePattern('Ab1')).toBe('[aA][bB]1');
  });

  it('escapes RegExp special characters', () => {
    const pattern = new RegExp(toCaseInsensitivePattern('a.b*('));
    expect(pattern.test('A.B*(')).toBe(true);
    expect(pattern.test('axb')).toBe(false);
  });
});

describe('TodoRepository', () => {
  it('creates a todo and reads it back', async () => {
    const created = await repository.create('  Buy milk  ');

    expect(created.title).toBe('Buy milk');
    expect(created.done).toBe(false);
    expect(created._id).toMatch(/^todo:/);
    expect(await repository.get(created._id)).toEqual(created);
  });

  it('lists todos from the most recent to the oldest', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-01-01T10:00:00Z'));
    await repository.create('first');
    vi.setSystemTime(new Date('2026-01-01T11:00:00Z'));
    await repository.create('second');

    const titles = (await repository.find()).map((todo) => todo.title);
    expect(titles).toEqual(['second', 'first']);
  });

  it('searches titles case-insensitively', async () => {
    await repository.create('Learn PouchDB');
    await repository.create('Learn Quasar');
    await repository.create('Walk the dog');

    const titles = (await repository.find({ search: 'learn' })).map((todo) => todo.title);
    expect(titles.sort()).toEqual(['Learn PouchDB', 'Learn Quasar']);
  });

  it('toggles and renames a todo', async () => {
    const todo = await repository.create('Write tests');

    const toggled = await repository.toggle(todo);
    const renamed = await repository.update(toggled, { title: 'Write more tests' });

    expect(renamed).toMatchObject({ title: 'Write more tests', done: true });
    expect(renamed._rev).not.toBe(todo._rev);
  });

  it('removes then restores a todo', async () => {
    const todo = await repository.create('Oops');

    await repository.remove(todo);
    expect(await repository.find()).toHaveLength(0);

    await repository.restore(todo);
    expect((await repository.find()).map((t) => t.title)).toEqual(['Oops']);
  });

  it('removes only completed todos', async () => {
    const done = await repository.create('done');
    await repository.create('active');
    await repository.toggle(done);

    expect(await repository.removeCompleted()).toBe(1);
    expect((await repository.find()).map((todo) => todo.title)).toEqual(['active']);
  });

  it('notifies changes until unsubscribed', async () => {
    const onChange = vi.fn();
    const stop = repository.watch(onChange);

    await repository.create('watched');
    await vi.waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));

    stop();
    await repository.create('not watched');
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
