/**
 * 進度追踪工具
 */

export interface UserProgress {
  userName?: string;
  email?: string;

  slidesProgress: {
    [courseId: string]: {
      totalPages: number;
      completedPages: number[];
      lastViewedPage: number;
      completedAt?: string;
    };
  };

  cardsProgress: {
    [cardId: string]: {
      viewed: boolean;
      flipped: boolean;
      viewedAt: string;
    };
  };

  quizProgress: {
    [quizId: number]: {
      answered: boolean;
      userAnswer: string;
      isCorrect: boolean;
      answeredAt: string;
    };
  };

  statistics: {
    slidesCompletionRate: number;
    cardsCompletionRate: number;
    quizCompletionRate: number;
    quizAccuracy: number;
    totalLearningHours: number;
    certificateEarned: boolean;
    certificateEarnedAt?: string;
    certificateNumber?: string;
  };
}

/**
 * 初始化用戶進度
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
  };
}

/**
 * 獲取進度數據
 */
export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return initializeProgress();

  const saved = localStorage.getItem('userProgress');
  if (!saved) {
    const initial = initializeProgress();
    localStorage.setItem('userProgress', JSON.stringify(initial));
    return initial;
  }

  return JSON.parse(saved);
}

/**
 * 保存進度數據
 */
export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('userProgress', JSON.stringify(progress));
}

/**
 * 更新投影片進度
 */
export function updateSlidesProgress(
  courseId: string,
  pageIndex: number,
  totalPages: number
): void {
  const progress = getProgress();

  if (!progress.slidesProgress[courseId]) {
    progress.slidesProgress[courseId] = {
      totalPages,
      completedPages: [],
      lastViewedPage: pageIndex
    };
  }

  if (!progress.slidesProgress[courseId].completedPages.includes(pageIndex)) {
    progress.slidesProgress[courseId].completedPages.push(pageIndex);
  }

  progress.slidesProgress[courseId].lastViewedPage = pageIndex;

  if (progress.slidesProgress[courseId].completedPages.length === totalPages) {
    progress.slidesProgress[courseId].completedAt = new Date().toISOString();
  }

  calculateCompletionRates(progress);
  saveProgress(progress);
}

/**
 * 更新卡牌進度
 */
export function updateCardsProgress(cardId: string, flipped: boolean = true): void {
  const progress = getProgress();

  progress.cardsProgress[cardId] = {
    viewed: true,
    flipped,
    viewedAt: new Date().toISOString()
  };

  calculateCompletionRates(progress);
  saveProgress(progress);
}

/**
 * 更新題庫進度
 */
export function updateQuizProgress(
  quizId: number,
  userAnswer: string,
  isCorrect: boolean
): void {
  const progress = getProgress();

  if (!progress.quizProgress) {
    progress.quizProgress = {};
  }

  progress.quizProgress[quizId] = {
    answered: true,
    userAnswer,
    isCorrect,
    answeredAt: new Date().toISOString()
  };

  calculateCompletionRates(progress);
  saveProgress(progress);
}

/**
 * 計算完成率
 */
export function calculateCompletionRates(progress: UserProgress): void {
  // 投影片完成率
  const slidesCourses = Object.values(progress.slidesProgress);
  if (slidesCourses.length > 0) {
    const completedSlides = slidesCourses.filter(
      (c) => c.completedPages.length === c.totalPages
    ).length;
    progress.statistics.slidesCompletionRate =
      (completedSlides / slidesCourses.length) * 100;
  }

  // 卡牌完成率（Week 0-10: 37 + 18 = 55 張卡牌）
  const totalCards = 55;
  const flippedCards = Object.values(progress.cardsProgress).filter(
    (c) => c.flipped
  ).length;
  progress.statistics.cardsCompletionRate = (flippedCards / totalCards) * 100;

  // 題庫完成率（100 題）
  const totalQuestions = 100;
  const answeredQuestions = Object.values(progress.quizProgress).filter(
    (q) => q.answered
  ).length;
  progress.statistics.quizCompletionRate = (answeredQuestions / totalQuestions) * 100;

  // 題庫正確率
  if (answeredQuestions > 0) {
    const correctAnswers = Object.values(progress.quizProgress).filter(
      (q) => q.isCorrect
    ).length;
    progress.statistics.quizAccuracy = (correctAnswers / answeredQuestions) * 100;
  }
}

/**
 * 檢查證書資格
 */
export function checkCertificateEligibility(progress: UserProgress): boolean {
  const stats = progress.statistics;
  return (
    stats.slidesCompletionRate === 100 &&
    stats.cardsCompletionRate === 100 &&
    stats.quizCompletionRate === 100 &&
    stats.quizAccuracy >= 80
  );
}

/**
 * 重置進度（測試用）
 */
export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('userProgress');
}
