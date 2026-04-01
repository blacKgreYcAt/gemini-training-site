export interface QuizOption {
  label: string;
  text: string;
}

export interface QuizQuestion {
  id: number;
  section: number;
  week?: number;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
}

export const quizData: QuizQuestion[] = [
  // Week 1 - 六大神器總覽 (Q1-Q10)
  {
    id: 1,
    section: 1,
    week: 1,
    question: "當主管需要針對一個完全陌生的市場進行「多層次、跨網頁」的深度情報收集時，應優先使用哪項功能？",
    options: [
      { label: "A", text: "一般對話框" },
      { label: "B", text: "Deep Research (深度研究)" },
      { label: "C", text: "建立圖像" },
      { label: "D", text: "創作音樂" }
    ],
    correctAnswer: "B",
    explanation: "Deep Research (深度研究) 能進行多層次、跨網頁的深度情報收集，是面對完全陌生市場時的最佳選擇。"
  },
  {
    id: 2,
    section: 1,
    week: 1,
    question: "關於「Canvas (畫布模式)」，下列敘述何者正確？",
    options: [
      { label: "A", text: "它只能用來畫圖" },
      { label: "B", text: "它是一個獨立的文書編輯空間，支援局部修改" },
      { label: "C", text: "它會自動將所有文字轉成影片" },
      { label: "D", text: "它無法與 Google 文件連動" }
    ],
    correctAnswer: "B",
    explanation: "Canvas 是一個獨立的文書編輯空間，支援局部修改，可用於精準潤飾文件。"
  },
  {
    id: 3,
    section: 1,
    week: 1,
    question: "在課程中提到，「建立影片 (Veo)」功能最需要注意的事項是什麼？",
    options: [
      { label: "A", text: "影片畫質很差" },
      { label: "B", text: "每天的使用配額 (Quota) 非常有限" },
      { label: "C", text: "只能生成黑白影片" },
      { label: "D", text: "不需要下提示詞" }
    ],
    correctAnswer: "B",
    explanation: "建立影片功能的使用配額每天都有限制，是使用時最需要注意的事項。"
  },
  {
    id: 4,
    section: 1,
    week: 1,
    question: "如果主管想要練習與「抗拒變革的員工」進行溝通演練，最適合使用哪項功能來引導自己思考？",
    options: [
      { label: "A", text: "建立圖像" },
      { label: "B", text: "創作音樂" },
      { label: "C", text: "引導式學習 (Guided Learning)" },
      { label: "D", text: "Deep Research" }
    ],
    correctAnswer: "C",
    explanation: "引導式學習透過提問引導學習，最適合用於溝通演練和思維培養。"
  },
  {
    id: 5,
    section: 1,
    week: 1,
    question: "關於「創作音樂 (Lyria 3)」，它的主要用途為何？",
    options: [
      { label: "A", text: "幫主管下載流行歌曲" },
      { label: "B", text: "根據文字描述生成專屬的無版權背景配樂" },
      { label: "C", text: "識別廣播中的歌曲名稱" },
      { label: "D", text: "錄製會議語音" }
    ],
    correctAnswer: "B",
    explanation: "Lyria 3 能根據文字描述生成專屬的無版權背景配樂，適合用於簡報和多媒體製作。"
  },
  {
    id: 6,
    section: 1,
    week: 1,
    question: "下列哪一個工具最適合用來「精準潤飾」一份已經寫好的公關聲明稿？",
    options: [
      { label: "A", text: "Canvas" },
      { label: "B", text: "建立影片" },
      { label: "C", text: "搜尋引擎" },
      { label: "D", text: "建立圖像" }
    ],
    correctAnswer: "A",
    explanation: "Canvas 提供獨立的文書編輯空間，支援局部修改，最適合精準潤飾已完成的文件。"
  },
  {
    id: 7,
    section: 1,
    week: 1,
    question: "在 Gemini 的工具列中，哪一個工具強調「不直接給答案，而是透過提問引導你學習」？",
    options: [
      { label: "A", text: "Deep Research" },
      { label: "B", text: "引導式學習" },
      { label: "C", text: "建立圖像" },
      { label: "D", text: "對話框" }
    ],
    correctAnswer: "B",
    explanation: "引導式學習強調蘇格拉底式的教學方法，透過提問引導學習者思考，而非直接給答案。"
  },
  {
    id: 8,
    section: 1,
    week: 1,
    question: "課程中提到的「多模態辦公」思維，主要是指什麼？",
    options: [
      { label: "A", text: "同時開很多個視窗工作" },
      { label: "B", text: "結合文字、圖像、影音等多種形式與 AI 協作" },
      { label: "C", text: "每天更換不同的辦公室" },
      { label: "D", text: "使用多種不同的電腦品牌" }
    ],
    correctAnswer: "B",
    explanation: "多模態辦公是指結合文字、圖像、影音等多種形式與 AI 協作，充分利用 Gemini 的多種功能。"
  },
  {
    id: 9,
    section: 1,
    week: 1,
    question: "「建立圖像」功能所使用的底層模型名稱為何？",
    options: [
      { label: "A", text: "Veo" },
      { label: "B", text: "Lyria 3" },
      { label: "C", text: "Nano Banana 2" },
      { label: "D", text: "Deep Search" }
    ],
    correctAnswer: "C",
    explanation: "建立圖像使用 Nano Banana 2 作為底層模型，能快速生成高品質的圖像。"
  },
  {
    id: 10,
    section: 1,
    week: 1,
    question: "主管在第一週課程中學到的「核心觀念」是什麼？",
    options: [
      { label: "A", text: "AI 是萬能的，不需要檢查" },
      { label: "B", text: "AI 是一個可以交辦任務的「頂級實習生」" },
      { label: "C", text: "應該把 AI 當作 Google 搜尋來用" },
      { label: "D", text: "傳產主管不需要懂 AI" }
    ],
    correctAnswer: "B",
    explanation: "核心觀念是將 AI 視為「頂級實習生」，可以交辦任務但仍需要審核和指導。"
  },

  // Week 2 - Prompt 溝通術 (Q11-Q20)
  {
    id: 11,
    section: 2,
    week: 2,
    question: "所謂的 \"Prompt\" (提示詞)，在主管的日常工作中可以理解為什麼？",
    options: [
      { label: "A", text: "電腦程式碼" },
      { label: "B", text: "交辦任務的指令" },
      { label: "C", text: "員工考核表" },
      { label: "D", text: "網路關鍵字" }
    ],
    correctAnswer: "B",
    explanation: "Prompt 就是交辦任務的指令，主管可以像交辦員工一樣交辦 AI。"
  },
  {
    id: 12,
    section: 2,
    week: 2,
    question: "為什麼 AI 有時候會給出過於官腔或不切實際的答案？",
    options: [
      { label: "A", text: "AI 故意開玩笑" },
      { label: "B", text: "AI 壞掉了" },
      { label: "C", text: "主管給的背景資訊不足（交辦不清楚）" },
      { label: "D", text: "AI 不喜歡傳產公司" }
    ],
    correctAnswer: "C",
    explanation: "AI 的輸出品質取決於 Prompt 的清晰度，背景資訊不足會導致不切實際的答案。"
  },
  {
    id: 13,
    section: 2,
    week: 2,
    question: "「黃金 Prompt 公式」中，【角色 (Role)】的功用是什麼？",
    options: [
      { label: "A", text: "告訴 AI 要輸出幾張圖" },
      { label: "B", text: "定位 AI 的專業身分與語氣" },
      { label: "C", text: "規定 AI 的回覆速度" },
      { label: "D", text: "紀錄 AI 的帳號名稱" }
    ],
    correctAnswer: "B",
    explanation: "角色定義 AI 應該扮演的專業身分與應採用的語氣，直接影響輸出品質。"
  },
  {
    id: 14,
    section: 2,
    week: 2,
    question: "在撰寫指令時，【背景 (Context)】應該包含哪些資訊？",
    options: [
      { label: "A", text: "昨天的天氣" },
      { label: "B", text: "電腦的作業系統" },
      { label: "C", text: "前因後果、讀者對象與限制條件" },
      { label: "D", text: "講師的姓名" }
    ],
    correctAnswer: "C",
    explanation: "背景應包含前因後果、讀者對象與限制條件，讓 AI 完全理解工作的上下文。"
  },
  {
    id: 15,
    section: 2,
    week: 2,
    question: "若要讓 AI 生成一個「表格」，這屬於黃金公式中的哪一個部分？",
    options: [
      { label: "A", text: "角色" },
      { label: "B", text: "任務" },
      { label: "C", text: "背景" },
      { label: "D", text: "格式 (Format)" }
    ],
    correctAnswer: "D",
    explanation: "表格是輸出的格式要求，屬於 Prompt 公式中的格式 (Format) 部分。"
  },
  {
    id: 16,
    section: 2,
    week: 2,
    question: "「黃金 Prompt 公式」的完整結構包含哪五個要素？",
    options: [
      { label: "A", text: "角色、任務、背景、格式、截止日期" },
      { label: "B", text: "角色、任務、背景、格式、範例" },
      { label: "C", text: "目標、方法、時間、資源、結果" },
      { label: "D", text: "問題、分析、建議、實施、評估" }
    ],
    correctAnswer: "B",
    explanation: "黃金 Prompt 公式包含：角色、任務、背景、格式、範例，缺一不可以達到最佳效果。"
  },
  {
    id: 17,
    section: 2,
    week: 2,
    question: "在 Prompt 中加入「範例」的目的是什麼？",
    options: [
      { label: "A", text: "填充字數" },
      { label: "B", text: "展示理想輸出的具體形式，降低 AI 的理解門檻" },
      { label: "C", text: "測試 AI 是否正常運作" },
      { label: "D", text: "讓 AI 複製範例內容" }
    ],
    correctAnswer: "B",
    explanation: "範例展示理想輸出的具體形式，大幅降低 AI 的理解門檻，提高結果精準度。"
  },
  {
    id: 18,
    section: 2,
    week: 2,
    question: "主管在撰寫 Prompt 時最容易犯的錯誤是什麼？",
    options: [
      { label: "A", text: "給的資訊太多" },
      { label: "B", text: "要求太具體" },
      { label: "C", text: "背景資訊不足或模糊，導致 AI 猜測" },
      { label: "D", text: "不使用中文" }
    ],
    correctAnswer: "C",
    explanation: "最常見的錯誤是背景資訊不足或模糊，導致 AI 無法準確理解需求而猜測。"
  },
  {
    id: 19,
    section: 2,
    week: 2,
    question: "若主管的 Prompt 得到不滿意的結果，第一步應該如何改進？",
    options: [
      { label: "A", text: "立即換一個工具" },
      { label: "B", text: "檢查並補充背景資訊或修改角色定位" },
      { label: "C", text: "認為 AI 壞掉了" },
      { label: "D", text: "放棄使用 AI" }
    ],
    correctAnswer: "B",
    explanation: "應該檢查 Prompt 本身，補充背景資訊或修改角色定位，通常就能獲得更好的結果。"
  },
  {
    id: 20,
    section: 2,
    week: 2,
    question: "Prompt 溝通術的最終目的是什麼？",
    options: [
      { label: "A", text: "讓主管變成程式設計師" },
      { label: "B", text: "掌握與 AI 高效溝通的能力，最大化工作效率" },
      { label: "C", text: "取代人類的工作" },
      { label: "D", text: "製造更多複雜的任務" }
    ],
    correctAnswer: "B",
    explanation: "最終目的是掌握與 AI 高效溝通的能力，讓 AI 成為真正的工作助力，最大化工作效率。"
  },

  // Week 3 - 數據處理工具 (Q21-Q30)
  {
    id: 21,
    section: 3,
    week: 3,
    question: "在企業數據處理中，主管最常面臨的挑戰是什麼？",
    options: [
      { label: "A", text: "Excel 檔案太小" },
      { label: "B", text: "數據量龐大、格式混亂、缺乏統一分析框架" },
      { label: "C", text: "員工的電腦太快" },
      { label: "D", text: "不需要做數據處理" }
    ],
    correctAnswer: "B",
    explanation: "企業數據處理的核心挑戰是量大、雜亂、缺乏統一框架，Gemini 的數據工具能有效解決這些問題。"
  },
  {
    id: 22,
    section: 3,
    week: 3,
    question: "Canvas 的「精準編輯器」功能在數據處理中的優勢是什麼？",
    options: [
      { label: "A", text: "只能畫圖" },
      { label: "B", text: "能局部修改和迭代，無需重新生成整份文件" },
      { label: "C", text: "自動刪除數據" },
      { label: "D", text: "不能處理 Excel" }
    ],
    correctAnswer: "B",
    explanation: "Canvas 允許主管進行局部修改，針對不滿意的部分進行精準調整，無需重新生成整份文件。"
  },
  {
    id: 23,
    section: 3,
    week: 3,
    question: "當主管需要分析一份結構複雜的 PDF 報告時，最適合使用什麼功能？",
    options: [
      { label: "A", text: "建立圖像" },
      { label: "B", text: "創作音樂" },
      { label: "C", text: "一般對話框搭配文件上傳" },
      { label: "D", text: "不能分析 PDF" }
    ],
    correctAnswer: "C",
    explanation: "Gemini 的一般對話框支持文件上傳功能，可以快速分析 PDF 內容並提取關鍵資訊。"
  },
  {
    id: 24,
    section: 3,
    week: 3,
    question: "Deep Research 對於數據分析的優勢是什麼？",
    options: [
      { label: "A", text: "速度快" },
      { label: "B", text: "能進行深層次的多源數據交叉驗證和趨勢分析" },
      { label: "C", text: "只能看新聞" },
      { label: "D", text: "無法進行數據分析" }
    ],
    correctAnswer: "B",
    explanation: "Deep Research 能進行多源數據的交叉驗證和深層趨勢分析，特別適合複雜的數據分析任務。"
  },
  {
    id: 25,
    section: 3,
    week: 3,
    question: "在使用 AI 進行數據處理時，主管應該如何確保數據安全？",
    options: [
      { label: "A", text: "不需要擔心" },
      { label: "B", text: "將機密數據直接上傳到任何 AI 工具" },
      { label: "C", text: "確認公司的資訊安全政策，只上傳必要的去敏感化數據" },
      { label: "D", text: "所有企業數據都不能用 AI 處理" }
    ],
    correctAnswer: "C",
    explanation: "應確認公司的資訊安全政策，只上傳必要的去敏感化數據，保護企業的商業機密。"
  },
  {
    id: 26,
    section: 3,
    week: 3,
    question: "當需要整理員工名單並生成部門報告時，最效率的步驟是什麼？",
    options: [
      { label: "A", text: "全部手動輸入" },
      { label: "B", text: "上傳 Excel 到 Gemini，要求按部門分類並生成摘要報告" },
      { label: "C", text: "放棄使用 AI" },
      { label: "D", text: "重新輸入所有數據" }
    ],
    correctAnswer: "B",
    explanation: "透過上傳 Excel 並指示 AI 進行分類和報告生成，可以大幅提升效率。"
  },
  {
    id: 27,
    section: 3,
    week: 3,
    question: "在數據視覺化中，Canvas 的角色是什麼？",
    options: [
      { label: "A", text: "無法製作圖表" },
      { label: "B", text: "能將數據轉化為美化的圖表、表格或信息圖，支援按需修改" },
      { label: "C", text: "只能文字處理" },
      { label: "D", text: "不能配合 Excel 使用" }
    ],
    correctAnswer: "B",
    explanation: "Canvas 可以將數據轉化為美化的圖表和信息圖，並支援局部修改，非常適合數據視覺化。"
  },
  {
    id: 28,
    section: 3,
    week: 3,
    question: "主管應該如何檢查 AI 生成的數據分析結果？",
    options: [
      { label: "A", text: "完全相信，不需要檢查" },
      { label: "B", text: "抽樣驗證邏輯，對比已知的業務數據" },
      { label: "C", text: "全部刪除重新做" },
      { label: "D", text: "不需要檢查，直接使用" }
    ],
    correctAnswer: "B",
    explanation: "應該抽樣驗證 AI 的邏輯推導，並對比已知的業務數據，確保分析結果的準確性。"
  },
  {
    id: 29,
    section: 3,
    week: 3,
    question: "哪種情況下不應該使用 AI 進行數據處理？",
    options: [
      { label: "A", text: "所有情況都可以" },
      { label: "B", text: "處理高度機密的未去敏感化企業數據" },
      { label: "C", text: "簡單的計算題" },
      { label: "D", text: "永遠不能用 AI" }
    ],
    correctAnswer: "B",
    explanation: "不應該上傳高度機密的未去敏感化企業數據，應遵守公司的資訊安全政策。"
  },
  {
    id: 30,
    section: 3,
    week: 3,
    question: "數據處理工具的核心價值是什麼？",
    options: [
      { label: "A", text: "取代會計部門" },
      { label: "B", text: "節省時間、提升準確性、支援決策制定" },
      { label: "C", text: "製造更多工作" },
      { label: "D", text: "不提供任何價值" }
    ],
    correctAnswer: "B",
    explanation: "核心價值是節省數據處理的時間、提升分析的準確性，並為主管的決策制定提供堅實的數據基礎。"
  },

  // Week 4 - Canvas, 建立影片, 創作音樂 (Q31-Q40)
  {
    id: 31,
    section: 4,
    week: 4,
    question: "Canvas 相比傳統對話框的最大優勢是什麼？",
    options: [
      { label: "A", text: "速度更快" },
      { label: "B", text: "提供獨立的編輯空間，支援實時迭代和局部修改" },
      { label: "C", text: "自動上傳到雲端" },
      { label: "D", text: "自動發佈到社群媒體" }
    ],
    correctAnswer: "B",
    explanation: "Canvas 的優勢是提供獨立的編輯空間，主管可以看著 AI 生成的內容進行實時迭代和精準修改。"
  },
  {
    id: 32,
    section: 4,
    week: 4,
    question: "主管想要快速生成一份初稿簡報，最適合的工作流程是什麼？",
    options: [
      { label: "A", text: "完全手動製作" },
      { label: "B", text: "在 Canvas 中生成草稿 → 精準潤飾 → 完成簡報" },
      { label: "C", text: "使用傳統對話框" },
      { label: "D", text: "不使用 AI" }
    ],
    correctAnswer: "B",
    explanation: "利用 Canvas 快速生成初稿，然後進行精準潤飾，是最高效的簡報製作流程。"
  },
  {
    id: 33,
    section: 4,
    week: 4,
    question: "在使用「建立影片」功能時，最重要的是什麼？",
    options: [
      { label: "A", text: "盡量使用" },
      { label: "B", text: "撰寫清晰的視覺描述 Prompt，並注意每日配額限制" },
      { label: "C", text: "不需要寫 Prompt" },
      { label: "D", text: "隨便生成" }
    ],
    correctAnswer: "B",
    explanation: "清晰的視覺描述和配額管理是使用「建立影片」的關鍵，要充分利用每日的有限配額。"
  },
  {
    id: 34,
    section: 4,
    week: 4,
    question: "「建立影片」適合用來製作什麼類型的內容？",
    options: [
      { label: "A", text: "只能用於娛樂" },
      { label: "B", text: "簡報開場動畫、產品展示影片、培訓影片" },
      { label: "C", text: "無法製作商業用途內容" },
      { label: "D", text: "只能是黑白影片" }
    ],
    correctAnswer: "B",
    explanation: "可用於製作簡報開場動畫、產品展示影片、員工培訓影片等多種商業內容。"
  },
  {
    id: 35,
    section: 4,
    week: 4,
    question: "在企業簡報中加入 AI 生成的背景音樂有什麼優勢？",
    options: [
      { label: "A", text: "沒有優勢" },
      { label: "B", text: "避免版權糾紛、提升專業感、與品牌調性一致" },
      { label: "C", text: "音質差" },
      { label: "D", text: "浪費時間" }
    ],
    correctAnswer: "B",
    explanation: "AI 生成的背景音樂不僅無版權困擾，還能完全符合簡報的品牌調性，提升專業感。"
  },
  {
    id: 36,
    section: 4,
    week: 4,
    question: "「創作音樂」的 Prompt 應該包含什麼元素？",
    options: [
      { label: "A", text: "隨意描述" },
      { label: "B", text: "風格、節奏、用途、長度、情緒" },
      { label: "C", text: "只寫一個詞" },
      { label: "D", text: "不需要 Prompt" }
    ],
    correctAnswer: "B",
    explanation: "應該明確指定風格、節奏、用途、長度、情緒等要素，才能生成符合需求的背景音樂。"
  },
  {
    id: 37,
    section: 4,
    week: 4,
    question: "主管在製作年度總結簡報時，最有效的多媒體組合是什麼？",
    options: [
      { label: "A", text: "只有文字" },
      { label: "B", text: "文字簡報 + Canvas 潤飾 + 背景音樂 + 開場動畫" },
      { label: "C", text: "只能用 PowerPoint" },
      { label: "D", text: "不需要多媒體" }
    ],
    correctAnswer: "B",
    explanation: "結合文字內容、Canvas 編輯、背景音樂和開場動畫，能製作出專業且引人入勝的簡報。"
  },
  {
    id: 38,
    section: 4,
    week: 4,
    question: "在使用「建立影片」時，應該如何應對配額限制？",
    options: [
      { label: "A", text: "放棄使用" },
      { label: "B", text: "優先製作最重要的影片，精心撰寫 Prompt，多次迭代" },
      { label: "C", text: "隨意生成" },
      { label: "D", text: "一次性用完配額" }
    ],
    correctAnswer: "B",
    explanation: "應該優先製作最重要的影片，撰寫精良的 Prompt，充分利用每日配額做出最優質的作品。"
  },
  {
    id: 39,
    section: 4,
    week: 4,
    question: "Canvas 的迭代功能對簡報製作的幫助是什麼？",
    options: [
      { label: "A", text: "沒有幫助" },
      { label: "B", text: "可以快速修改不滿意的部分，而無需重新生成整份簡報" },
      { label: "C", text: "自動發佈簡報" },
      { label: "D", text: "刪除內容" }
    ],
    correctAnswer: "B",
    explanation: "透過迭代功能，主管可以精準修改 Canvas 中不滿意的局部內容，無需費力重新生成整份簡報。"
  },
  {
    id: 40,
    section: 4,
    week: 4,
    question: "第四週學習的三大工具 (Canvas、建立影片、創作音樂) 的共同特點是什麼？",
    options: [
      { label: "A", text: "都只能做同一件事" },
      { label: "B", text: "都可以獨立使用，也可以組合應用，提升簡報和內容的專業度" },
      { label: "C", text: "無法組合使用" },
      { label: "D", text: "沒有實用價值" }
    ],
    correctAnswer: "B",
    explanation: "這三大工具可以獨立使用，更重要的是可以組合應用，共同打造高質量的簡報和多媒體內容。"
  },

  // 第五部分：綜合應用 (Q41-Q60)
  {
    id: 41,
    section: 5,
    question: "一位產品經理需要在一週內完成新產品上市的所有宣傳物料，應該如何運用 Gemini 的六大工具？",
    options: [
      { label: "A", text: "全部手動製作" },
      { label: "B", text: "Deep Research 蒐集市場資訊 → Canvas 製作文案 → 建立圖像設計海報 → 創作音樂配樂 → 建立影片製作廣告" },
      { label: "C", text: "只使用一個工具" },
      { label: "D", text: "不使用 AI" }
    ],
    correctAnswer: "B",
    explanation: "這是典型的多工具整合應用，充分發揮 Gemini 在內容創意到多媒體製作的全流程能力。"
  },
  {
    id: 42,
    section: 5,
    question: "主管在制定新年度的管理策略時，哪個 Gemini 工具最能幫助批判性思考？",
    options: [
      { label: "A", text: "建立圖像" },
      { label: "B", text: "引導式學習 (Guided Learning)" },
      { label: "C", text: "創作音樂" },
      { label: "D", text: "建立影片" }
    ],
    correctAnswer: "B",
    explanation: "引導式學習透過提問引導思考，最適合幫助主管進行深度的戰略分析和批判性思考。"
  },
  {
    id: 43,
    section: 5,
    question: "一家製造業公司想要培訓 50 位中階管理人員，如何利用 Gemini 設計培訓流程？",
    options: [
      { label: "A", text: "聘請外部講師" },
      { label: "B", text: "使用傳統簡報" },
      { label: "C", text: "Canvas 製作講義 + 建立影片製作教學動畫 + 引導式學習進行互動式練習 + 深度研究蒐集案例" },
      { label: "D", text: "放棄培訓" }
    ],
    correctAnswer: "C",
    explanation: "這是企業內部培訓的最佳實踐，結合多個工具打造系統化的高效能培訓方案。"
  },
  {
    id: 44,
    section: 5,
    question: "主管遇到一個複雜的跨部門協調問題，應該如何運用 Gemini 協助決策？",
    options: [
      { label: "A", text: "完全依賴 AI 決策" },
      { label: "B", text: "Deep Research 蒐集背景信息 → 引導式學習進行反思 → Canvas 整理思考方案 → 尋求團隊反饋" },
      { label: "C", text: "放棄使用 AI" },
      { label: "D", text: "直接做決定" }
    ],
    correctAnswer: "B",
    explanation: "這是將 AI 作為決策輔助的最佳流程，充分收集資訊、深化思考、組織方案。"
  },
  {
    id: 45,
    section: 5,
    question: "在撰寫企業年報時，主管應該採用什麼樣的 Gemini 工作流程？",
    options: [
      { label: "A", text: "全部外包給寫手" },
      { label: "B", text: "Deep Research 蒐集數據 → Canvas 撰寫初稿 → 建立圖像製作資訊圖 → 精準迭代調整 → 最終定稿" },
      { label: "C", text: "不使用 AI" },
      { label: "D", text: "隨意寫作" }
    ],
    correctAnswer: "B",
    explanation: "企業年報需要多層次的內容整合，這個流程最能確保品質和效率的結合。"
  },
  {
    id: 46,
    section: 5,
    question: "一位銷售主管想要為不同產品線客戶製作個性化的提案簡報，最有效的方式是什麼？",
    options: [
      { label: "A", text: "全部手動製作" },
      { label: "B", text: "使用 Canvas 快速生成客製化的提案框架 → 精準編輯調整 → 加入背景音樂和動畫 → 快速成稿" },
      { label: "C", text: "使用範本不修改" },
      { label: "D", text: "放棄個性化" }
    ],
    correctAnswer: "B",
    explanation: "Canvas 的快速生成和迭代功能，最適合製作大量客製化內容，大幅提升銷售效率。"
  },
  {
    id: 47,
    section: 5,
    question: "當主管需要準備一場重要的董事會報告時，哪種多媒體組合最具說服力？",
    options: [
      { label: "A", text: "只用文字" },
      { label: "B", text: "文字簡報 + 資訊圖 + 背景音樂 + 精準數據" },
      { label: "C", text: "越多動畫越好" },
      { label: "D", text: "不需要簡報" }
    ],
    correctAnswer: "B",
    explanation: "專業的多媒體組合應該是簡約但精準，文字、圖像、音樂、數據的有機結合，而非堆砌效果。"
  },
  {
    id: 48,
    section: 5,
    question: "主管想要建立一套內部知識管理系統，應該如何利用 Gemini？",
    options: [
      { label: "A", text: "放棄建立" },
      { label: "B", text: "使用 Canvas 撰寫知識文檔 + 建立圖像製作流程圖 + 引導式學習製作互動式學習模組" },
      { label: "C", text: "使用傳統 Word 文檔" },
      { label: "D", text: "不需要知識管理" }
    ],
    correctAnswer: "B",
    explanation: "這是建立現代化知識管理系統的最佳方案，充分發揮 AI 在內容組織和視覺化的優勢。"
  },
  {
    id: 49,
    section: 5,
    question: "在使用 Gemini 進行企業決策輔助時，主管最應該避免什麼？",
    options: [
      { label: "A", text: "使用 AI" },
      { label: "B", text: "完全依賴 AI 的建議而不加人工判斷" },
      { label: "C", text: "收集數據" },
      { label: "D", text: "尋求反饋" }
    ],
    correctAnswer: "B",
    explanation: "AI 是決策輔助工具，主管必須保持批判性思考，不能完全依賴 AI 的建議。"
  },
  {
    id: 50,
    section: 5,
    question: "當面臨一個行業轉型問題時，應該如何系統地運用 Gemini 的多個工具？",
    options: [
      { label: "A", text: "只用一個工具" },
      { label: "B", text: "Deep Research 蒐集行業趨勢 → 引導式學習進行深度思考 → Canvas 整理轉型方案 → 建立影片製作內部溝通影片" },
      { label: "C", text: "不使用 AI" },
      { label: "D", text: "隨意決定" }
    ],
    correctAnswer: "B",
    explanation: "系統的運用多個工具，才能應對複雜的戰略問題，從資訊蒐集到方案制定的全流程都有保障。"
  },
  {
    id: 51,
    section: 5,
    question: "一個銷售團隊想要統計過去一年的銷售數據並製作視覺化報告，最佳流程是什麼？",
    options: [
      { label: "A", text: "全部手動輸入和製作" },
      { label: "B", text: "上傳 Excel 數據 → Gemini 分析和整理 → Canvas 製作圖表 → 建立圖像優化設計 → 完成報告" },
      { label: "C", text: "不使用 AI" },
      { label: "D", text: "隨意製作" }
    ],
    correctAnswer: "B",
    explanation: "這是數據分析到視覺化的完整工作流程，充分發揮 Gemini 在數據處理和內容創意的優勢。"
  },
  {
    id: 52,
    section: 5,
    question: "在進行員工績效評估時，如何運用 Gemini 提高評估的客觀性？",
    options: [
      { label: "A", text: "完全憑感覺評估" },
      { label: "B", text: "上傳績效數據 → Gemini 提供數據分析視角 → 引導式學習引導深度思考 → 形成客觀評估結論" },
      { label: "C", text: "不使用 AI" },
      { label: "D", text: "隨意評估" }
    ],
    correctAnswer: "B",
    explanation: "AI 可以提供數據分析的客觀視角，配合引導式思考，能顯著提高績效評估的公正性。"
  },
  {
    id: 53,
    section: 5,
    question: "主管在應對一次市場危機時，應該如何快速運用 Gemini 制定應對方案？",
    options: [
      { label: "A", text: "手動分析所有信息" },
      { label: "B", text: "Deep Research 快速蒐集相關信息 → 引導式學習進行情景模擬 → Canvas 快速起草應對方案 → 建立影片製作內部通知" },
      { label: "C", text: "不使用 AI" },
      { label: "D", text: "延遲決策" }
    ],
    correctAnswer: "B",
    explanation: "在危機時刻，高效的 AI 工作流程能顯著加快決策速度，這是 AI 應用的關鍵價值體現。"
  },
  {
    id: 54,
    section: 5,
    question: "當需要與外國客戶進行商務溝通時，主管應該如何運用 Gemini？",
    options: [
      { label: "A", text: "自己翻譯" },
      { label: "B", text: "使用 Gemini 進行專業翻譯 → Canvas 優化文案表達 → 確保商務用語準確" },
      { label: "C", text: "放棄使用 AI" },
      { label: "D", text: "直接發送原稿" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 不僅能翻譯，還能確保商務用語的準確性和專業度，Canvas 則能進一步優化表達。"
  },
  {
    id: 55,
    section: 5,
    question: "在製定部門年度計畫時，應該如何系統地運用 Gemini 確保計畫的完整性？",
    options: [
      { label: "A", text: "完全憑經驗制定" },
      { label: "B", text: "Deep Research 蒐集市場趨勢 → 引導式學習進行戰略思考 → Canvas 撰寫計畫書 → Canvas 精準迭代調整" },
      { label: "C", text: "不使用 AI" },
      { label: "D", text: "隨意制定" }
    ],
    correctAnswer: "B",
    explanation: "系統化的運用 AI，能確保年度計畫既符合市場趨勢，又經過深度的戰略思考，提高計畫品質。"
  },
  {
    id: 56,
    section: 5,
    question: "主管想要建立一套員工培訓課程體系，哪個工具組合最有效？",
    options: [
      { label: "A", text: "只使用一個工具" },
      { label: "B", text: "Canvas 製作課程講義 + 建立影片製作教學動畫 + 引導式學習製作互動練習 + 創作音樂製作片尾曲" },
      { label: "C", text: "聘請外部課程公司" },
      { label: "D", text: "不建立課程" }
    ],
    correctAnswer: "B",
    explanation: "這個工具組合能打造一個現代化、高互動、多媒體的培訓課程體系，提升學習效果。"
  },
  {
    id: 57,
    section: 5,
    question: "當需要進行跨部門的溝通和協調時，主管應該優先使用哪個工具？",
    options: [
      { label: "A", text: "建立圖像" },
      { label: "B", text: "Canvas 製作清晰的協作文檔 + 引導式學習引導各部門思考" },
      { label: "C", text: "傳統 Email" },
      { label: "D", text: "口頭溝通" }
    ],
    correctAnswer: "B",
    explanation: "Canvas 和引導式學習的結合，能確保跨部門溝通既清晰又包容，提高協作效率。"
  },
  {
    id: 58,
    section: 5,
    question: "在進行客戶提案時，如何運用 Gemini 提高成功率？",
    options: [
      { label: "A", text: "使用範本不修改" },
      { label: "B", text: "Deep Research 了解客戶背景 → Canvas 製作客製化提案 → 建立圖像優化設計 → 加入背景音樂提升專業度" },
      { label: "C", text: "不使用 AI" },
      { label: "D", text: "隨意提案" }
    ],
    correctAnswer: "B",
    explanation: "深入了解客戶背景、製作客製化方案、打造專業的多媒體呈現，是提高提案成功率的關鍵。"
  },
  {
    id: 59,
    section: 5,
    question: "主管在學習新的行業知識時，最應該如何運用引導式學習？",
    options: [
      { label: "A", text: "直接要求 AI 給出答案" },
      { label: "B", text: "透過 AI 的引導提問來深化自己的思考，逐步掌握知識的本質" },
      { label: "C", text: "不需要學習" },
      { label: "D", text: "放棄使用 AI" }
    ],
    correctAnswer: "B",
    explanation: "引導式學習的價值在於培養深度思考能力，不是直接提供答案，而是引導學習者自己發現答案。"
  },
  {
    id: 60,
    section: 5,
    question: "經過四週的 Gemini 課程學習，主管最應該帶走的核心價值是什麼？",
    options: [
      { label: "A", text: "AI 可以完全替代人類管理" },
      { label: "B", text: "掌握與 AI 高效協作的能力，成為『AI 時代的智慧決策者』" },
      { label: "C", text: "AI 沒有用處" },
      { label: "D", text: "不需要改變管理方式" }
    ],
    correctAnswer: "B",
    explanation: "這正是四週課程的最終目標：讓主管掌握與 AI 協作的能力，提升自己的決策品質和工作效率。"
  }
];

export function getQuestionsBySection(section: number): QuizQuestion[] {
  return quizData.filter(q => q.section === section);
}

export function getQuestionsByWeek(week: number): QuizQuestion[] {
  return quizData.filter(q => q.week === week);
}

export function getQuestionById(id: number): QuizQuestion | undefined {
  return quizData.find(q => q.id === id);
}
