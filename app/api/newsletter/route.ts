import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, acceptPrivacy } = await request.json();

    const response = await fetch(`${process.env.WORDPRESS_API_URL}/wp/v2/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WORDPRESS_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        title: email,
        status: 'publish',
        meta: {
          email: email,
          privacy_accepted: acceptPrivacy,
          signup_date: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save email');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json(
      { error: 'Failed to process signup' },
      { status: 500 }
    );
  }
} 