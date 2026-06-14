import { postgres, syncServer } from '@semantic-ui/sync/server';
import { loadCollections } from '@semantic-ui/sync/server';

// registers schema, mutators, publications, search — then seals at listen().
// infrastructure only: domain content lives in collections/
await loadCollections('./collections');

syncServer({
  storage: postgres(process.env.DATABASE_URL),

  // app-provided capability checker — permission tokens resolve through it
  can({ session }, token) {
    return session.capabilities.includes(token);
  },
}).listen(4000);
