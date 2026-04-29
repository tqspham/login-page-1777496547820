import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json() as LoginRequest;
  const { emailOrUsername, password } = body;

  if (!emailOrUsername || !password) {
    return NextResponse.json(
      { success: false, error: 'Missing credentials' },
      { status: 400 }
    );
  }

  try {
    const { data: user, error: userError } = await supabase
      .from('login_page_1777496547820_users')
      .select('id, email, username, password_hash')
      .or(`email.eq.${emailOrUsername},username.eq.${emailOrUsername}`)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const passwordMatch = await verifyPassword(
      password,
      user.password_hash as string
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { success: true, userId: user.id },
      { status: 200 }
    );

    response.cookies.set('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

async function verifyPassword(
  plainPassword: string,
  hash: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainPassword);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex === hash;
}
