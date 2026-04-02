import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const { name, email, reason, message } = await request.json();

  if (!name || !email || !reason || !message) {
    return new Response(JSON.stringify({ error: 'Missing fields.' }), { status: 400 });
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'CAPP GAMES Contact <contact@capp-games.com>',
      to: 'infocappgames@gmail.com',
      reply_to: email,
      subject: `[Contact Form] ${reason} — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nReason: ${reason}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Failed to send email.' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
