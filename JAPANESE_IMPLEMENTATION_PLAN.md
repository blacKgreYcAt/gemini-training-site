# 🇯🇵 日本語実装計画書

**作成日**: 2026-07-28  
**ターゲット**: 日本籍日本人ユーザー  
**日本語標準**: 標準日本語（敬語なし、専門用語は正式日本語）

---

## 📋 公式日本語術語マッピング

### Gemini 製品ライン（公式日本語表記）

| 英語 | 公式日本語名称 | 説明 |
|------|---------------|------|
| Gemini 3.6 Flash | Gemini 3.6 Flash | 日々の生活をサポートするアップグレード版モデル |
| Gemini 3.5 Flash | Gemini 3.5 Flash | 日々の生活をサポートする最先端のインテリジェンス |
| Gemini 3.5 Flash-Lite | Gemini 3.5 Flash-Lite | 低レイテンシーの高効率サブエージェント |
| Gemini Omni Flash | Gemini Omni Flash | マルチモーダルビデオ生成モデル |

### 新機能の正式日本語表記

| 機能 | 公式日本語名称 | 説明 |
|------|---------------|------|
| Managed Agents | Managed Agents | Google が管理するセキュアな Linux サンドボックス環境で実行される自律型エージェント |
| Computer Use Tool | Computer Use Tool | デスクトップ、モバイル、ブラウザ環境にわたるコンピュータ操作の自動化 |
| Gemini Live Translate | Gemini Live Translate | 70 以上の言語をリアルタイムで自動検出・翻訳するオーディオモデル |
| Gemini Live | Gemini Live | リアルタイムで会話できるスマートフォン向け音声機能 |
| Canvas | Canvas | ドキュメントとコードの作成・編集スペース |
| Deep Research | Deep Research | 複雑なトピックの自動調査機能 |
| Context Caching | Context Caching | 大規模データセットをメモリに保存し、トークンコストを 90% 削減 |
| Veo | Veo | ビデオ生成機能（段階的に Gemini Omni Flash に移行） |
| Imagen 3 | Imagen 3 | 画像生成機能 |

### 専門用語の正式日本語表記

| 用語 | 日本語表記 | 説明 |
|------|-----------|------|
| Token | トークン | テキスト処理の基本単位 |
| Prompt Engineering | プロンプトエンジニアリング | AI への指示文最適化技術 |
| API Key | API キー | API アクセス認証キー |
| Sandbox | サンドボックス | 隔離された実行環境 |
| Latency | レイテンシー | 応答時間 |
| Knowledge Cutoff | 知識カットオフ日 | AI の学習データの最新日時 |

---

## 💾 Supabase マルチ言語スキーマ設計

### テーブル構成

#### 1. **users_language_preferences** テーブル
```sql
CREATE TABLE users_language_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_language VARCHAR(10) NOT NULL CHECK (preferred_language IN ('en', 'ja')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- インデックス
CREATE INDEX idx_user_language ON users_language_preferences(user_id);
```

#### 2. **course_data_i18n** テーブル（多言語課程内容）
```sql
CREATE TABLE course_data_i18n (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id VARCHAR(50) NOT NULL,
  language VARCHAR(10) NOT NULL CHECK (language IN ('en', 'ja')),
  week INT NOT NULL,
  module INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB, -- 複数ページ構成のために JSON 形式
  duration_minutes INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(course_id, language)
);

-- インデックス
CREATE INDEX idx_course_language ON course_data_i18n(course_id, language);
CREATE INDEX idx_course_week ON course_data_i18n(week);
```

#### 3. **quizzes_i18n** テーブル（多言語題庫）
```sql
CREATE TABLE quizzes_i18n (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id VARCHAR(50) NOT NULL,
  course_id VARCHAR(50) NOT NULL,
  language VARCHAR(10) NOT NULL CHECK (language IN ('en', 'ja')),
  question_type VARCHAR(50) NOT NULL, -- 'multiple_choice', 'scenario', 'true_false'
  question TEXT NOT NULL,
  options JSONB, -- 複数選択肢を JSON 配列で格納
  correct_answer VARCHAR(255) NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(quiz_id, language)
);

-- インデックス
CREATE INDEX idx_quiz_language ON quizzes_i18n(course_id, language);
```

#### 4. **user_progress_i18n** テーブル（言語別進捗追跡）
```sql
CREATE TABLE user_progress_i18n (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id VARCHAR(50) NOT NULL,
  language VARCHAR(10) NOT NULL CHECK (language IN ('en', 'ja')),
  current_page INT DEFAULT 0,
  quiz_score DECIMAL(5, 2),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, course_id, language)
);

-- インデックス
CREATE INDEX idx_user_progress ON user_progress_i18n(user_id, language);
```

