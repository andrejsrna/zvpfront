import { NextResponse } from 'next/server';

type NewsletterPayload = {
  email?: string;
  acceptPrivacy?: boolean;
};

export async function POST(request: Request) {
  try {
    const { email, acceptPrivacy }: NewsletterPayload = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;
    const listIdRaw = process.env.BREVO_LIST_ID;

    if (!apiKey) {
      throw new Error('Missing BREVO_API_KEY');
    }

    const listId = listIdRaw ? Number(listIdRaw) : undefined;
    if (listIdRaw && !Number.isFinite(listId)) {
      throw new Error('BREVO_LIST_ID must be a number');
    }

    // Brevo: Create/Update contact and add to list
    // Docs: POST https://api.brevo.com/v3/contacts
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        updateEnabled: true,
        listIds: listId ? [listId] : undefined,
        // Keep payload minimal to avoid needing custom attributes configured in Brevo
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Brevo error: HTTP ${response.status} ${response.statusText}${text ? `\n${text}` : ''}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json({ error: 'Failed to process signup' }, { status: 500 });
  }
}
