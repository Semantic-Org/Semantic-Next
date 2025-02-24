import { defineDb, defineTable, column } from 'astro:db';

export const Playgrounds = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoincrement: true }),
    exampleId: column.text(),
    title: column.text(),
    description: column.text({ optional: true }),
    userId: column.text(),
    version: column.number({ default: 1 }),
    public: column.boolean({ default: false}),
  },
});

export const Files = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoincrement: true }),
    playgroundId: column.number({ default: 1 }),
    filename: column.text(),
    content: column.text(),
  },
  indexes: [
    { on: ['playgroundId'] },
  ]
});

export default defineDb({
  tables: { Playgrounds, Files },
});
