#!/usr/bin/env node
// 將 lib/quiz-data.ts 的 100 題中文題庫翻譯成日文，輸出 lib/quiz-data-ja.ts
//
// 刻意保留 id / section / week / correctAnswer / options[].label 不變，
// 讓中日文共用同一份考題編號 —— 進度追蹤（updateQuizProgress 以 id 為鍵）
// 與證書門檻才能在兩種語言間一致。只翻譯 question / options[].text / explanation。

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ 未設定 GEMINI_API_KEY 環境變數');
  process.exit(1);
}

const MODEL = 'gemini-3.5-flash';

// 解析 quiz-data.ts（陣列後面還有 helper 函式，需以 '\n];' 定位結尾）
const src = fs.readFileSync(path.join(__dirname, '../lib/quiz-data.ts'), 'utf-8');
const decl = 'export const quizData: QuizQuestion[] = ';
const start = src.indexOf(decl) + decl.length;
const end = src.indexOf('\n];', start) + 2;
const quizData = eval('(' + src.substring(start, end) + ')');

const PROMPT_RULES =
  '將繁體中文翻譯成日文。這是測驗題目，請保持專業準確，' +
  '保留技術名詞（Gemini、Veo、Canvas、Deep Research 等）原文。';

async function callModel(prompt, maxTokens) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: maxTokens },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`API ${res.status}: ${err.error?.message || 'unknown'}`);
  }
  const data = await res.json();
  return data.candidates[0].content.parts[0].text.trim();
}

async function translateOne(text) {
  if (!text || !text.trim()) return text;
  return callModel(`${PROMPT_RULES}只返回翻譯結果，不要有其他說明：\n\n${text}`, 2000);
}

/**
 * 一次翻譯一題的所有欄位，把 6 次 API 呼叫壓成 1 次。
 * 模型回傳的陣列長度必須與輸入相符，否則退回逐欄位翻譯以確保正確性。
 */
async function translateBatch(texts) {
  const prompt =
    `${PROMPT_RULES}\n\n` +
    `輸入是一個 JSON 字串陣列。請逐一翻譯，回傳「相同長度」的 JSON 字串陣列。\n` +
    `只輸出 JSON 陣列本身，不要有 markdown 標記或任何說明文字。\n\n` +
    JSON.stringify(texts, null, 0);

  const raw = await callModel(prompt, 4000);
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length === texts.length && parsed.every((v) => typeof v === 'string')) {
      return parsed;
    }
    throw new Error(`shape mismatch: got ${Array.isArray(parsed) ? parsed.length : typeof parsed}, want ${texts.length}`);
  } catch (e) {
    process.stdout.write(`(批次失敗 ${e.message}，改逐欄位) `);
    const out = [];
    for (const tx of texts) {
      out.push(await translateOne(tx));
      await new Promise((r) => setTimeout(r, 300));
    }
    return out;
  }
}

async function main() {
  console.log(`📝 開始翻譯 ${quizData.length} 題為日文...\n`);
  const out = [];

  for (let i = 0; i < quizData.length; i++) {
    const q = quizData[i];
    process.stdout.write(`[${i + 1}/${quizData.length}] 第 ${q.id} 題 ... `);

    // [題目, 選項A, 選項B, ..., 解析] 一次送出
    const texts = [q.question, ...q.options.map((o) => o.text), q.explanation];
    const tr = await translateBatch(texts);

    const question = tr[0];
    const options = q.options.map((o, idx) => ({ label: o.label, text: tr[idx + 1] }));
    const explanation = tr[tr.length - 1];

    // id / section / week / correctAnswer 一律沿用中文版
    out.push({ ...q, question, options, explanation });
    console.log('✓');
    await new Promise((r) => setTimeout(r, 400));
  }

  const ts = `import { QuizQuestion } from './quiz-data';

// 日文題庫 — 由 scripts/translate-quiz.js 透過 Gemini API 產生。
// id / section / week / correctAnswer 與中文版完全對應，以確保
// 進度追蹤與證書門檻在兩種語言間一致。
export const quizDataJa: QuizQuestion[] = ${JSON.stringify(out, null, 2)};
`;

  const outPath = path.join(__dirname, '../lib/quiz-data-ja.ts');
  fs.writeFileSync(outPath, ts, 'utf-8');
  console.log(`\n✅ 完成！${out.length} 題已寫入 ${outPath}`);
}

main().catch((e) => {
  console.error('\n❌ 失敗:', e.message);
  process.exit(1);
});
