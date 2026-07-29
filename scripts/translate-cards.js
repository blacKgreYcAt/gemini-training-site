#!/usr/bin/env node
// 將 lib/cards-data.ts 的 55 張中文卡牌翻譯成日文，輸出 lib/cards-data-ja.ts
// imagePrompt 不翻譯（僅供圖片生成，不面向使用者）

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ 未設定 GEMINI_API_KEY 環境變數');
  process.exit(1);
}

const MODEL = 'gemini-3.5-flash';

// 讀取並解析 cards-data.ts
const src = fs.readFileSync(path.join(__dirname, '../lib/cards-data.ts'), 'utf-8');
const decl = 'export const cardsData: Card[] = ';
const start = src.indexOf(decl) + decl.length;
// 陣列後面還有 helper 函式，必須用括號配對找出真正的結尾（而非 lastIndexOf）
const end = src.indexOf('\n];', start) + 2;
const cardsData = eval('(' + src.substring(start, end) + ')');

async function translate(text) {
  if (!text || !text.trim()) return text;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `將以下中文翻譯成日文。保留原本的換行、符號（✓ ✗ → 等）與排版結構。只返回翻譯結果，不要有其他說明：\n\n${text}` }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 4000 },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`API ${res.status}: ${err.error?.message}`);
  }
  const data = await res.json();
  return data.candidates[0].content.parts[0].text.trim();
}

async function main() {
  console.log(`🃏 開始翻譯 ${cardsData.length} 張卡牌為日文...\n`);
  const out = [];

  for (let i = 0; i < cardsData.length; i++) {
    const c = cardsData[i];
    console.log(`[${i + 1}/${cardsData.length}] ${c.id} - ${c.title}`);

    const title = await translate(c.title);
    const front = await translate(c.front);
    const back = await translate(c.back);

    out.push({ ...c, title, front, back });
    console.log(`   ✓ ${title}`);
    await new Promise((r) => setTimeout(r, 600));
  }

  const ts = `import { Card } from './cards-data';

// 日文卡牌資料 — 由 scripts/translate-cards.js 透過 Gemini API 產生
// imagePrompt 保留中文（僅供圖片生成，不面向使用者）
export const cardsDataJa: Card[] = ${JSON.stringify(out, null, 2)};
`;

  const outPath = path.join(__dirname, '../lib/cards-data-ja.ts');
  fs.writeFileSync(outPath, ts, 'utf-8');
  console.log(`\n✅ 完成！${out.length} 張卡牌已寫入 ${outPath}`);
}

main().catch((e) => {
  console.error('\n❌ 失敗:', e.message);
  process.exit(1);
});
