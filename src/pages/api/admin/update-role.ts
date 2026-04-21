import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';
import { db } from '../../../db/index';
import { users } from '../../../db/schema';
import { eq } from 'drizzle-orm';

const VALID_ROLES = ['Owner', 'Moderator', 'Writer', 'Player'] as const;

export const POST: APIRoute = async ({ request }) => {
  const session = await getSession(request);
  const role = (session?.user as any)?.role;

  if (!session || role !== 'Owner') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { email?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { email, role: newRole } = body;

  if (!email || !newRole) {
    return new Response(JSON.stringify({ error: 'Missing email or role' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!VALID_ROLES.includes(newRole as any)) {
    return new Response(JSON.stringify({ error: 'Invalid role' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = await db.update(users).set({ role: newRole }).where(eq(users.email, email));
    if (result.rowsAffected === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Database error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
