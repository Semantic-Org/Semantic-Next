import { db, sql } from 'astro:db';

const playground = db.tables.Playgrounds;
const files = db.tables.Files;

export async function getPlayground(id) {
  const playground = await db.select().from(playground).where(sql`${playground.id} = ${id}`).first();

  if (!playground) {
    return undefined;
  }

  const files = await db.select().from(files).where(sql`${files.playgroundId} = ${id}`).all();
  return {
    ...playground,
    files: files,
  };
}


export async function getPlaygroundsForUser(userId) {
  return await db.select().from(playground).where(sql`${playground.userId} = ${userId}`).all();
}


export async function createPlayground(userId, title, files) {
  const result = await db.insert(playground).values({ userId, title, version: 1 }).returning(['id']).run();
  const playgroundId = result[0].id;

  if (!playgroundId) {
    throw new Error("Could not create playground");
  }

  const fileValues = files.map(file => ({
    playgroundId: playgroundId,
    filename: file.filename,
    content: file.content,
  }));

  await db.insert(files).values(fileValues).run();
  return playgroundId;
}


export async function updatePlayground(id, title, files, userId) {
  const playground = await getPlayground(id);

  if (!playground) {
    throw new Error("Playground not found");
  }

  if (playground.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const nextVersion = (playground.version ?? 0) + 1;
  await db.update(playground).set({
    title,
    version: nextVersion
  }).where(sql`${playground.id} = ${id}`).run();

  await db.delete(files).where(sql`${files.playgroundId} = ${id}`).run();

  const newFileValues = files.map(file => ({
    playgroundId: id,
    filename: file.filename,
    content: file.content,
  }));

  await db.insert(files).values(newFileValues).run();
}


export async function deletePlayground(id, userId) {
  const playground = await getPlayground(id);

  if (!playground) {
      throw new Error("Playground not found");
  }

  if (playground.userId !== userId) {
      throw new Error("Unauthorized");
  }

  await db.delete(files).where(sql`${files.playgroundId} = ${id}`).run();
  await db.delete(playground).where(sql`${playground.id} = ${id}`).run();
}
