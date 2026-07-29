import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('🔐 Testing Supabase Auth with:', { email, password: '***' })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // 嘗試登入
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('Auth response:', {
      success: !error,
      user: data?.user?.email,
      error: error?.message,
    })

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          details: {
            status: error.status,
            code: error.name,
          },
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user: data.user?.email,
      session: !!data.session,
    })
  } catch (err: any) {
    console.error('❌ Auth test error:', err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}
