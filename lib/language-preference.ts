/**
 * 語言偏好的跨裝置同步
 *
 * 與 progress-utils-sync 相同策略：前端直接帶著使用者自己的 session 讀寫
 * Supabase，由 RLS 保證只能存取自己的那一列。不經過 API 路由，也不需要
 * service role key。
 *
 * localStorage 仍是即時來源（避免載入時閃一下語言），Supabase 則負責讓
 * 偏好跟著帳號走 —— 換手機、換平板登入後會自動套用。
 */

import { supabase } from './supabase'

export type Language = 'zh' | 'ja'

export const LANGUAGE_STORAGE_KEY = 'preferred_language'

export function isLanguage(value: unknown): value is Language {
  return value === 'zh' || value === 'ja'
}

export function readLocalLanguage(): Language | null {
  if (typeof window === 'undefined') return null
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return isLanguage(saved) ? saved : null
}

export function writeLocalLanguage(language: Language): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
}

async function getUserId(): Promise<string | null> {
  try {
    const {
      data: { session }
    } = await supabase.auth.getSession()
    return session?.user?.id ?? null
  } catch {
    return null
  }
}

/**
 * 讀取帳號上儲存的語言偏好。
 * 未登入、尚未設定過、或連線失敗時回傳 null —— 呼叫端應退回本地值。
 */
export async function fetchRemoteLanguage(): Promise<Language | null> {
  const userId = await getUserId()
  if (!userId) return null

  try {
    const { data, error } = await supabase
      .from('users_language_preferences')
      .select('preferred_language')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.warn('⚠️ 讀取語言偏好失敗，改用本地設定:', error.message)
      return null
    }

    return isLanguage(data?.preferred_language) ? data.preferred_language : null
  } catch (error) {
    console.warn('⚠️ 語言偏好連線失敗，改用本地設定:', error)
    return null
  }
}

/**
 * 將語言偏好寫回帳號。失敗不影響本地已生效的語言設定。
 */
export async function saveRemoteLanguage(language: Language): Promise<boolean> {
  const userId = await getUserId()
  if (!userId) return false

  try {
    const { error } = await supabase
      .from('users_language_preferences')
      .upsert({ user_id: userId, preferred_language: language }, { onConflict: 'user_id' })

    if (error) {
      console.warn('⚠️ 語言偏好同步失敗，本地設定仍然生效:', error.message)
      console.info(
        '💡 若錯誤指出資料表不存在，請在 Supabase SQL 編輯器執行 supabase/migrations/create_language_preferences_table.sql'
      )
      return false
    }

    return true
  } catch (error) {
    console.warn('⚠️ 語言偏好連線失敗，本地設定仍然生效:', error)
    return false
  }
}
