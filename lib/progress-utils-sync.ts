/**
 * 進度追踪工具 - 支持雲端同步
 * 優先級：Supabase > localStorage
 */

import { supabase } from './supabase'

export interface UserProgress {
  userName?: string
  email?: string

  slidesProgress: {
    [courseId: string]: {
      totalPages: number
      completedPages: number[]
      lastViewedPage: number
      completedAt?: string
    }
  }

  cardsProgress: {
    [cardId: string]: {
      viewed: boolean
      flipped: boolean
      viewedAt: string
    }
  }

  quizProgress: {
    [quizId: number]: {
      answered: boolean
      userAnswer: string
      isCorrect: boolean
      answeredAt: string
    }
  }

  statistics: {
    slidesCompletionRate: number
    cardsCompletionRate: number
    quizCompletionRate: number
    quizAccuracy: number
    totalLearningHours: number
    certificateEarned: boolean
    certificateEarnedAt?: string
    certificateNumber?: string
    certificateGeneratedAt?: string
  }

  lastSyncedAt?: string
}

/**
 * 初始化進度
 */
export function initializeProgress(): UserProgress {
  return {
    slidesProgress: {},
    cardsProgress: {},
    quizProgress: {},
    statistics: {
      slidesCompletionRate: 0,
      cardsCompletionRate: 0,
      quizCompletionRate: 0,
      quizAccuracy: 0,
      totalLearningHours: 0,
      certificateEarned: false
    }
  }
}

/**
 * 獲取用戶ID（來自auth session）
 */
async function getCurrentUserId(): Promise<string | null> {
  try {
    const {
      data: { session }
    } = await supabase.auth.getSession()
    return session?.user?.id || null
  } catch {
    return null
  }
}

/**
 * 從Supabase讀取進度
 */
async function fetchProgressFromSupabase(userId: string): Promise<UserProgress | null> {
  try {
    const { data, error } = await supabase
      .from('user_progress_full')
      .select('progress_data')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data?.progress_data || null
  } catch (error) {
    console.error('讀取Supabase進度失敗:', error)
    return null
  }
}

/**
 * 保存進度到Supabase
 * 跨平台進度同步：支持在不同設備間（電腦、手機）同步學習進度
 */
async function saveProgressToSupabase(userId: string, progress: UserProgress): Promise<boolean> {
  try {
    const { error } = await supabase.from('user_progress_full').upsert({
      user_id: userId,
      progress_data: progress,
      updated_at: new Date().toISOString()
    })

    if (error) {
      console.warn('⚠️ Supabase 進度同步失敗:', error.message)
      console.info('💡 如果是表不存在，請在 Supabase SQL 編輯器運行 supabase/migrations/create_progress_table.sql')
      return false
    }
    console.debug('✅ 進度已同步到 Supabase')
    return true
  } catch (error: any) {
    console.warn('⚠️ Supabase 連接失敗:', error.message)
    console.info('💡 將使用 localStorage 備用方案保存進度')
    return false
  }
}

/**
 * 獲取進度（優先Supabase，備用localStorage）
 */
export async function getProgress(): Promise<UserProgress> {
  const localProgress = getProgressFromLocalStorage()
  const userId = await getCurrentUserId()
  if (!userId) return localProgress

  const remoteProgress = await fetchProgressFromSupabase(userId)
  if (!remoteProgress) return localProgress

  // 先前遠端一律覆蓋本地，導致尚未推送的本地作答會被舊的遠端資料蓋掉。
  // 改以 lastSyncedAt 比較，較新的一方勝出。
  const localTime = Date.parse(localProgress.lastSyncedAt ?? '') || 0
  const remoteTime = Date.parse(remoteProgress.lastSyncedAt ?? '') || 0

  if (localTime > remoteTime) {
    // 本地較新：保留本地，並把它補推到遠端
    scheduleRemoteSync()
    return localProgress
  }

  syncProgressToLocalStorage(remoteProgress)
  return remoteProgress
}

/**
 * 保存進度（同時保存到Supabase和localStorage）
 */
export async function saveProgress(progress: UserProgress): Promise<void> {
  progress.lastSyncedAt = new Date().toISOString()

  saveProgressToLocalStorage(progress)

  const userId = await getCurrentUserId()
  if (userId) {
    await saveProgressToSupabase(userId, progress)
  }
}

/* ------------------------------------------------------------------ *
 * 本地優先的進度寫入
 *
 * 先前每次 update*Progress 都會 await getProgress()，登入時那會先向
 * Supabase 取遠端進度並「覆寫 localStorage」，再加上新資料寫回去。
 * 由於呼叫端一律沒有 await，連續作答時第 N+1 次的讀取會在第 N 次的
 * 寫入落地前發動，抓到尚未更新的遠端資料並蓋掉剛存好的本地進度，
 * 造成答題紀錄逐筆遺失（未登入時因為不走網路，幾乎看不到這個現象）。
 *
 * 改法：本地寫入改為同步且具權威性，遠端同步改為序列化的背景推送。
 * ------------------------------------------------------------------ */

/** 對 localStorage 中的進度做一次不可分割的 read-modify-write */
function mutateProgressLocally(mutate: (progress: UserProgress) => void): UserProgress {
  const progress = getProgressFromLocalStorage()
  mutate(progress)
  calculateCompletionRates(progress)
  progress.lastSyncedAt = new Date().toISOString()
  saveProgressToLocalStorage(progress)
  return progress
}

