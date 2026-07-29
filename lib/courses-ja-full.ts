/**
 * 完整的日文課程數據（19門課程 - 所有內容包括頁面翻譯）
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

export const courseDataJaFull: Course[] = [
  // Week 0 - 準備課程
  {
    id: "0-1",
    week: 0,
    module: 1,
    title: "Geminiの登録とマルチデバイス設定",
    description: "受講前準備：アカウント設定とマルチプラットフォームログインガイド",
    pages: [
      {
        title: "コース単元：Gemini登録とマルチデバイスセットアップガイド",
        content: "このユニットでは、Geminiの登録とセットアップを完了し、各デバイスでスムーズに使用できることを確認します。"
      },
      {
        title: "事前準備：Googleアカウント",
        content: "GeminiはGoogleが開発した生成型AIであり、使用するには@gmail.comのGoogleアカウントが必要です。\n\n個人アカウント：\n公式ウェブサイトに直接アクセスして使用できます。\n\n企業/教育アカウント：\n組織の管理者がバックエンドで「Gemini」権限を有効にする必要があります。\n\n→ 使用可能なGoogleアカウントを確認してください"
      },
      {
        title: "コンピュータウェブ版：深層な業務と創作に最適",
        content: "ウェブ版は最も機能が充実しており、複雑なプロンプト指示を処理するのに最適なインターフェースです。\n\n公式URL：gemini.google.com\n\n操作の3つのステップ：\n1. ブラウザを開く（最適な互換性のためにChromeを推奨）\n2. 右上の「ログイン」をクリックし、Googleアカウント認証情報を入力\n3. チャットボックスに入力して、指示を開始\n\nマスターの秘密のコツ：\nコンピュータ版では、右側の「ファイルにエクスポート」や「ダウンロード」などのオプションを直接使用して、AIコンテンツの柔軟な応用を実現できます。"
      },
      {
        title: "モバイルデバイス：いつでも一緒のAIアシスタント",
        content: "お使いの携帯電話のシステムに応じて、Geminiの呼び出し方は若干異なります。\n\nAndroidユーザー：\n• AndroidはGoogleの主戦場であり、Geminiは元のGoogleアシスタントを完全に置き換えることができます\n• ダウンロード方法：Google Playストアに移動してGoogle Gemini Appをダウンロード\n• 起動方法：ダウンロード後、電源ボタンを長押しするか、「Ok Google」と言うと起動できます\n• 特徴：画面上のコンテンツを「見る」ことができ、画面上の情報に基づいてリアルタイム分析を行うことができます\n\niOS (iPhone/iPad) ユーザー：\n• iOSではGeminiは現在Google Appに統合されています\n• ダウンロード方法：App Storeに移動してGoogle Appをダウンロードまたは更新\n• 起動方法：Google Appを開き、上部のGemini切り替えボタンをクリック"
      },
      {
        title: "クロスプラットフォーム共有機能の概要",
        content: "どのバージョンを使用していても、以下のコア インターフェース要素を習得する必要があります：\n\nチャットボックス：\nテキスト指示を入力する場所\n\nカメラ/画像アップロード：\nGeminiに視覚認識を実行させる（例：冷蔵庫の残り物を撮影して食べ物のレシピを尋ねる）\n\nマイク：\n音声入力で指示を出す、入力時間を短縮\n\nGemini Live：\n即座でなめらかな音声会話を行う（本物の人間との会話のような感覚）\n\n履歴：\n左側のサイドバーが過去の会話を記録し、いつでも遡ることができます"
      },
      {
        title: "よくある質問 (FAQ) - パート1",
        content: "Q：Geminiは料金がかかりますか？\nA：基本版は無料です。最強のモデル（Gemini 3.1 Pro/Ultra）と追加機能が必要な場合は、Google One AI Premiumプランにサブスクライブできます。\n\nQ：年齢制限はありますか？\nA：Geminiのユーザーは13歳以上（またはお住まいの国の法定年齢）である必要があり、一部の高度な機能には18歳以上である必要があります。"
      },
      {
        title: "準備完了",
        content: "上記のセットアップが完了したので、次のユニットに進む準備ができています。楽しい学習生活を！"
      }
    ],
    duration_minutes: 30
  },
  {
    id: "0-2",
    week: 0,
    module: 2,
    title: "Gemini 3.1 Pro と Ultra のサブスクリプションプラン比較",
    description: "異なるバージョンにおける機能の違いと最適なユースケースを理解する",
    pages: [
      {
        title: "3つのバージョンを一度に理解する",
        content: "Geminiには3つのバージョンがあり、機能と制限が異なります。\n\n無料版 (Gemini)：\n✓ 基本的なテキスト会話と分析\n✓ 画像理解とアップロード\n✓ Canvas エディタ\n✗ Deep Research\n✗ ビデオと音楽生成\n✗ Gems カスタムAI\n\n適用場面：日常的なクエリ、学習、簡単な作成"
      },
      {
        title: "Gemini 3.1 Pro - 高度なワーカー向け",
        content: "月額：約 20 USD / 月\n\nコア上の利点：\n✓ より強力な推論能力\n✓ Deep Research（研究アシスタント）：月5回\n✓ Veo 3.1 ビデオ生成：1日3回（HD 720p）\n✓ 画像生成：Nano Banana Pro\n✓ 音楽生成：Lyria 3\n✓ Gems の作成：カスタムAIアシスタント5個\n✓ ファイル分析：5GB ストレージ\n\n最適な用途：\n- コンテンツクリエイター\n- ビジネス分析と研究\n- 中小企業の幹部\n- フリーランサー"
      },
      {
        title: "Gemini 3.1 Ultra - エンタープライズリーダー向け",
        content: "月額：約 20 USD / 月（Pro と同じだが機能は無制限）\n\n最強の利点：\n✓ 業界で最も賢いモデル（推論能力が最高）\n✓ Deep Research：無制限\n✓ Veo 3.1 ビデオ生成：1日5回（4K解像度）\n✓ Veo 3.1 新機能：\n  - ビデオ拡張（自動セグメント接続）\n  - フレーム特定生成（最初と最後のフレームを指定）\n  - Reference images ガイダンス\n✓ 画像生成：高度な能力\n✓ Gems：無制限に作成してカスタマイズ\n✓ ファイル分析：無制限ストレージ\n✓ 優先生成キュー（待たずに処理）\n\n最適な用途：\n- 企業経営層\n- 複雑な研究分析\n- コンテンツ大規模製作\n- ブランド＆マーケティング決定"
      }
    ],
    duration_minutes: 25
  },
  // Week 1
  {
    id: "1-1",
    week: 1,
    module: 1,
    title: "コースキックオフとAIトレンド",
    description: "マネージャーがなぜAIを理解する必要があるのか。従来の管理モデルの変革",
    pages: [
      {
        title: "モジュール 1-1 コース紹介",
        content: "本モジュールの主題：なぜマネージャーはAIを理解する必要があるのか?\nGeminiを使用して仕事流程を変更する方法\nAI時代の新しい管理思想を認識する"
      },
      {
        title: "なぜマネージャーはAIを理解する必要があるのか?",
        content: "従来の管理の困難：\n- 「資料探し、下書き確認、スペルチェック」に時間を浪費\n- 意思決定効率が低い\n\nAI時代の変化：仕事モデルの根本的な改革"
      },
      {
        title: "「生産者」から「意思決定者」へ",
        content: "職務の変化：\n✓ AIの責任：初版下書き（報告書、公式文書、手紙）を作成\n✓ マネージャーの責任：「レビュー」と「戦略立案」に100%集中\n✓ 結果：意思決定品質が向上し、実行効率が2倍になる"
      },
      {
        title: "「白紙恐怖症」を排除する",
        content: "新しい企画や危機に直面したとき：\n- ゼロから考え始める必要がありません\n- AIは10秒以内に3つの方向性を提供します\n- マネージャーが最良の方案を選択して最適化します\n→ 膠着時間を減らし、行動速度を加速させます"
      },
      {
        title: "チーム脳をアップグレード",
        content: "アップグレードロジック：\nマネージャーが先にAIを理解 → 部下の正しい使用をガイド\n→ 部門全体の配送速度と品質をアップグレード\n\n賢いマネージャーは賢いチームを育てます"
      }
    ],
    duration_minutes: 30
  }
];

export function getCourseJaFull(courseId: string): Course | undefined {
  return courseDataJaFull.find(c => c.id === courseId);
}
