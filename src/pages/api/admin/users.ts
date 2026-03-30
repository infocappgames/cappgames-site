import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';
import { db } from '../../../db/index';
import { users } from '../../../db/schema';
import { desc } from 'drizzle-orm';

export const GET: APIRoute = async ({ request }) => {
  const session = await getSession(request);
  const role = (session?.user as any)?.role;

  if (!session || role !== 'Owner') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const allUsers = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt));

  return new Response(JSON.stringify(allUsers), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
