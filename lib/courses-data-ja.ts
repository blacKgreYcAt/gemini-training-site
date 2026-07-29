/**
 * 完整的日文課程數據（19門課程）
 * 所有課程標題和描述已翻譯為日文
 */

export interface CoursePageContent {
  title: string;
  content: string;
}

export interface Course {
  id: string;
  week: number;
  module: number;
  title: string;
  description: string;
  pages: CoursePageContent[];
  duration_minutes: number;
}

// 日文課程標題和描述映射
export const courseTranslationsJa: Record<string, { title: string; description: string }> = {
  "0-1": {
    title: "Geminiの登録とマルチデバイス設定",
    description: "受講前準備：アカウント設定とマルチプラットフォームログインガイド"
  },
  "0-2": {
    title: "Gemini 3.1 Pro と Ultra のサブスクリプションプラン比較",
    description: "異なるバージョンにおける機能の違いと最適なユースケースを理解する"
  },
  "0-3": {
    title: "あなたのAI会話履歴を移行する",
    description: "他のAIプラットフォームからGeminiへシームレスに移行し、完全なコンテキストを保持"
  },
  "1-1": {
    title: "コースキックオフとAIトレンド",
    description: "マネージャーがなぜAIを理解する必要があるのか。従来の管理モデルの変革"
  },
  "1-2": {
    title: "6つの神器の高速ツアーと火力デモンストレーション",
    description: "Deep Research、Canvas、Create Image、Create Video、Create Audio、Learning Mode を一度に理解する"
  },
  "1-3": {
    title: "クラスの振り返りと応用アイデア出し",
    description: "グループディスカッション、自分の部門のAI応用アイデアを探索"
  },
  "2-1": {
    title: "プロンプトエンジニアリング：「命令」から「アート」へ",
    description: "AIを正確に指導し、完璧な成果物を得る方法を習得"
  },
  "2-2": {
    title: "コンテンツ生成と最適化",
    description: "AIを使用してプロレベルのテキスト、ビデオ、画像を作成する"
  },
  "2-3": {
    title: "深度研究と競争分析",
    description: "複雑なトピック分析、市場調査、競合分析"
  },
  "3-1": {
    title: "画像とデザイン応用",
    description: "AI生成画像、ビジュアルコンテンツ、デザイン最適化"
  },
  "3-2": {
    title: "ビデオとオーディオ制作",
    description: "Veo 3.1 ビデオ生成、音声合成、マルチメディアコンテンツ制作"
  },
  "3-3": {
    title: "データ分析と可視化",
    description: "AIを使用したデータインサイト抽出、レポート自動生成"
  },
  "4-1": {
    title: "ワークフロー統合とチーム協力",
    description: "Geminiをビジネスプロセスに統合、チーム生産性の向上"
  },
  "adv-1-1": {
    title: "高度なプロンプトの技術",
    description: "エキスパートレベルのプロンプト戦略、システムメッセージ、思考チェーン"
  },
  "adv-2-1": {
    title: "マルチモーダルアプリケーション",
    description: "テキスト、画像、ビデオを組み合わせた高度なAIアプリケーション開発"
  },
  "adv-3-1": {
    title: "カスタムAIの構築",
    description: "Gems機能を使用して専用AIアシスタントを作成、カスタマイズ"
  },
  "adv-4-1": {
    title: "AIリテラシーと正しい事実確認",
    description: "AI幻覚対策、情報検証、AI時代の批判的思考"
  },
  "adv-5-1": {
    title: "Gemini 3.1 Pro 実戦ワークショップ",
    description: "Advanced機能の実践的な使用、ケーススタディ、最適化テクニック"
  },
  "adv-6-1": {
    title: "AI時代の意思決定管理",
    description: "AIを活用した戦略的意思決定、リーダーシップの進化、組織変革"
  }
};

export function getCourseTranslationJa(courseId: string): { title: string; description: string } | null {
  return courseTranslationsJa[courseId] || null;
}

export function getCourseTitleJa(courseId: string, originalTitle: string): string {
  return courseTranslationsJa[courseId]?.title || originalTitle;
}

export function getCourseDescriptionJa(courseId: string, originalDescription: string): string {
  return courseTranslationsJa[courseId]?.description || originalDescription;
}
