import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const VALID_LANGUAGES = ['zh', 'ja'] as const;

/**
 * 驗證 Authorization header 中的 access token，回傳已驗證的 user id。
 * 呼叫端絕不可信任 request body 中的 userId — 必須以此處回傳的 id 為準。
 */
async function getVerifiedUserId(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice('Bearer '.length);
  const supabase = createClient(SUPABASE_URL, ANON_KEY);

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;

  return data.user.id;
}

// GET - 獲取用戶語言偏好
export async function GET(request: NextRequest) {
  try {
    const verifiedUserId = await getVerifiedUserId(request);
    if (!verifiedUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestedUserId = request.nextUrl.searchParams.get('userId');
    if (requestedUserId && requestedUserId !== verifiedUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: request.headers.get('authorization')! } },
    });

    const { data, error } = await supabase
      .from('users_language_preferences')
      .select('preferred_language')
      .eq('user_id', verifiedUserId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({
      preferred_language: data?.preferred_language || 'zh',
    });
  } catch (error) {
    console.error('Error fetching language preference:', error);
    return NextResponse.json(
      { error: 'Failed to fetch language preference' },
      { status: 500 }
    );
  }
}

// POST - 設置用戶語言偏好
export async function POST(request: NextRequest) {
  try {
    const verifiedUserId = await getVerifiedUserId(request);
    if (!verifiedUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, preferredLanguage } = body;

    // body 帶了 userId 就必須與 token 身分相符，否則視為越權
    if (userId && userId !== verifiedUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!VALID_LANGUAGES.includes(preferredLanguage)) {
      return NextResponse.json(
        { error: `preferredLanguage must be one of: ${VALID_LANGUAGES.join(', ')}` },
        { status: 400 }
      );
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error: missing service role key' },
        { status: 500 }
      );
    }

    // 身分已驗證，此處才使用服務角色金鑰繞過 RLS
    const supabase = createClient(SUPABASE_URL, serviceRoleKey);

    const { error } = await supabase
      .from('users_language_preferences')
      .upsert(
        {
          user_id: verifiedUserId,
          preferred_language: preferredLanguage,
        },
        { onConflict: 'user_id' }
      )
      .select();

    if (error) {
      console.error('❌ Supabase error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw new Error(`Supabase error: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      preferred_language: preferredLanguage,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error setting language preference:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to set language preference' },
      { status: 500 }
    );
  }
}