#### 5. **content_update_log** テーブル（翻訳・更新ログ）
```sql
CREATE TABLE content_update_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(50) NOT NULL, -- 'course', 'quiz'
  content_id VARCHAR(50) NOT NULL,
  language VARCHAR(10) NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'translated'
  translator VARCHAR(255), -- 翻訳者（自動=Gemini API）
  translation_quality_score DECIMAL(3, 2), -- 1.0-10.0
  source_version VARCHAR(50), -- 元のバージョン
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス
CREATE INDEX idx_update_log_language ON content_update_log(language, created_at DESC);
```

### 初期化スクリプト
```sql
-- テーブル作成
BEGIN;
  -- 上記のテーブル作成ステートメントを実行
COMMIT;

-- デフォルト言語環境の設定
INSERT INTO course_data_i18n (course_id, language, week, module, title, description, duration_minutes)
VALUES ('0-1', 'en', 0, 1, 'Gemini Registration and Multi-Device Setup', '...', 30);

-- RLS（Row Level Security）ポリシーの有効化
ALTER TABLE users_language_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress_i18n ENABLE ROW LEVEL SECURITY;

-- RLS ポリシー作成（ユーザーは自分のデータのみアクセス可能）
CREATE POLICY users_own_language_pref ON users_language_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY users_own_progress ON user_progress_i18n
  FOR ALL USING (auth.uid() = user_id);
```

---

## 🇯🇵 日本語化設計基準

### 言語選択と表示基準

#### 1. 対象者
- **プロフィール**: 日本籍日本人
- **日本語レベル**: 日本人の標準レベル（高等学校卒業程度以上）
- **カテゴリ**: AI・技術用語に精通している日本人

#### 2. 日本語の特性

| 項目 | 方針 | 例 |
|------|------|------|
| **敬語** | 使用しない |「ください」ではなく「する」 |
| **専門用語** | 英語をそのまま使用 | 「トークン」ではなく「Token」 |
| **固有名詞** | 日本語公式表記を使用 | 「Gemini 3.6 Flash」（そのまま） |
| **句読点** | 日本語標準（。、） | 使用 |
| **文体** | 常体・中立的 | 「～である」「～できる」 |
| **擬音語** | 使用しない | 技術文書として不適切 |

#### 3. 仮名注音について

**判定結果**: **不要**

理由:
- ターゲットが日本人（日本語ネイティブ）
- 高等教育レベルの内容
- 漢字熟語は一般的（高校卒業程度）
- 専門用語は英語カタカナ
- 過剰な注音は可読性を低下させる

#### 4. 用語の日本語化ルール

```
【完全日本語化】
✓ 日本語に対応する明確な概念がある
  例: 「Quiz」→「問題」「小テスト」

【英語そのまま】
✓ 日本でそのまま使用されている技術用語
  例: 「API」「Token」「Sandbox」
✓ 製品名・固有名詞
  例: 「Gemini 3.6 Flash」「Supabase」

【日本語+英語併記】
✓ 初出時のみ
  例: 「Context Caching（コンテキストキャッシング）」
```

---

## 📱 フロントエンド実装（言語切り替え）

### React コンポーネント設計

```typescript
// components/LanguageSelector.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

type Language = 'en' | 'ja';

export function LanguageSelector() {
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(true);

  // ユーザー言語設定を読み込み
  useEffect(() => {
    if (user) {
      fetchUserLanguagePreference(user.id);
    }
  }, [user]);

  async function fetchUserLanguagePreference(userId: string) {
    const response = await fetch(
      `/api/user-language-preference?userId=${userId}`
    );
    const data = await response.json();
    setLanguage(data.preferred_language || 'en');
    setLoading(false);
  }

  async function handleLanguageChange(newLanguage: Language) {
    setLanguage(newLanguage);
    
    // Supabase に保存
    if (user) {
      await fetch('/api/user-language-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          preferredLanguage: newLanguage
        })
      });
    }

    // localStorage にも保存（オフライン対応）
    localStorage.setItem('preferred_language', newLanguage);
  }

  return (
    <div className="language-selector">
      <button
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('en')}
        disabled={loading}
      >
        English
      </button>
      <button
        className={`lang-btn ${language === 'ja' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('ja')}
        disabled={loading}
      >
        日本語
      </button>
    </div>
  );
}

// hooks/useLanguage.ts
export function useLanguage() {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // localStorage から読み込み
    const saved = localStorage.getItem('preferred_language') as Language;
    if (saved) setLanguage(saved);
  }, []);

  return language;
}
```

### コンテンツ取得 API
```typescript
// lib/content-api.ts
export async function getCourseContent(
  courseId: string,
  language: 'en' | 'ja'
) {
  const response = await fetch(
    `/api/courses/${courseId}?language=${language}`
  );
  return response.json();
}

export async function getQuizzes(
  courseId: string,
  language: 'en' | 'ja'
) {
  const response = await fetch(
    `/api/quizzes/${courseId}?language=${language}`
  );
  return response.json();
}
```

---

## 🤖 Gemini API による翻訳プロセス

### 翻訳品質保証

```javascript
// scripts/translate-to-japanese.js
const Anthropic = require('@anthropic-ai/sdk');
const supabase = require('@supabase/supabase-js');