/** 序列化遠端寫入，避免多個 upsert 交錯覆蓋 */
let remoteSyncChain: Promise<void> = Promise.resolve()
let pendingSyncTimer: ReturnType<typeof setTimeout> | null = null

function queueRemoteSync(): Promise<void> {
  remoteSyncChain = remoteSyncChain
    .then(async () => {
      const userId = await getCurrentUserId()
      if (!userId) return
      // 推送當下最新的本地狀態，而非呼叫當時的快照
      await saveProgressToSupabase(userId, getProgressFromLocalStorage())
    })
    .catch((error) => {
      console.warn('⚠️ 進度同步失敗，本地進度不受影響:', error)
    })
  return remoteSyncChain
}

/** 合併短時間內的連續操作（例如快速翻卡）成一次遠端寫入 */
function scheduleRemoteSync(): void {
  if (typeof window === 'undefined') return
  if (pendingSyncTimer) clearTimeout(pendingSyncTimer)
  pendingSyncTimer = setTimeout(() => {
    pendingSyncTimer = null
    void queueRemoteSync()
  }, 800)
}

// 離開頁面前把待同步的進度送出，避免最後幾筆只留在本機
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => {
    if (pendingSyncTimer) {
      clearTimeout(pendingSyncTimer)
      pendingSyncTimer = null
      void queueRemoteSync()
    }
  })
}

/**
 * LocalStorage 輔助函數
 */
function getProgressFromLocalStorage(): UserProgress {
  if (typeof window === 'undefined') return initializeProgress()

  const saved = localStorage.getItem('userProgress')
  if (!saved) {
    const initial = initializeProgress()
    localStorage.setItem('userProgress', JSON.stringify(initial))
    return initial
  }

  return JSON.parse(saved)
}

function saveProgressToLocalStorage(progress: UserProgress): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('userProgress', JSON.stringify(progress))
}

function syncProgressToLocalStorage(progress: UserProgress): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('userProgress', JSON.stringify(progress))
}

/**
 * 更新投影片進度
 */
export async function updateSlidesProgress(
  courseId: string,
  pageIndex: number,
  totalPages: number
): Promise<void> {
  mutateProgressLocally((progress) => {
    if (!progress.slidesProgress[courseId]) {
      progress.slidesProgress[courseId] = {
        totalPages,
        completedPages: [],
        lastViewedPage: pageIndex
      }
    }

    if (!progress.slidesProgress[courseId].completedPages.includes(pageIndex)) {
      progress.slidesProgress[courseId].completedPages.push(pageIndex)
    }

    progress.slidesProgress[courseId].lastViewedPage = pageIndex

    if (progress.slidesProgress[courseId].completedPages.length === totalPages) {
      progress.slidesProgress[courseId].completedAt = new Date().toISOString()
    }
  })

  scheduleRemoteSync()
}

/**
 * 更新卡牌進度
 */
export async function updateCardsProgress(cardId: string, flipped: boolean = true): Promise<void> {
  mutateProgressLocally((progress) => {
    progress.cardsProgress[cardId] = {
      viewed: true,
      flipped,
      viewedAt: new Date().toISOString()
    }
  })

  scheduleRemoteSync()
}

/**
 * 更新題庫進度
 */
export async function updateQuizProgress(
  quizId: number,
  userAnswer: string,
  isCorrect: boolean
): Promise<void> {
  mutateProgressLocally((progress) => {
    if (!progress.quizProgress) {
      progress.quizProgress = {}
    }

    progress.quizProgress[quizId] = {
      answered: true,
      userAnswer,
      isCorrect,
      answeredAt: new Date().toISOString()
    }
  })

  scheduleRemoteSync()
}

/**
 * 計算完成率
 */
export function calculateCompletionRates(progress: UserProgress): void {
  const slidesCourses = Object.values(progress.slidesProgress)
  if (slidesCourses.length > 0) {
    const completedSlides = slidesCourses.filter((c) => c.completedPages.length === c.totalPages)
      .length
    progress.statistics.slidesCompletionRate = (completedSlides / slidesCourses.length) * 100
  }

  const totalCards = 55
  const flippedCards = Object.values(progress.cardsProgress).filter((c) => c.flipped).length
  progress.statistics.cardsCompletionRate = (flippedCards / totalCards) * 100

  const totalQuestions = 100
  const answeredQuestions = Object.values(progress.quizProgress).filter((q) => q.answered).length
  progress.statistics.quizCompletionRate = (answeredQuestions / totalQuestions) * 100

  if (answeredQuestions > 0) {
    const correctAnswers = Object.values(progress.quizProgress).filter((q) => q.isCorrect).length
    progress.statistics.quizAccuracy = (correctAnswers / answeredQuestions) * 100
  }
}

/**
 * 檢查證書資格
 */
export function checkCertificateEligibility(progress: UserProgress): boolean {
  const stats = progress.statistics
  return (
    stats.slidesCompletionRate === 100 &&
    stats.cardsCompletionRate === 100 &&
    stats.quizCompletionRate === 100 &&
    stats.quizAccuracy >= 80
  )
}

/**
 * 重置進度（測試用）
 */
export async function resetProgress(): Promise<void> {
  if (typeof window === 'undefined') return
  localStorage.removeItem('userProgress')

  const userId = await getCurrentUserId()
  if (userId) {
    await supabase.from('user_progress_full').delete().eq('user_id', userId)
  }
}
