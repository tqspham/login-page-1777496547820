import { getSupabase } from '@/lib/supabase';

export async function POST(request: Request): Promise<Response> {
  const initSecret = request.headers.get('x-init-secret');
  const expectedSecret = process.env.INIT_SECRET;

  if (!initSecret || initSecret !== expectedSecret) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Unauthorized' }),
      { status: 403 }
    );
  }

  const initSql = process.env.INIT_SQL;
  if (!initSql) {
    return new Response(
      JSON.stringify({ ok: false, error: 'INIT_SQL not provided' }),
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabase();
    const { error } = await supabase.rpc('exec_sql', { sql: initSql });
    if (error) {
      return new Response(
        JSON.stringify({ ok: false, error: error.message }),
        { status: 400 }
      );
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500 }
    );
  }
}