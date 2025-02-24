import { getSession } from '@auth/astro';
import { createPlayground } from '../../../lib/data';

export const POST = async ({ request }) => {
  const session = await getSession(request);

  if (!session) {
    return new Response(null, { status: 401 });
  }

  const data = await request.json();
  const { title, files } = data;

  if (!title || !files) {
    return new Response(JSON.stringify({ message: 'Missing title or files' }), { status: 400 });
  }

  try {
    const id = await createPlayground(session.user.id, title, files);
    return new Response(JSON.stringify({ id }), { status: 201 });
  }
  catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to create playground' }), { status: 500 });
  }
};
