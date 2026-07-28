import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function createAuthenticatedClient(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
    }
  );
}

// GET - 獲取用戶語言偏好
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const supabase = createAuthenticatedClient(request);

    const { data, error } = await supabase
      .from('users_language_preferences')
      .select('preferred_language')
      .eq('user_id', userId)
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
    const body = await request.json();
    const { userId, preferredLanguage } = body;

    if (!userId || !preferredLanguage) {
      return NextResponse.json(
        { error: 'userId and preferredLanguage are required' },
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

    // 使用服務角色金鑰來繞過 RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      serviceRoleKey
    );

    console.log('Attempting to upsert:', { userId, preferredLanguage });

    const { data, error } = await supabase
      .from('users_language_preferences')
      .upsert(
        {
          user_id: userId,
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
        hint: error.hint
      });
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log('✅ Successfully upserted:', data);
    return NextResponse.json({
      success: true,
      preferred_language: preferredLanguage,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error setting language preference:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to set language preference', details: errorMessage },
      { status: 500 }
    );
  }
}
