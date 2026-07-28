import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

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

    const { data, error } = await supabase
      .from('users_language_preferences')
      .select('preferred_language')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({
      preferred_language: data?.preferred_language || 'en',
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
      throw error;
    }

    return NextResponse.json({
      success: true,
      preferred_language: preferredLanguage,
    });
  } catch (error) {
    console.error('Error setting language preference:', error);
    return NextResponse.json(
      { error: 'Failed to set language preference' },
      { status: 500 }
    );
  }
}
