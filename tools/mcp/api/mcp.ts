import { handler } from '../src/http.js';

// Node.js runtime required for new Function() in template validation
export const config = { runtime: 'nodejs' };

export default async function(req: Request): Promise<Response> {
  return handler(req);
}
