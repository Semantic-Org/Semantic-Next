import { getPlayground, updatePlayground, deletePlayground } from '../../../lib/data';
import { getSession } from '@auth/astro';

export const GET = async ({ params }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return new Response(null, { status: 400 });
  }
  const playground = await getPlayground(id);
  if (!playground) {
    return new Response(null, { status: 404 });
  }
  return new Response(JSON.stringify(playground), {
    headers: { 'Content-Type': 'application/json' },
  });
};


export const PUT = async ({ params, request }) => {
  const session = await getSession(request);
  if (!session) {
    return new Response(null, { status: 401 });
  }
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return new Response(null, { status: 400 });
  }
  const data = await request.json();
  const { title, files } = data;
  if (!title || !files) {
    return new Response(JSON.stringify({ message: 'Missing title or files' }), { status: 400 });
  }
  try {
    await updatePlayground(id, title, files, session.user.id);
    return new Response(null, { status: 204 });
  }
  catch (error) {
    if (error.message === 'Unauthorized') {
      return new Response(null, { status: 403 });
    }
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to update playground' }), { status: 500 });
  }
};


export const DELETE = async ({ params, request }) => {
  const session = await getSession(request);

  if (!session) {
      return new Response(null, { status: 401 }); // Unauthorized
  }

  const id = parseInt(params.id);

  if (isNaN(id)) {
    return new Response(null, { status: 400 });
  }

  try {
    await deletePlayground(id, session.user.id);
    return new Response(null, { status: 204 }); // No Content
  }
  catch (error) {
    if (error.message === 'Unauthorized') {
        return new Response(null, { status: 403 });  // Forbidden
    }
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to delete playground' }), { status: 500 });
  }
}