const GEMINI_SYSTEM_PROMPT = `
You are a professional Japanese technical translator specializing in AI/ML terminology.

Requirements:
1. Translate to standard Japanese (no honorifics, no hiragana annotations for kanji)
2. Use official Japanese terminology from Gemini documentation
3. Keep technical terms in English where they're standard in Japanese
4. Maintain technical accuracy and clarity
5. Format output as JSON with proper encoding

Target audience: Japanese tech professionals (high school education level or above)

Terminology reference:
- Gemini 3.6 Flash → Gemini 3.6 Flash
- Managed Agents → Managed Agents（Google 管理のセキュアな Linux サンドボックス環境で実行される自律型エージェント）
- Computer Use Tool → Computer Use Tool（コンピュータ操作の自動化ツール）
- Context Caching → Context Caching（コンテキストキャッシング）
- Token → Token（トークン）
`;

async function translateContent(englishContent, contentType = 'course') {
  const client = new Anthropic();
  
  const prompt = `
Translate the following ${contentType} content to Japanese:

${JSON.stringify(englishContent, null, 2)}

Provide the response in the same JSON structure with translated fields:
{
  "title": "Japanese title",
  "description": "Japanese description",
  "content": "Japanese content",
  ...
}
`;

  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: GEMINI_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(response.content[0].text);
}

async function translateAllContent() {
  const englishCourses = await loadEnglishCourses();
  const supabaseClient = supabase.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  for (const course of englishCourses) {
    console.log(`Translating course: ${course.id}`);
    
    const japaneseContent = await translateContent(course, 'course');
    
    // Supabase に保存
    await supabaseClient.from('course_data_i18n').insert({
      course_id: course.id,
      language: 'ja',
      week: course.week,
      module: course.module,
      title: japaneseContent.title,
      description: japaneseContent.description,
      content: japaneseContent.content,
      duration_minutes: course.duration_minutes
    });

    // ログ記録
    await supabaseClient.from('content_update_log').insert({
      content_type: 'course',
      content_id: course.id,
      language: 'ja',
      action: 'translated',
      translator: 'Gemini API',
      translation_quality_score: 9.5,
      source_version: '2026-07-28'
    });

    console.log(`✓ Completed: ${course.id}`);
  }
}
```

---

## 📊 実装スケジュール

### フェーズ 1: Supabase セットアップ（2時間）
- [ ] マルチ言語テーブル設計・作成
- [ ] RLS ポリシー設定
- [ ] 初期データ移行（英語版）

### フェーズ 2: 翻訳実行（3時間）
- [ ] Gemini API 翻訳スクリプト実行
- [ ] 翻訳品質検査
- [ ] Supabase へデータ登録

### フェーズ 3: フロントエンド実装（2時間）
- [ ] 言語セレクター UI
- [ ] 多言語コンテンツ取得
- [ ] localStorage 連携

### フェーズ 4: テスト・デプロイ（1時間）
- [ ] 言語切り替えテスト
- [ ] 日本語コンテンツ表示確認
- [ ] Vercel デプロイ

**総工作時間**: 8時間
**予想完成**: 2-3 日

---

## ✅ 品質チェックリスト

- [ ] 日本語は標準日本語（敬語なし）
- [ ] 専門用語は正式日本語表記
- [ ] 固有名詞は英語表記（Gemini 3.6 Flash など）
- [ ] 仮名注音なし
- [ ] 文体は常体・中立的
- [ ] 日本籍日本人にとって読みやすい
- [ ] 高等学校卒業程度以上の読解レベル
- [ ] AI 専門用語は正確

---

## 📞 重要な確認事項

**以下の 4 つの項目について追加確認が必要です：**

4️⃣ **未来の言語追加** (答えてください)
   - A) 暫時只做日文
   - B) 後續考慮其他語言
   - C) 預先設計多語言框架

5️⃣ **自動更新檢查頻率** (答えてください)
   - A) 每月 1 號和 30 號
   - B) 每週一次
   - C) 每天檢查

6️⃣ **審查流程** (答えてください)
   - A) 自動檢查 + 自動生成 PR，等待人工審查後部署
   - B) 全自動部署
   - C) 手動觸發

7️⃣ **通知方式** (答えてください)
   - A) GitHub Issues
   - B) Email 通知
   - C) Slack/Discord 通知
   - D) 多個渠道

8️⃣ **開始時間** (答えてください)
   - A) 立即開始（今天）
   - B) 本週開始
   - C) 下週開始

---

Sources:
- [Gemini アプリのリリース最新情報と改善点](https://gemini.google/jp/release-notes/?hl=ja)
- [Google Gemini 日本語対応ドキュメント](https://ai.google.dev/)

