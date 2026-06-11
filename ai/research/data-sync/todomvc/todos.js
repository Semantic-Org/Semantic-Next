import { collection } from '@semantic-ui/data';

export const Activity = collection('activity', {
  schema: {
    type: String,
    todoID: String,
    createdAt: { type: Date, default: () => new Date() },
  },
});

export const Shares = collection('shares', {
  schema: {
    todos: { type: Array },
    createdAt: { type: Date, default: () => new Date() },
  },
});

export const Todos = collection('todos', {
  schema: {
    title: String,
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: () => new Date() },
  },

  // mutators: optimistic — sync isomorphic bodies, applied locally now,
  // rebased on the authoritative result. pipeline: permission → schema →
  // check → mutate|run. mutate(doc, args) targets one doc (id resolved by
  // the framework), run(args) is arbitrary with ambient-privileged CRUD
  mutators: {
    add: {
      permission: (args, { user }) => !!user,
      schema: {
        title: String,
      },
      check({ title }) {
        if (!title.trim()) { throw new Error('title required'); }
      },
      run({ title }) {
        const todoID = Todos.insert({ title: title.trim() });
        Activity.insert({ type: 'added', todoID });
      },
    },

    toggle: {
      mutate(todo) {
        todo.completed = !todo.completed;
      },
    },

    setAllCompleted({ completed }) {
      Todos.update({}, todo => {
        todo.completed = completed;
      });
    },

    saveTitle: {
      schema: {
        id: String,
        title: String,
      },
      check({ title }) {
        if (!title.trim()) { throw new Error('title required'); }
      },
      mutate(todo, { title }) {
        todo.title = title.trim();
      },
    },

    delete({ id }) {
      Todos.remove(id);
      Activity.insert({ type: 'deleted', todoID: id });
    },

    clearCompleted: {
      throttle: 1000,
      run() {
        Todos.remove({ completed: true });
      },
    },
  },

  // the pub of pub/sub — inline at the small rung. wire address derives:
  // todos.all. at scale these move to collections/[name]/publications/
  publications: {
    all: {
      fields: ['title', 'completed', 'createdAt'],
      handler() {
        return Todos.find({});
      },
    },
  },

  // actions: promises to complete something on the server — async bodies,
  // no simulation, awaited at the call site. a simulated publish would show
  // a url that 404s until the server confirms, so it doesn't pretend
  actions: {
    publish: {
      throttle: 5000,
      // server reads await (storage I/O is real), writes never do — insert
      // buffers a command and returns its id, the transaction flushes at end
      async run() {
        const todos = await Todos.find({}, { sort: { createdAt: 1 } });
        const shareID = Shares.insert({ todos });
        return { url: `https://todos.example/list/${shareID}` };
      },
    },

    import: {
      schema: { url: String },
      async run({ url }) {
        const response = await fetch(url);
        const items = await response.json();
        for (const item of items) {
          Todos.insert({ title: item.title });
        }
        return { imported: items.length };
      },
    },
  },
});
