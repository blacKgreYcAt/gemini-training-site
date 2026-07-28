'use client'

export default function DebugPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1>🔍 環境診斷</h1>

      <h2>環境變數</h2>
      <pre style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
{`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ 未設置'}
NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}... (${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 已設置' : '❌ 未設置'})`}
      </pre>

      <h2>症狀</h2>
      <ul>
        <li>❌ 沒有 Supabase API 請求</li>
        <li>❌ onAuthStateChange 沒有觸發</li>
        <li>❌ ProtectedRoute 不起作用</li>
      </ul>

      <h2>修復步驟</h2>
      <ol>
        <li>進入 Vercel 儀表板 → 你的專案</li>
        <li>點擊 Settings → Environment Variables</li>
        <li>確認這兩個變數已設置：
          <ul>
            <li><code>NEXT_PUBLIC_SUPABASE_URL</code></li>
            <li><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
          </ul>
        </li>
        <li>點擊 Deployments → 找到最新部署</li>
        <li>點擊「Redeploy」</li>
        <li>等待部署完成（~1 分鐘）</li>
      </ol>
    </div>
  )
}
