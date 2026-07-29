// 中文課程數據
import { courseData as chineseCourses } from './course-data';
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
    companyName: '大豐貿易集團',
    module: '模組',
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
    cardCompleted: '✓ 已完成',
    cardNotCompleted: '未完成',
    cardAnswer: '解答',
    cardQuestion: '問題',
    cardFlipBack: '點擊翻回',
    cardFlipFront: '點擊翻開',
    cardPrevious: '← 上一張',
    cardNext: '下一張 →',
    keyboardHint: '⌨️ 使用鍵盤：← → 導覽 | Space 翻卡',
    clickHint: '🖱️ 點擊卡片可翻開解答',
    tipsHint: '💡 提示：點擊卡片翻開、使用 ← → 箭頭導覽或搜尋特定內容',

    // Quiz Page
    quizTitle: '題庫',
    question: '題目',
    answer: '答案',
    submit: '提交',
    correct: '正確',
    incorrect: '錯誤',
    quizSubtitle: '完成測驗，檢視您的學習成果',
    quizInstruction1: '選擇您的答案後，系統會立即顯示正確答案和詳細解析',
    quizInstruction2: '完成每個章節後，您將獲得成績評級',
    quizInstruction3: '可隨時返回重新測試不同章節，挑戰自己的學習成果',
    backToSections: '← 返回章節選擇',
    correctAnswer: '正確',
    incorrectAnswer: '錯誤',
    correctAnswerLabel: '正確答案：',
    nextQuestion: '下一題 →',
    completeQuiz: '完成測驗 →',

    // Progress & Certificate
    myProgress: '我的進度',
    learningProgress: '我的學習進度',
    trackProgress: '追踪你的課程完成進度',
    overallProgress: '整體進度',
    slidesProgress: '投影片進度',
    cardLearning: '卡牌自學',
    quizCompleted: '題庫完成',
    testScore: '測驗成績',
    requiredScore: '≥80% 可領證書',
    certificateStatus: '證書狀態',
    certificateEarned: '已獲得結業證書！',
    generatedAt: '於',
    generatedAtSuffix: '生成',
    certificateNumber: '編號：',
    viewDownloadCertificate: '查看 / 重新下載證書',
    completeCourseRequirements: '完成所有課程要求後，即可獲得証書。',
    stillNeedComplete: '還需完成：',
    tips: '提示：',
    slidesTip: '投影片：點擊課程後，逐頁瀏覽所有內容',
    cardsTip: '卡牌：點擊卡牌翻開解答，系統會自動記錄',
    quizTip: '題庫：完整作答所有題目，系統自動計算成績',
    autoSaveTip: '進度會自動保存，可随時返回查看',
    loading: '加載中...',

    // Quiz Sections (新增)
    section1: '基礎認識 - Gemini 功能與訂閱',
    section1Range: '問題 1-20',
    section2: '文本應用 - 內容生成、研究、分析',
    section2Range: '問題 21-35',
    section3: '圖像應用 - 圖像分析、生成、設計',
    section3Range: '問題 36-50',
    section4: '視頻與音頻 - Veo、音樂、語音',
    section4Range: '問題 51-65',
    section5: '語音應用 - Live、實時對話、語音分析',
    section5Range: '問題 66-80',
    section6: '進階應用 - 倫理、決策、企業應用',
    section6Range: '問題 81-100',

    // Grade (新增)
    gradeAPlus: 'A+ (優秀)',
    gradeA: 'A (很好)',
    gradeB: 'B (良好)',
    gradeC: 'C (及格)',
    gradeD: 'D (需加強)',
    requiredScoreProgress: '需達 80% 或以上',

    // Certificate Page
    certificateCongratulations: '恭喜完成課程！',
    certificateCompletionMessage: '你已完成「Gemini企業協作課程」的所有課程內容、卡牌自學及測驗。',
    certificateGeneratePrompt: '現在就生成你的專屬證書吧！',
    certificateNameLabel: '請輸入您的姓名（用於證書）：',
    certificateGenerateButton: '生成我的證書',
    certificateGenerating: '⏳ 生成中...',
    certificateEligibilityRequired: '還未完成所有要求。請完成所有課程。',

    // Certificate Page (新增)
    certificateEligibilityAlert: '還未完成所有要求。請完成所有課程。',
    certificateNameInputPrompt: '請輸入你的姓名',
    certificateGenerationError: '證書生成失敗，請重試',
    certificateLoadingMessage: '加載中...',
    certificateIncompleteTitle: '完成課程以獲得證書',
    certificateRequirements: '您需要完成以下所有要求才能獲得結業證書：',
    certificateSlidesLabel: '投影片進度',
    certificateCardsLabel: '卡牌自學',
    certificateQuizLabel: '題庫完成',
    certificateScoreLabel: '測驗成績',
    certificateViewProgressButton: '查看詳細進度 →',
    certificateCongratulationsTitle: '恭喜完成課程！',
    certificatePNGButton: '下載 PNG',
    certificatePDFButton: '下載 PDF',
    certificateCertificateInfoTitle: '證書信息',
    certificateName: '姓名',
    certificateCompletionDate: '完成日期',
    certificateCertificateNumber: '証書編號',
    certificateTestScore: '測驗成績',
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
    companyName: 'ダフォン貿易グループ',
    module: 'モジュール',
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
    cardCompleted: '✓ 完了',
    cardNotCompleted: '未完了',
    cardAnswer: '解答',
    cardQuestion: '問題',
    cardFlipBack: 'クリックして戻す',
    cardFlipFront: 'クリックして開く',
    cardPrevious: '← 前へ',
    cardNext: '次へ →',
    keyboardHint: '⌨️ キーボード：← → ナビゲート | Space フリップ',
    clickHint: '🖱️ カードをクリックして答えを表示',
    tipsHint: '💡 ヒント：カードをクリックして開く、← → キーで移動、または特定の内容を検索してください',

    // Quiz Page
    quizTitle: 'クイズ',
    question: '質問',
    answer: '答え',
    submit: '送信',
    correct: '正解',
    incorrect: '不正解',
    quizSubtitle: 'クイズを完成させ、学習成果を確認してください',
    quizInstruction1: '答えを選択すると、システムが正解と詳細な解析を表示します',
    quizInstruction2: '各セクションを完了すると、成績評価が得られます',
    quizInstruction3: 'いつでもセクション選択に戻り、別のセクションで再度挑戦できます',
    backToSections: '← セクション選択に戻る',
    correctAnswer: '正解',
    incorrectAnswer: '不正解',
    correctAnswerLabel: '正解：',
    nextQuestion: '次の問題 →',
    completeQuiz: 'クイズ完了 →',

    // Progress & Certificate
    myProgress: '進捗状況',
    learningProgress: '私の学習進度',
    trackProgress: 'コースの完了進度を追跡',
    overallProgress: '全体の進度',
    slidesProgress: 'スライド進度',
    cardLearning: 'カード学習',
    quizCompleted: 'クイズ完了',
    testScore: 'テストスコア',
    requiredScore: '≥80% で証書取得',
    certificateStatus: '証書ステータス',
    certificateEarned: '修了証書を取得しました！',
    generatedAt: '生成日：',
    generatedAtSuffix: '',
    certificateNumber: '番号：',
    viewDownloadCertificate: '証書を表示 / 再ダウンロード',
    completeCourseRequirements: 'すべてのコース要件を完了した後、証書を取得できます。',
    stillNeedComplete: '完了が必要：',
    tips: '💡 ヒント：',
    slidesTip: 'スライド：コースをクリックした後、すべてのコンテンツをページごとに閲覧',
    cardsTip: 'カード：カードをクリックして回答を表示、システムが自動的に記録',
    quizTip: 'クイズ：すべての問題に完全に回答、システムが自動的に成績を計算',
    autoSaveTip: '進度は自動的に保存され、いつでも確認できます',
    loading: '読み込み中...',

    // Quiz Sections (新增)
    section1: '基本理解 - Gemini の機能とサブスクリプション',
    section1Range: '問題 1-20',
    section2: 'テキスト応用 - コンテンツ生成、研究、分析',
    section2Range: '問題 21-35',
    section3: '画像応用 - 画像分析、生成、デザイン',
    section3Range: '問題 36-50',
    section4: 'ビデオとオーディオ - Veo、音楽、音声',
    section4Range: '問題 51-65',
    section5: '音声応用 - Live、リアルタイム対話、音声分析',
    section5Range: '問題 66-80',
    section6: '高度な応用 - 倫理、意思決定、エンタープライズ応用',
    section6Range: '問題 81-100',

    // Grade (新增)
    gradeAPlus: 'A+ (優秀)',
    gradeA: 'A (素晴らしい)',
    gradeB: 'B (良好)',
    gradeC: 'C (合格)',
    gradeD: 'D (改善が必要)',
    requiredScoreProgress: '80% 以上が必要',

    // Certificate Page
    certificateCongratulations: 'コース完了おめでとう！',
    certificateCompletionMessage: 'あなたは「Gemini企業協働コース」のすべてのコース内容、カード学習、およびクイズテストを完了しました。',
    certificateGeneratePrompt: '現在、あなたの専属修了証書を生成してください！',
    certificateNameLabel: '証書に使用するあなたの名前を入力してください：',
    certificateGenerateButton: '✨ 修了証書を生成する',
    certificateGenerating: '⏳ 生成中...',
    certificateEligibilityRequired: '修了要件を満たしていません。すべてのコースを完了してください。',

    // Certificate Page (新增)
    certificateEligibilityAlert: '修了要件を満たしていません。すべてのコースを完了してください。',
    certificateNameInputPrompt: 'あなたの名前を入力してください',
    certificateGenerationError: '証書生成に失敗しました。もう一度試してください',
    certificateLoadingMessage: '読み込み中...',
    certificateIncompleteTitle: 'コースを完了して証書を取得',
    certificateRequirements: 'すべての要件を満たしてから修了証書を取得してください：',
    certificateSlidesLabel: 'スライド進度',
    certificateCardsLabel: 'カード学習',
    certificateQuizLabel: 'クイズ完了',
    certificateScoreLabel: 'テストスコア',
    certificateViewProgressButton: '詳細な進度を確認 →',
    certificateCongratulationsTitle: 'コース完了おめでとう！',
    certificatePNGButton: 'PNG をダウンロード',
    certificatePDFButton: 'PDF をダウンロード',
    certificateCertificateInfoTitle: '証書情報',
    certificateName: '名前',
    certificateCompletionDate: '修了日',
    certificateCertificateNumber: '証書番号',
    certificateTestScore: 'テストスコア',

    // Auth Page (新增)
    authSignUpSuccess: '登録が完了しました。ログインしてください',
    authError: 'エラーが発生しました',
    authCreateAccount: '新しいアカウントを作成',
    authLogin: 'アカウントにログイン',
    authNameLabel: '名前',
    authNamePlaceholder: '例：山田太郎',
    authEmailLabel: 'メールアドレス',
    authPasswordLabel: 'パスワード',
    authPasswordPlaceholder: '最低 6 文字',
    authProcessing: '処理中...',
    authCreateButton: 'アカウント作成',
    authLoginButton: 'ログイン',
    authHaveAccount: 'アカウントをお持ちですか？',
    authNoAccount: 'アカウントをお持ちでないですか？',
    authSwitchToLogin: 'ログイン',
    authSwitchToSignUp: '登録',

  },
};

export function t(key: string, language: Language): string {
  const lang = language === 'ja' ? 'ja' : 'zh';
  return (translations[lang] as any)[key] || key;
}
