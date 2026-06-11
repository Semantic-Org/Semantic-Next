import { Invoices } from '../invoices.js';

// late attachment: open during module load, sealed at listen(). one file
// per operation — adding a mutator never touches a shared file
Invoices.mutator('create', {
  permission: (args, { user }) => !!user,
  schema: { client: String, total: Number },
  check({ client }) {
    if (!client.trim()) { throw new Error('client required'); }
  },
  run({ client, total }) {
    return Invoices.insert({ client: client.trim(), total });
  },
});
