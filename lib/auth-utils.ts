import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  name?: string
}

export async function signIn(email: string, password: string) {
  console.log('🔐 Attempting sign in with:', { email, password: '***' })

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error('❌ Sign in error:', {
      status: error.status,
      message: error.message,
      name: error.name
    })
    throw new Error(error.message || 'Login failed')
  }

  console.log('✅ Sign in successful:', data.user?.email)
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name
  }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  try {
    // 檢查環境變數
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Supabase 環境變數未設置:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'
      })
      callback(null)
      return { unsubscribe: () => {} }
    }

    console.log('✅ Supabase 環境變數已設置，正在連接...')

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', { event, user: session?.user?.email })
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name
        })
      } else {
        callback(null)
      }
    })
    console.log('✅ Supabase onAuthStateChange 監聽器已設置')
    return subscription
  } catch (error) {
    console.error('❌ Supabase 連接失敗:', error)
    callback(null)
    return { unsubscribe: () => {} }
  }
}
