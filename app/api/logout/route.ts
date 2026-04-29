import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  const response = NextResponse.redirect(new URL('/', 'http://localhost'));
  response.cookies.delete('userId');
  return response;
}
