import { Landings } from '../landings.js';

// late attachment: open during module load, sealed at listen(). one file
// per operation — adding a mutator never touches a shared file
Landings.mutator('create', {
  permission: (args, { user }) => !!user,
  schema: { vessel: String, port: String },
  check({ vessel }) {
    if (!vessel.trim()) { throw new Error('vessel required'); }
  },
  run({ vessel, port }) {
    return Landings.insert({ vessel: vessel.trim(), port });
  },
});
