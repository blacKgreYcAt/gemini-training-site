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
 */
async function saveProgressToSupabase(userId: string, progress: UserProgress): Promise<boolean> {
  try {
    const { error } = await supabase.from('user_progress_full').upsert({
      user_id: userId,
      progress_data: progress,
      updated_at: new Date().toISOString()
    })

    if (error) throw error
    return true
  } catch (error) {
    console.error('保存Supabase進度失敗:', error)
    return false
  }
}

/**
 * 獲取進度（優先Supabase，備用localStorage）
 */
export async function getProgress(): Promise<UserProgress> {
  const userId = await getCurrentUserId()

  if (userId) {
    const remoteProgress = await fetchProgressFromSupabase(userId)
    if (remoteProgress) {
      syncProgressToLocalStorage(remoteProgress)
      return remoteProgress
    }
  }

  return getProgressFromLocalStorage()
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
  const progress = await getProgress()

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

  calculateCompletionRates(progress)
  await saveProgress(progress)
}

/**
 * 更新卡牌進度
 */
export async function updateCardsProgress(cardId: string, flipped: boolean = true): Promise<void> {
  const progress = await getProgress()

  progress.cardsProgress[cardId] = {
    viewed: true,
    flipped,
    viewedAt: new Date().toISOString()
  }

  calculateCompletionRates(progress)
  await saveProgress(progress)
}

/**
 * 更新題庫進度
 */
export async function updateQuizProgress(
  quizId: number,
  userAnswer: string,
  isCorrect: boolean
): Promise<void> {
  const progress = await getProgress()

  if (!progress.quizProgress) {
    progress.quizProgress = {}
  }

  progress.quizProgress[quizId] = {
    answered: true,
    userAnswer,
    isCorrect,
    answeredAt: new Date().toISOString()
  }

  calculateCompletionRates(progress)
  await saveProgress(progress)
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
