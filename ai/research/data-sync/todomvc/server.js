import { memoryStorage, syncServer } from '@semantic-ui/sync/server';

// registers the collection's publications and operations
import './todos.js';

syncServer({
  storage: memoryStorage(), // postgres(url) in production
}).listen(4000);
