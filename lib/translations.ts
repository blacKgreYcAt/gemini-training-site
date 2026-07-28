type Language = 'zh' | 'ja';

// 臨時使用本地數據，日後可連接 Supabase 獲取翻譯
import { courseData } from './course-data';

export function getCourses(language: Language) {
  // 暫時只返回中文數據，日文翻譯連接 Supabase
  return courseData;
}

export function getQuizzes(language: Language) {
  // 暫時只返回中文數據，日文翻譯連接 Supabase
  return [];
}

// 界面文本翻譯
export const translations = {
  zh: {
    // Navigation & Auth
    home: '首頁',
    courses: '實體課程',
    cards: '卡牌自學',
    quiz: '題庫',
    progress: '我的進度',
    certificate: '領取證書',
    login: '登入',
    signup: '註冊',
    logout: '登出',
    loggedIn: '已登入',

    // Home Page
    title: '大豐貿易集團 AI 企業協作課程',
    subtitle1: '四週實體密集課程，掌握 Gemini 六大神器。',
    subtitle2: '從傳統辦公流程到 AI 驅動決策，完整蛻變。',
    subtitle3: '各地分公司同仁，亦可透過卡牌自學功能，進行無界限的網路學習，參與AI課程。',
    courseDesign: '課程設計',
    coursesCount: '個課程',
    coursePreparation: '課前準備',
    week: '第',
    weekSuffix: '週',
    viewDetails: '查看詳情',
    advancedTips: '⭐ 進階使用 Tips',
    advancedDesc: '深入掌握 Gemini 高階功能，打造專屬 AI 助手',

    // Cards Page
    backToHome: '← 返回首頁',
    cardSelfStudy: '卡牌自學',
    searchPlaceholder: '搜尋卡片...',
    all: '全部',
    completed: '已完成',
    currentCard: '目前卡片',
    noCardsFound: '找不到相符的卡片',
    resetFilters: '重置篩選',
    markComplete: '標記為完成',

    // Quiz Page
    quizTitle: '題庫',
    question: '題目',
    answer: '答案',
    submit: '提交',
    correct: '正確',
    incorrect: '錯誤',

    // Progress & Certificate
    myProgress: '我的進度',
    certificate: '領取證書',
  },
  ja: {
    // Navigation & Auth
    home: 'ホーム',
    courses: '実体講座',
    cards: 'カード学習',
    quiz: 'クイズ',
    progress: '進捗状況',
    certificate: '修了証書',
    login: 'ログイン',
    signup: '登録',
    logout: 'ログアウト',
    loggedIn: 'ログイン済み',

    // Home Page
    title: 'ダフォン貿易グループ AI企業協働コース',
    subtitle1: '4週間の集中実体講座で、Geminiの6つの機能をマスター。',
    subtitle2: '従来のオフィスプロセスからAI駆動の意思決定へ、完全な変革。',
    subtitle3: '各地の支社の皆様は、カード学習機能を通じて、制限のないネットラーニングに参加し、AIコースに参加することができます。',
    courseDesign: 'コース設計',
    coursesCount: 'コース',
    coursePreparation: 'コース前準備',
    week: '第',
    weekSuffix: '週',
    viewDetails: '詳細を表示',
    advancedTips: '⭐ 高度な使用ヒント',
    advancedDesc: 'Geminiの高度な機能を習得して、カスタマイズされたAIアシスタントを構築します',

    // Cards Page
    backToHome: '← ホームに戻る',
    cardSelfStudy: 'カード学習',
    searchPlaceholder: 'カードを検索...',
    all: 'すべて',
    completed: '完了',
    currentCard: '現在のカード',
    noCardsFound: '一致するカードが見つかりません',
    resetFilters: 'フィルタをリセット',
    markComplete: '完了としてマーク',

    // Quiz Page
    quizTitle: 'クイズ',
    question: '質問',
    answer: '答え',
    submit: '送信',
    correct: '正解',
    incorrect: '不正解',

    // Progress & Certificate
    myProgress: '進捗状況',
    certificate: '修了証書',
  },
};

export function t(key: string, language: Language): string {
  const lang = language === 'ja' ? 'ja' : 'zh';
  return (translations[lang] as any)[key] || key;
}
