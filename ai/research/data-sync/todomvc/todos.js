import { collection } from '@semantic-ui/data';

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

  // no CRUD mutators. the component's direct db.todos writes — and
  // Todos.update(id, { $set }) / insert / remove from any plain JS — are the
  // write surface: optimistic, durable, on the wire, default-open auth at this
  // rung. named mutators are the graduation when a write needs a permission
  // gate, server validation, or a side effect (see invoices-table).

  // the pub of pub/sub — inline at the small rung. wire address derives:
  // todos.all. at scale, publications move to collections/todos/publications/
  publications: {
    all: {
      fields: ['title', 'completed', 'createdAt'],
      handler() {
        return Todos.find({});
      },
    },
  },

  // actions: promises to complete something on the server — async, no
  // simulation, awaited at the call site. 'share' not 'publish': publish is
  // the publication-registration verb (Todos.publish(name, def)), reserved
  actions: {
    share: {
      throttle: 5000,
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
