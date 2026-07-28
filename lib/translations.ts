// 中文課程數據
import chineseCourses from '../all_courses_corrected.json';
import japaneseCourses from '../all_courses_ja.json';
import chineseQuizzes from '../course_quizzes.json';
import japaneseQuizzes from '../course_quizzes_ja.json';

type Language = 'zh' | 'ja';

// 課程翻譯
export function getCourses(language: Language) {
  if (language === 'ja') {
    return japaneseCourses;
  }
  return chineseCourses;
}

// 題庫翻譯
export function getQuizzes(language: Language) {
  if (language === 'ja') {
    return japaneseQuizzes;
  }
  return chineseQuizzes;
}

// 界面文本翻譯
export const translations = {
  zh: {
    home: '首頁',
    courses: '實體課程',
    cards: '卡牌自學',
    quiz: '題庫',
    progress: '我的進度',
    certificate: '領取證書',
    title: '大豐貿易集團 AI 企業協作課程',
    subtitle1: '四週實體密集課程，掌握 Gemini 六大神器。',
    subtitle2: '從傳統辦公流程到 AI 驅動決策，完整蛻變。',
    subtitle3: '各地分公司同仁，亦可透過卡牌自學功能，進行無界限的網路學習，參與AI課程。',
    courseDesign: '課程設計',
    coursesCount: '個課程',
    coursePreparation: '課前準備',
    week: '第',
    weekSuffix: '週',
    login: '登入',
    signup: '註冊',
    logout: '登出',
    loggedIn: '已登入',
  },
  ja: {
    home: 'ホーム',
    courses: '実体講座',
    cards: 'カード学習',
    quiz: 'クイズ',
    progress: '進捗状況',
    certificate: '修了証書',
    title: 'ダフォン貿易グループ AI企業協働コース',
    subtitle1: '4週間の集中実体講座で、Geminiの6つの機能をマスター。',
    subtitle2: '従来のオフィスプロセスからAI駆動の意思決定へ、完全な変革。',
    subtitle3: '各地の支社の皆様は、カード学習機能を通じて、制限のないネットラーニングに参加し、AIコースに参加することができます。',
    courseDesign: 'コース設計',
    coursesCount: 'コース',
    coursePreparation: 'コース前準備',
    week: '第',
    weekSuffix: '週',
    login: 'ログイン',
    signup: '登録',
    logout: 'ログアウト',
    loggedIn: 'ログイン済み',
  },
};

export function t(key: string, language: Language): string {
  const lang = language === 'ja' ? 'ja' : 'zh';
  return (translations[lang] as any)[key] || key;
}
