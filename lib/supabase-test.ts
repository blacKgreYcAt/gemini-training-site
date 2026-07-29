import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

console.log('🔍 Supabase 配置檢查:')
console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? '✅ 已設置' : '❌ 未設置')
console.log('Service Key:', supabaseServiceKey ? '✅ 已設置' : '❌ 未設置')

async function testAuth() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    console.log('\n🧪 測試登入...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'benjaminchu@tfg.com.tw',
      password: '123456',
    })

    if (error) {
      console.log('❌ 登入失敗')
      console.log('錯誤代碼:', error.code)
      console.log('錯誤信息:', error.message)
      console.log('錯誤詳情:', error)
      return
    }

    console.log('✅ 登入成功')
    console.log('用戶:', data.user?.email)
  } catch (err: any) {
    console.log('❌ 發生異常:', err.message)
  }
}

testAuth()
