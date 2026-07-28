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
  // ========== 第一層：基礎認識 (20題) ==========

  // Q1-5: 平台和訪問方式
  {
    id: 1,
    section: 1,
    week: 0,
    question: "Gemini 3.1 Flash Live 相比普通 Gemini 最大的優勢是什麼？",
    options: [
      { label: "A", text: "支援更多語言" },
      { label: "B", text: "自然語音節奏和實時響應速度更快" },
      { label: "C", text: "只能在 Android 上使用" },
      { label: "D", text: "可以生成視頻" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 3.1 Flash Live 的核心升級是實現了更自然的語音節奏和接近真人的實時響應速度，使語音對話體驗更流暢。"
  },
  {
    id: 2,
    section: 1,
    week: 0,
    question: "在電腦網頁版（gemini.google.com）中，你可以直接做什麼？",
    options: [
      { label: "A", text: "只能進行簡單文字對話" },
      { label: "B", text: "匯出至 Google 文件、Canvas 編輯、Deep Research、上傳大文件分析" },
      { label: "C", text: "無法使用六大神器" },
      { label: "D", text: "無法生成圖像和視頻" }
    ],
    correctAnswer: "B",
    explanation: "網頁版是功能最完整的介面，支援所有核心功能如匯出、Canvas、Deep Research 等高級功能。"
  },
  {
    id: 3,
    section: 1,
    week: 0,
    question: "Gemini 3.1 Pro 和免費版的核心差異是什麼？",
    options: [
      { label: "A", text: "Pro 版只能在手機上使用" },
      { label: "B", text: "Pro 版提供 Deep Research、Veo 3.1 影片生成、Gems 自訂 AI、更強大的推理能力" },
      { label: "C", text: "Pro 版無法進行文字對話" },
      { label: "D", text: "免費版和 Pro 版完全一樣，只是收費不同" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 3.1 Pro 包含企業級功能如 Deep Research、Veo 3.1 影片生成、無限 Gems、更強推理能力等。"
  },
  {
    id: 4,
    section: 1,
    week: 0,
    question: "Veo 3.1 最新版支援哪些影片特性？",
    options: [
      { label: "A", text: "只支援 720p 和橫向格式" },
      { label: "B", text: "支援 720p/1080p/4K、橫向/直立、native 配音、視頻延伸、Reference images 引導" },
      { label: "C", text: "只能生成黑白視頻" },
      { label: "D", text: "不支援音頻" }
    ],
    correctAnswer: "B",
    explanation: "Veo 3.1 是 2026 年的重大升級，支援多種解析度、格式、自動配音和進階創意功能如視頻延伸和參考圖片引導。"
  },
  {
    id: 5,
    section: 1,
    week: 0,
    question: "Chat History Import 的主要用途是什麼？",
    options: [
      { label: "A", text: "將 ChatGPT 的對話導入 Gemini 並保留完整上下文" },
      { label: "B", text: "刪除舊的 AI 平台對話" },
      { label: "C", text: "加密所有對話" },
      { label: "D", text: "無法導入任何對話" }
    ],
    correctAnswer: "A",
    explanation: "Chat History Import 允許用戶從其他 AI 平台（如 ChatGPT、Claude）無縫導入對話，保留完整上下文在 Gemini 中繼續工作。"
  },

  // Q6-10: 模型和訂閱
  {
    id: 6,
    section: 1,
    week: 0,
    question: "Gemini 3.1 Ultra 和 Pro 的訂閱費用是什麼關係？",
    options: [
      { label: "A", text: "Ultra 比 Pro 便宜 50%" },
      { label: "B", text: "價格相同，但 Ultra 功能無上限（Deep Research 無限、Gems 無限、4K 影片）" },
      { label: "C", text: "Ultra 貴 10 倍" },
      { label: "D", text: "Ultra 完全免費" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 3.1 Ultra 與 Pro 月費相同（約 20 USD），但 Ultra 提供無限次 Deep Research、無限 Gems、4K 影片等企業級功能。"
  },
  {
    id: 7,
    section: 1,
    week: 0,
    question: "以下哪個功能只有 Gemini 3.1 Ultra 才有？",
    options: [
      { label: "A", text: "文字對話和圖像分析" },
      { label: "B", text: "Canvas 編輯器" },
      { label: "C", text: "Veo 3.1 視頻生成（4K、視頻延伸、Reference images）和無限 Deep Research" },
      { label: "D", text: "學習模式" }
    ],
    correctAnswer: "C",
    explanation: "Ultra 獨享 4K 影片生成、無限 Deep Research 次數、無限 Gems 創建和優先生成隊列等高級功能。"
  },
  {
    id: 8,
    section: 1,
    week: 0,
    question: "對於中小企業主管，哪個訂閱方案通常最划算？",
    options: [
      { label: "A", text: "完全用免費版就夠了" },
      { label: "B", text: "Gemini 3.1 Pro（提供足夠的 Deep Research、Veo 影片、Gems 等核心功能）" },
      { label: "C", text: "一定要升級到 Ultra" },
      { label: "D", text: "無法判斷" }
    ],
    correctAnswer: "B",
    explanation: "Pro 版對於中小企業已足夠，提供 5 個 Gems、3 次/日 Veo 影片、5 次/月 Deep Research，ROI 極高。"
  },
  {
    id: 9,
    section: 1,
    week: 0,
    question: "Gemini 的 Canvas 編輯器在所有版本都能使用嗎？",
    options: [
      { label: "A", text: "只有 Pro 和 Ultra 能用" },
      { label: "B", text: "免費版也能使用" },
      { label: "C", text: "只能在手機上使用" },
      { label: "D", text: "需要額外付費的插件" }
    ],
    correctAnswer: "B",
    explanation: "Canvas 是一個核心工具，在所有版本（包括免費版）都可用，用於並排編輯和精細修改內容。"
  },
  {
    id: 10,
    section: 1,
    week: 0,
    question: "如果你每月需要 10 份深度研究報告，應該選擇什麼？",
    options: [
      { label: "A", text: "免費版（0 次 Deep Research）" },
      { label: "B", text: "Pro 版（5 次/月，不夠）" },
      { label: "C", text: "Ultra 版（無限次，適合你的需求）" },
      { label: "D", text: "都不適合" }
    ],
    correctAnswer: "C",
    explanation: "每月 10 份研究超過 Pro 版的 5 次限制，只有 Ultra 的無限 Deep Research 才能滿足這個需求。"
  },

  // Q11-15: 實時功能和特性
  {
    id: 11,
    section: 1,
    week: 0,
    question: "Gemini Live 最適合用在什麼場景？",
    options: [
      { label: "A", text: "查一個簡單的事實（如『巴黎的首都是什麼』）" },
      { label: "B", text: "進行多輪語音對話，如面試練習、創意頭腦風暴、複雜問題解決" },
      { label: "C", text: "生成視頻" },
      { label: "D", text: "編輯圖片" }
    ],
    correctAnswer: "B",
    explanation: "Gemini Live 最強大之處在於流暢的多輪語音對話，特別適合需要互動和反複確認的場景如面試練習和創意討論。"
  },
  {
    id: 12,
    section: 1,
    week: 0,
    question: "用 Gemini Live 進行英文面試練習，AI 會做什麼？",
    options: [
      { label: "A", text: "只能錄製你的聲音，無法互動" },
      { label: "B", text: "根據你的回答動態提問、檢查發音、給予反馬威機會、最後提供反饋" },
      { label: "C", text: "只能翻譯英文，無法提問" },
      { label: "D", text: "無法理解你說的內容" }
    ],
    correctAnswer: "B",
    explanation: "Gemini Live 可以進行完整的模擬面試，包括提問、實時反應、追問和最後的全面反饋，如同真實面試。"
  },
  {
    id: 13,
    section: 1,
    week: 0,
    question: "Gemini 的隱私設定中，最重要的是什麼？",
    options: [
      { label: "A", text: "無法改變隱私設定" },
      { label: "B", text: "是否允許 Gemini 用你的對話改善模型（公司用戶建議關閉）" },
      { label: "C", text: "隱私設定與功能無關" },
      { label: "D", text: "無需關心隱私" }
    ],
    correctAnswer: "B",
    explanation: "在設定中可以選擇是否允許 Gemini 使用你的對話數據來改善模型。公司員工應該關閉此設定以保護機密信息。"
  },
  {
    id: 14,
    section: 1,
    week: 0,
    question: "Gemini 支援哪些文件格式的上傳和分析？",
    options: [
      { label: "A", text: "只支援 TXT 文件" },
      { label: "B", text: "PDF、Word、圖片、長網頁截圖等多種格式" },
      { label: "C", text: "無法上傳任何文件" },
      { label: "D", text: "只能上傳視頻" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 支援多種文件格式包括 PDF、Word、圖片、掃描文件等，方便用戶上傳各類文檔進行分析。"
  },
  {
    id: 15,
    section: 1,
    week: 0,
    question: "使用 Gemini 時，什麼信息「絕對禁止」輸入？",
    options: [
      { label: "A", text: "任何信息都可以" },
      { label: "B", text: "公司未公開的財報、新產品設計圖、客戶名單、合約細節等企業機密" },
      { label: "C", text: "只禁止輸入密碼" },
      { label: "D", text: "沒有限制" }
    ],
    correctAnswer: "B",
    explanation: "企業機密、未公開財報、原型設計、客戶名單等敏感信息絕對不應該輸入 Gemini，以防數據洩露。"
  },

  // ========== 第二層：應用決策 (60題) ==========

  // 文本應用 (15題)
  {
    id: 16,
    section: 2,
    week: 1,
    question: "你需要快速整理 50 封未讀郵件，掌握核心要點。最佳做法是什麼？",
    options: [
      { label: "A", text: "逐封讀一遍（需要 2 小時）" },
      { label: "B", text: "直接刪除" },
      { label: "C", text: "複製所有郵件內容到 Gemini，要求「總結每封郵件的核心內容和所需行動」" },
      { label: "D", text: "發郵件要求同事幫你總結" }
    ],
    correctAnswer: "C",
    explanation: "複製所有郵件到 Gemini 並要求總結是最快的方式，通常 5-10 分鐘就能掌握所有要點和需要的行動。"
  },
  {
    id: 17,
    section: 2,
    week: 1,
    question: "你起草了一份營銷提案，但不確定邏輯是否清晰。用 Gemini 怎麼檢查？",
    options: [
      { label: "A", text: "無法檢查邏輯" },
      { label: "B", text: "複製全文到 Gemini，要求「檢查這份提案的邏輯是否緊密，有沒有跳躍或矛盾？給出改進建議」" },
      { label: "C", text: "只能自己檢查" },
      { label: "D", text: "交給專業編輯修改" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 可以快速分析文章邏輯、找出跳躍和矛盾，並提出改進建議，比自己檢查快得多。"
  },
  {
    id: 18,
    section: 2,
    week: 1,
    question: "如果你要為不同受眾寫多個版本的同一份內容（給客戶、給內部、給董事會），最有效的做法是？",
    options: [
      { label: "A", text: "分別手寫三遍" },
      { label: "B", text: "寫好一個版本，然後分別要求 Gemini「改寫成給客戶的版本（強調 ROI）」、「改寫成內部備忘錄（簡潔）」、「改寫成給董事會的版本（強調戰略）」" },
      { label: "C", text: "無法快速生成多版本" },
      { label: "D", text: "複製貼上同一個版本" }
    ],
    correctAnswer: "B",
    explanation: "用 Gemini 一份基稿快速改寫成多個針對性版本，比手工寫三遍快 10 倍，且質量更高。"
  },
  {
    id: 19,
    section: 2,
    week: 1,
    question: "ROPE 框架中，哪個部分最容易被忽視但最影響結果？",
    options: [
      { label: "A", text: "Role（角色）" },
      { label: "B", text: "Objective（目標）" },
      { label: "C", text: "Parameters（具體條件和限制）— 很多人不指定，導致 AI 隨意發揮" },
      { label: "D", text: "Execute（格式）" }
    ],
    correctAnswer: "C",
    explanation: "許多人只說明角色和目標，卻忽視 Parameters（預算、受眾、時間限制等具體條件），導致 AI 給出不夠精準的成品。"
  },
  {
    id: 20,
    section: 2,
    week: 1,
    question: "給 Gemini 的上下文越多，結果越好。以下哪個最能說明這一點？",
    options: [
      { label: "A", text: "「寫報告」的結果和「寫一份給科技公司董事會的 Q3 業績報告，重點突出市場機會和風險」的結果一樣好" },
      { label: "B", text: "「寫報告」給出通用版本，而詳細的提示詞給出針對性的專業版本，質量差 10 倍" },
      { label: "C", text: "上下文不影響結果" },
      { label: "D", text: "上下文越少越好" }
    ],
    correctAnswer: "B",
    explanation: "具體的背景、受眾、條件能讓 Gemini 產出針對性的高質量成品，而模糊提示只能給出通用版本。"
  },
  {
    id: 21,
    section: 2,
    week: 1,
    question: "你要用 Gemini 寫一份售後客服郵件。應該提供哪些上下文？",
    options: [
      { label: "A", text: "不需要任何上下文" },
      { label: "B", text: "客戶的具體問題、你們公司的品牌風格、服務承諾、之前的互動歷史（如有）" },
      { label: "C", text: "只需要客戶的名字" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "提供客戶問題詳情、公司風格、服務承諾和歷史互動，能讓 Gemini 生成高度個性化和專業的售後郵件。"
  },
  {
    id: 22,
    section: 2,
    week: 1,
    question: "Canvas 編輯器相比對話框的最大優勢是什麼？",
    options: [
      { label: "A", text: "只能在手機上使用" },
      { label: "B", text: "左邊聊天、右邊即時編輯，可以精確修改句子而不影響其他部分" },
      { label: "C", text: "沒有優勢，功能相同" },
      { label: "D", text: "無法編輯" }
    ],
    correctAnswer: "B",
    explanation: "Canvas 的左聊天右編輯設計允許用戶點擊修改特定部分（如『把第二段改短』），而不是整篇重寫。"
  },
  {
    id: 23,
    section: 2,
    week: 1,
    question: "如果 Gemini 生成的內容不符合預期，應該怎麼做？",
    options: [
      { label: "A", text: "放棄使用 Gemini" },
      { label: "B", text: "用對話框反向提問：『這太通用了。請告訴我你需要什麼額外信息』，Gemini 會給出需要的細節" },
      { label: "C", text: "直接刪除" },
      { label: "D", text: "無法改進" }
    ],
    correctAnswer: "B",
    explanation: "這是『迭代優化』，高手都會讓 Gemini 反向提問，然後根據需求提供細節，最後重新生成更精準的成品。"
  },
  {
    id: 24,
    section: 2,
    week: 1,
    question: "為什麼對企業主管來說，用 Gemini 寫「第一稿」比「完成稿」更重要？",
    options: [
      { label: "A", text: "AI 無法寫完成稿" },
      { label: "B", text: "消除『空白頁恐懼症』，快速獲得方向，節省思考時間，然後你在第一稿基礎上優化（花 30 分鐘改稿比花 2 小時從零開始快 4 倍）" },
      { label: "C", text: "完成稿更好" },
      { label: "D", text: "沒有區別" }
    ],
    correctAnswer: "B",
    explanation: "主管價值在於『判斷和決策』，不是『內容產出』。快速獲得第一稿後再優化，比從零開始寫快得多。"
  },
  {
    id: 25,
    section: 2,
    week: 1,
    question: "在辦公環境中，哪類文檔最不適合完全交給 Gemini 自動生成？",
    options: [
      { label: "A", text: "內部流程說明" },
      { label: "B", text: "涉及法律、合規、財務數據的文檔（需要 100% 人工審核）" },
      { label: "C", text: "簡報稿" },
      { label: "D", text: "電子郵件" }
    ],
    correctAnswer: "B",
    explanation: "法律、合規、財務文檔風險高，必須 100% 人工審核。其他文檔可以 AI 生成後人工優化。"
  },

  // 圖像應用 (15題)
  {
    id: 26,
    section: 2,
    week: 2,
    question: "你需要為簡報快速找 20 張配圖。用 Gemini 怎麼做最有效？",
    options: [
      { label: "A", text: "在 Google 搜圖，手動下載（1-2 小時，有版權風險）" },
      { label: "B", text: "逐一描述場景，要求 Gemini 生成（720p 解析度、科技感、辦公場景等）20 張圖，直接用於簡報（15 分鐘，無版權問題）" },
      { label: "C", text: "無法快速獲得配圖" },
      { label: "D", text: "購買圖庫（費用高）" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 的圖像生成可以快速生成無版權商業級配圖，比搜索和購買都快得多且無版權風險。"
  },
  {
    id: 27,
    section: 2,
    week: 2,
    question: "Gemini 生成的圖像可以用於商業用途嗎？",
    options: [
      { label: "A", text: "不可以，只能個人使用" },
      { label: "B", text: "可以，Gemini 生成的圖像可以用於商業目的（簡報、網站、廣告等）" },
      { label: "C", text: "需要特殊許可" },
      { label: "D", text: "不清楚" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 生成的圖像內容可以用於商業用途，這對企業用戶來說是巨大的優勢，節省設計和購買成本。"
  },
  {
    id: 28,
    section: 2,
    week: 2,
    question: "如何利用 Gemini 的視覺分析能力幫助客戶呈現競爭優勢？",
    options: [
      { label: "A", text: "無法分析視覺信息" },
      { label: "B", text: "上傳競爭對手的產品照片，要求『對比我們產品和競爭對手的差異』，Gemini 會從視覺角度分析" },
      { label: "C", text: "只能分析文字" },
      { label: "D", text: "無法幫助呈現" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 可以分析上傳的圖片並進行對比分析，幫助企業從視覺角度發現和說明產品差異。"
  },
  {
    id: 29,
    section: 2,
    week: 2,
    question: "程式錯誤時，用 Gemini 檢查比自己找更快是因為什麼？",
    options: [
      { label: "A", text: "Gemini 會自動修復" },
      { label: "B", text: "你不用手打代碼，只需截圖上傳，Gemini 自動識別錯誤類型、位置和修復方案（省去 50% 的分析時間）" },
      { label: "C", text: "無法檢查程式" },
      { label: "D", text: "速度相同" }
    ],
    correctAnswer: "B",
    explanation: "上傳截圖比手打代碼快得多，Gemini 的視覺識別能直接定位錯誤並提出修復方案。"
  },
  {
    id: 30,
    section: 2,
    week: 2,
    question: "你拍了公司會議白板的照片。Gemini 能做什麼？",
    options: [
      { label: "A", text: "無法識別白板內容" },
      { label: "B", text: "識別白板內容，自動轉成結構化文字、生成會議紀錄、提出核心要點和行動項目" },
      { label: "C", text: "只能存檔" },
      { label: "D", text: "需要手動整理" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 可以識別白板照片並轉換成結構化會議紀錄，是提升會議效率的關鍵功能。"
  },
  {
    id: 31,
    section: 2,
    week: 2,
    question: "在圖像生成時，為了確保品牌一致性，應該怎麼做？",
    options: [
      { label: "A", text: "生成後再修改" },
      { label: "B", text: "在提示詞中明確指定：風格（『極簡現代』）、色彩（『藍色和白色』）、情緒（『專業信任』），多生成幾版本選擇" },
      { label: "C", text: "無法確保一致性" },
      { label: "D", text: "交給設計師" }
    ],
    correctAnswer: "B",
    explanation: "在提示詞中詳細指定風格、色彩、情緒等品牌要素，然後生成多版本選擇，能確保品牌視覺一致。"
  },
  {
    id: 32,
    section: 2,
    week: 2,
    question: "如果上傳的文檔太長（100+ 頁），Gemini 會怎麼處理？",
    options: [
      { label: "A", text: "無法處理" },
      { label: "B", text: "可以處理，但應該明確告訴 Gemini『請只提取最重要的 5 個要點』或『給出 1-2 頁的執行摘要』" },
      { label: "C", text: "會卡死" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 可以處理長文檔，但最好在提示詞中明確要求摘要或關鍵點提取，確保得到可用的信息。"
  },
  {
    id: 33,
    section: 2,
    week: 2,
    question: "用 Gemini 分析一張銷售數據表格，最有效的提示詞應該包括？",
    options: [
      { label: "A", text: "『分析這個表格』" },
      { label: "B", text: "『分析這份銷售表格，列出：(1) 銷售額最高的地區，(2) 月度趨勢異常，(3) 產品類別貢獻度，(4) 為什麼這些地區表現好，(5) 下月建議。用表格展示。'" },
      { label: "C", text: "『這是什麼？』" },
      { label: "D", text: "無法分析表格" }
    ],
    correctAnswer: "B",
    explanation: "具體的分析維度和要求會讓 Gemini 生成更精準的洞察，包括排名、趨勢異常和可行建議。"
  },
  {
    id: 34,
    section: 2,
    week: 2,
    question: "以下哪個情況下不應該用 Gemini 分析圖像？",
    options: [
      { label: "A", text: "分析市場競品的外觀和功能" },
      { label: "B", text: "從醫療掃描影像中做出診斷（需要醫學專業人士確認）" },
      { label: "C", text: "識別簽約合約中的關鍵條款" },
      { label: "D", text: "理解簡報中的數據圖表" }
    ],
    correctAnswer: "B",
    explanation: "醫療診斷涉及生命安全，即使 Gemini 能識別影像，也必須由醫學專業人士最終確認，不能完全依賴 AI。"
  },
  {
    id: 35,
    section: 2,
    week: 2,
    question: "某個圖像分析結果不符合預期。怎麼改進？",
    options: [
      { label: "A", text: "放棄使用" },
      { label: "B", text: "調整提示詞（『不是整體分析，而是重點對比價格標籤』），或上傳更清晰的照片，或提供背景信息" },
      { label: "C", text: "無法改進" },
      { label: "D", text: "只能手工分析" }
    ],
    correctAnswer: "B",
    explanation: "圖像分析可以通過調整提示詞、提供背景信息或上傳更清晰的照片來改進，體現迭代優化的重要性。"
  },
  {
    id: 36,
    section: 2,
    week: 2,
    question: "Gemini 的圖像識別準確率通常有多高？",
    options: [
      { label: "A", text: "50% 以下" },
      { label: "B", text: "通常 80-95% 準確，但涉及敏感判斷時應配合人工審核" },
      { label: "C", text: "100% 準確" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 的圖像識別準確率很高，但不是完美的。涉及重要決策時應配合人工審核，確保准確性。"
  },
  {
    id: 37,
    section: 2,
    week: 2,
    question: "如何用 Gemini 快速估算市場報告中的數據可信度？",
    options: [
      { label: "A", text: "無法估算" },
      { label: "B", text: "上傳報告圖表，要求『找出來源信息、核對數據是否與官方統計一致、評估可信度』，Gemini 會幫你驗證" },
      { label: "C", text: "只能相信原報告" },
      { label: "D", text: "無法確認" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 可以幫助驗證報告中的數據來源和可信度，特別是對比官方統計數據時非常有用。"
  },

  // 視頻應用 (15題)
  {
    id: 38,
    section: 2,
    week: 2,
    question: "用 Veo 3.1 生成社媒短視頻，Pro 版本最大的限制是什麼？",
    options: [
      { label: "A", text: "無法生成視頻" },
      { label: "B", text: "每日 3 次、720p HD 解析度、不支援 4K 和視頻延伸功能" },
      { label: "C", text: "完全無限制" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Pro 版每天限制 3 個視頻生成，且只能 720p，不支援 4K 和視頻延伸等高級功能（Ultra 無限制）。"
  },
  {
    id: 39,
    section: 2,
    week: 2,
    question: "如果你需要為 TikTok 製作豎屏短視頻，Veo 3.1 能做什麼？",
    options: [
      { label: "A", text: "只支援橫屏" },
      { label: "B", text: "支援 9:16 直立格式，完美適配 TikTok、Instagram Reels 等豎屏平台" },
      { label: "C", text: "無法調整格式" },
      { label: "D", text: "需要手工轉換" }
    ],
    correctAnswer: "B",
    explanation: "Veo 3.1 支援多種格式包括 9:16 直立，完全適配各大短視頻平台，無需後續轉換。"
  },
  {
    id: 40,
    section: 2,
    week: 2,
    question: "什麼是『視頻延伸』功能？它解決什麼問題？",
    options: [
      { label: "A", text: "無此功能" },
      { label: "B", text: "生成了 8 秒視頻後，能自動無縫延伸成 16 或 24 秒，解決『需要長視頻但不想重新生成』的問題" },
      { label: "C", text: "只能剪輯" },
      { label: "D", text: "無法延伸視頻" }
    ],
    correctAnswer: "B",
    explanation: "視頻延伸是 Veo 3.1 的革命性功能，允許用戶無縫擴展已生成的視頻，大大提高創意效率。"
  },
  {
    id: 41,
    section: 2,
    week: 2,
    question: "『Reference Images』在視頻生成中的作用是什麼？",
    options: [
      { label: "A", text: "沒有作用" },
      { label: "B", text: "上傳參考照片引導視頻的視覺風格和色調，確保生成的視頻與品牌視覺一致" },
      { label: "C", text: "只能用於靜態圖像" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Reference Images 允許用戶用參考照片指導視頻的視覺風格，確保品牌視覺一致性和專業度。"
  },
  {
    id: 42,
    section: 2,
    week: 2,
    question: "Veo 3.1 生成的視頻自動包含音頻嗎？",
    options: [
      { label: "A", text: "不包含" },
      { label: "B", text: "『Native 配音』功能自動生成音效和背景音樂，但可選是否包含" },
      { label: "C", text: "需要手工添加" },
      { label: "D", text: "無法添加音頻" }
    ],
    correctAnswer: "B",
    explanation: "Veo 3.1 的 native 配音功能自動生成適配的音效和背景音樂，提高視頻的專業度和完整性。"
  },
  {
    id: 43,
    section: 2,
    week: 2,
    question: "生成高質量 4K 視頻的最大優勢是什麼？",
    options: [
      { label: "A", text: "無法生成 4K" },
      { label: "B", text: "適合提交給客戶、用於品牌宣傳、印刷成海報，提升專業度（但成本是 720p 的 3-5 倍）" },
      { label: "C", text: "無區別" },
      { label: "D", text: "不值得投資" }
    ],
    correctAnswer: "B",
    explanation: "4K 視頻適合客戶呈現和品牌宣傳，但需要 Ultra 訂閱，成本更高，應根據用途選擇。"
  },
  {
    id: 44,
    section: 2,
    week: 2,
    question: "以下哪個場景最適合用 Veo 3.1 生成視頻？",
    options: [
      { label: "A", text: "需要真人演員和複雜情節的營銷片" },
      { label: "B", text: "快速內容社媒短視頻（產品展示、動畫解說、概念動畫、AI 科技感展示）" },
      { label: "C", text: "電影級別的製作" },
      { label: "D", text: "錄製現場活動" }
    ],
    correctAnswer: "B",
    explanation: "Veo 3.1 最擅長快速生成社媒短視頻、動畫解說和概念展示，成本低速度快。"
  },
  {
    id: 45,
    section: 2,
    week: 2,
    question: "如何提高 Veo 3.1 生成視頻的質量？",
    options: [
      { label: "A", text: "無法改進" },
      { label: "B", text: "詳細的提示詞（描述場景、光線、情緒、風格）+ 參考圖片 + 多次迭代試驗 + 4K 生成" },
      { label: "C", text: "只能用默認設定" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "提高視頻質量需要多方面努力：精細提示詞、參考圖片、迭代優化和適當的解析度選擇。"
  },
  {
    id: 46,
    section: 2,
    week: 2,
    question: "生成視頻後，應該怎麼編輯和優化？",
    options: [
      { label: "A", text: "直接用，無需編輯" },
      { label: "B", text: "如果滿意可直接用，如果不滿意可以用簡單編輯軟體（CapCut、剪映）調整色彩、加字幕、調整速度" },
      { label: "C", text: "一定要用複雜編輯軟體" },
      { label: "D", text: "無法編輯" }
    ],
    correctAnswer: "B",
    explanation: "Veo 3.1 生成的視頻可以直接用，也可以用簡單編輯軟體做微調以滿足特定需求。"
  },
  {
    id: 47,
    section: 2,
    week: 2,
    question: "如果視頻生成不符合預期，最常見的原因是什麼？",
    options: [
      { label: "A", text: "總是成功" },
      { label: "B", text: "提示詞不夠詳細、場景過於複雜、色彩要求與內容衝突、或沒有提供參考圖片" },
      { label: "C", text: "無法改進" },
      { label: "D", text: "系統故障" }
    ],
    correctAnswer: "B",
    explanation: "視頻生成質量取決於提示詞精確度和參考圖片清晰度，通常迭代改進提示詞能大幅提高效果。"
  },
  {
    id: 48,
    section: 2,
    week: 2,
    question: "為什麼說『視頻延伸』改變了短視頻製作的工作流？",
    options: [
      { label: "A", text: "沒有改變" },
      { label: "B", text: "過去需要重新生成或手工編輯來延長視頻，現在一鍵無縫延伸，節省 50% 的製作時間" },
      { label: "C", text: "無差別" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "視頻延伸功能大幅簡化了內容製作流程，特別是對創意人員和社媒團隊來說，提升效率巨大。"
  },
  {
    id: 49,
    section: 2,
    week: 2,
    question: "關於用 Gemini 音樂生成，以下哪個最準確？",
    options: [
      { label: "A", text: "無法生成音樂" },
      { label: "B", text: "用 Lyria 3 生成 30 秒專業級背景音樂，可用於視頻、簡報、廣告（無版權問題）" },
      { label: "C", text: "只能生成簡單聲音" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Lyria 3 音樂生成功能很強大，可以根據指定的情緒、風格、樂器等生成高質量背景音樂，完全無版權問題。"
  },
  {
    id: 50,
    section: 2,
    week: 2,
    question: "如何快速組裝一個完整的視頻（Veo + 音樂 + 字幕）？",
    options: [
      { label: "A", text: "需要專業軟體和團隊" },
      { label: "B", text: "用 Veo 3.1 生成視頻（8 秒）→ 用 Lyria 3 生成配樂 → 用 CapCut 或剪映添加字幕和調整（總共 30 分鐘，一個人完成）" },
      { label: "C", text: "無法快速組裝" },
      { label: "D", text: "必須外包" }
    ],
    correctAnswer: "B",
    explanation: "現代視頻製作已經民主化，一個人用免費簡易工具就能快速組裝專業級視頻，大幅降低成本。"
  },

  // 語音應用 (15題)
  {
    id: 51,
    section: 2,
    week: 3,
    question: "Gemini Live 的『自然語音節奏』指的是什麼？",
    options: [
      { label: "A", text: "機械式的逐字朗讀" },
      { label: "B", text: "真人說話的節奏和停頓，讓對話流暢自然，不生硬" },
      { label: "C", text: "快速機器語音" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "自然語音節奏是 Gemini 3.1 Flash Live 的核心升級，使語音對話更像真人交流而不是機器朗讀。"
  },
  {
    id: 52,
    section: 2,
    week: 3,
    question: "什麼時候應該用 Gemini Live 進行語音交互而不是文字？",
    options: [
      { label: "A", text: "文字和語音效果相同" },
      { label: "B", text: "多輪複雜對話、面試練習、創意討論、需要實時反饋和反馬威時，語音效率快 10 倍" },
      { label: "C", text: "永遠用文字" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "語音對話在複雜多輪對話中效率遠高於文字，特別是涉及互動和實時反應的場景。"
  },
  {
    id: 53,
    section: 2,
    week: 3,
    question: "進行英文面試練習時，應該怎麼用 Gemini Live？",
    options: [
      { label: "A", text: "無法練習" },
      { label: "B", text: "說『我要準備英文工作面試，你扮演面試官』→ 自然對話 → Gemini 反問、糾正發音、給建議 → 練習完後獲得反饋報告" },
      { label: "C", text: "只能讀預設問題" },
      { label: "D", text: "無法互動" }
    ],
    correctAnswer: "B",
    explanation: "Gemini Live 可以進行完整的面試模擬，包括提問、反馬威、發音糾正和最後的全面反饋。"
  },
  {
    id: 54,
    section: 2,
    week: 3,
    question: "用 Gemini Live 進行創意頭腦風暴的優勢是什麼？",
    options: [
      { label: "A", text: "沒有優勢" },
      { label: "B", text: "實時對話讓思想碰撞，Gemini 能提出新角度和擴展想法，比自己思考快 3-5 倍" },
      { label: "C", text: "只能聽取意見，無法交流" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Gemini Live 的實時對話非常適合頭腦風暴，AI 能快速提出新視角並根據你的反應調整，大幅加速創意過程。"
  },
  {
    id: 55,
    section: 2,
    week: 3,
    question: "進行 Gemini Live 對話時，如果有不同意見怎麼辦？",
    options: [
      { label: "A", text: "無法反駁" },
      { label: "B", text: "可以中斷提問『為什麼？』、『你有其他角度嗎？』，Gemini 會實時解釋並提供替代觀點" },
      { label: "C", text: "只能接受" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Gemini Live 允許實時反駁和提問，AI 會立即解釋並提供替代視角，實現真正的對話交流。"
  },
  {
    id: 56,
    section: 2,
    week: 3,
    question: "Gemini Live 對語言學習者的幫助是什麼？",
    options: [
      { label: "A", text: "無法幫助" },
      { label: "B", text: "可以練習發音、語法、日常對話，Gemini 會糾正錯誤、提供反饋、調整難度以適應學習進度" },
      { label: "C", text: "只能翻譯" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Gemini Live 是語言學習的強大工具，提供實時反饋和個性化學習路徑，效果優於傳統教材。"
  },
  {
    id: 57,
    section: 2,
    week: 3,
    question: "什麼是『反馬威』（follow-up questions）？為什麼在面試中很重要？",
    options: [
      { label: "A", text: "沒有重要性" },
      { label: "B", text: "面試官在你回答後追問『為什麼選擇這個方案？』等問題，考察你的深度思考，Gemini Live 能真實模擬這個過程" },
      { label: "C", text: "不應該問反問題" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "反馬威是真實面試的關鍵環節，Gemini Live 能根據你的回答動態提出追問，幫助你提前適應這種壓力。"
  },
  {
    id: 58,
    section: 2,
    week: 3,
    question: "完成一次 Gemini Live 面試練習後，應該怎麼利用反饋？",
    options: [
      { label: "A", text: "直接忘記" },
      { label: "B", text: "記錄 AI 指出的弱點（發音、邏輯、表達），下次練習前重點改進，循環 2-3 次達到面試水準" },
      { label: "C", text: "無法改進" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "反饋的價值在於迭代改進，通過重複練習和針對性改進，最終達到面試水準。"
  },
  {
    id: 59,
    section: 2,
    week: 3,
    question: "Gemini Live 支援哪些語言？",
    options: [
      { label: "A", text: "只支援英文" },
      { label: "B", text: "支援中文、英文、日文、西班牙文等多種語言" },
      { label: "C", text: "只支援文字，不支援語音" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Gemini Live 支援多種語言，使其成為全球用戶進行語言練習和對話的強大工具。"
  },
  {
    id: 60,
    section: 2,
    week: 3,
    question: "用 Gemini Live 進行商務協商練習的優勢是什麼？",
    options: [
      { label: "A", text: "無法幫助商務" },
      { label: "B", text: "模擬真實談判環境，Gemini 會提出異議、尋求讓步、提出替代方案，幫助你提前準備應對策略" },
      { label: "C", text: "只能聽講解" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Gemini Live 可以模擬複雜的商務協商場景，幫助高管提前演練應對策略，大幅提高成功率。"
  },
  {
    id: 61,
    section: 2,
    week: 3,
    question: "Gemini Live 對話的隱私如何保護？",
    options: [
      { label: "A", text: "無隱私保護" },
      { label: "B", text: "遵循同樣的隱私政策，可在設定中關閉『用對話改善模型』，對話內容與 Workspace 內容一樣受保護" },
      { label: "C", text: "完全公開" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Gemini Live 隱私保護與其他功能相同，企業用戶可以關閉數據改善功能以保護機密信息。"
  },
  {
    id: 62,
    section: 2,
    week: 3,
    question: "什麼時候不應該用 Gemini Live 進行語音交互？",
    options: [
      { label: "A", text: "所有情況都適合" },
      { label: "B", text: "在公共場所（隱私考慮）、涉及機密信息（未關閉數據改善）、需要書面記錄的正式場景（應配合文字對話）" },
      { label: "C", text: "永遠不要用" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Gemini Live 很強大但有適用場景限制，特別是隱私和保密是重要考慮因素。"
  },
  {
    id: 63,
    section: 2,
    week: 3,
    question: "完成一次面試模擬後，為了達到最佳效果，應該怎麼做？",
    options: [
      { label: "A", text: "做一次就夠了" },
      { label: "B", text: "第一次模擬 → 分析弱點 → 改進 → 第二次模擬 → 再改進 → 第三次模擬（循環 2-3 次）" },
      { label: "C", text: "無法改進" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "面試模擬的價值在於迭代改進，單次練習效果有限，需要多次循環才能達到理想水準。"
  },
  {
    id: 64,
    section: 2,
    week: 3,
    question: "Gemini Live 的『實時響應』相比文字對話快多少？",
    options: [
      { label: "A", text: "速度相同" },
      { label: "B", text: "快 3-5 倍，因為無需打字，Gemini 能實時反應和追問" },
      { label: "C", text: "更慢" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "語音對話的實時性遠超文字，特別是在複雜多輪對話中，能大幅提升溝通效率和結果質量。"
  },
  {
    id: 65,
    section: 2,
    week: 3,
    question: "如果 Gemini Live 的反應不符合預期，怎麼辦？",
    options: [
      { label: "A", text: "無法改進" },
      { label: "B", text: "可以中斷並重新提問『用不同的角度』『更簡單的說法』『舉例說明』，Gemini 會調整回應方式" },
      { label: "C", text: "只能接受" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Gemini Live 允許實時調整，用戶可以引導 AI 改變說法、提高深度或簡化複雜概念。"
  },

  // ========== 第三層：進階判斷 (20題) ==========

  // 倫理和風險 (6題)
  {
    id: 66,
    section: 3,
    week: 4,
    question: "AI 幻覺（Hallucination）最常見的表現是什麼？",
    options: [
      { label: "A", text: "無法生成內容" },
      { label: "B", text: "編造不存在的人名、數據、論文引用等，然後一本正經地說出來" },
      { label: "C", text: "崩潰報錯" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "AI 幻覺是 AI 編造事實但呈現得非常可信，這正是最危險的地方，用戶容易被騙。"
  },
  {
    id: 67,
    section: 3,
    week: 4,
    question: "如何用『Google Double-Check』驗證 Gemini 的答案？",
    options: [
      { label: "A", text: "無法驗證" },
      { label: "B", text: "點擊回答下方的 Google 圖示 → Gemini 自動查 Google 搜尋 → 綠色（可信）或紅色（可疑）結果提示" },
      { label: "C", text: "只能手工驗證" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Google Double-Check 是 Gemini 內置的事實驗證功能，對於重要信息應該總是使用。"
  },
  {
    id: 68,
    section: 3,
    week: 4,
    question: "以下哪個信息『絕對禁止』輸入 Gemini？",
    options: [
      { label: "A", text: "日常查詢和想法" },
      { label: "B", text: "公司未公開的財報、員工隱私信息、客戶合約細節、產品機密設計" },
      { label: "C", text: "學習資料" },
      { label: "D", text: "無限制" }
    ],
    correctAnswer: "B",
    explanation: "企業機密、個人隱私和未公開信息絕對不應該輸入任何 AI 工具，存在數據洩露風險。"
  },
  {
    id: 69,
    section: 3,
    week: 4,
    question: "什麼時候應該進行『跨源驗證』（檢查至少 2-3 個獨立來源）？",
    options: [
      { label: "A", text: "永遠不用驗證" },
      { label: "B", text: "涉及金錢決策、健康建議、法律問題、企業戰略決策時必須跨源驗證" },
      { label: "C", text: "永遠驗證所有信息" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "高風險決策必須跨源驗證，不能依賴單一信息來源，特別是 AI 輸出。"
  },
  {
    id: 70,
    section: 3,
    week: 4,
    question: "如何在提示詞中要求 Gemini 負責任地提供來源？",
    options: [
      { label: "A", text: "無法要求來源" },
      { label: "B", text: "在提示詞中明確說『請為你的數據和論點提供來源連結或參考文獻』，Gemini 會自動約束自己只用真實來源" },
      { label: "C", text: "AI 無法提供來源" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "主動要求來源能讓 Gemini 更謹慎，傾向使用可驗證的信息而不是編造。"
  },
  {
    id: 71,
    section: 3,
    week: 4,
    question: "企業使用 Gemini 時，最重要的隱私設定是什麼？",
    options: [
      { label: "A", text: "無需改變設定" },
      { label: "B", text: "關閉『用對話改善模型』選項，防止機密信息被用於 AI 訓練" },
      { label: "C", text: "不影響隱私" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "企業用戶應該在設定中關閉數據改善功能，確保機密信息不被用於模型訓練。"
  },

  // 企業決策 (7題)
  {
    id: 72,
    section: 3,
    week: 4,
    question: "什麼時候應該用 Deep Research 而不是普通 Gemini 對話？",
    options: [
      { label: "A", text: "任何時候都一樣" },
      { label: "B", text: "需要多角度深度分析、跨網頁資料整合、決策級別的報告時，Deep Research 回報率遠高於普通對話" },
      { label: "C", text: "Deep Research 沒有優勢" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Deep Research 的價值在於複雜分析和決策支持，簡單查詢用普通對話就夠，應該根據複雜度選擇。"
  },
  {
    id: 73,
    section: 3,
    week: 4,
    question: "決策前用 Gemini 評估風險時，最重要的是什麼？",
    options: [
      { label: "A", text: "直接相信 AI 的風險評估" },
      { label: "B", text: "AI 提供初步風險分析，但最終決策必須由有行業經驗的人做 + 跨源驗證關鍵假設 + 考慮 AI 可能遺漏的人為因素" },
      { label: "C", text: "無法評估風險" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "AI 提供風險框架，但終極決策權應由經驗豐富的管理層行使，結合定性和定量分析。"
  },
  {
    id: 74,
    section: 3,
    week: 4,
    question: "AI 時代，『提問能力』為什麼比『回答能力』更重要？",
    options: [
      { label: "A", text: "回答能力更重要" },
      { label: "B", text: "AI 很擅長回答，主管的核心價值轉向『問對問題』（戰略判斷），而不是『自己找答案』（執行力）" },
      { label: "C", text: "兩者同等重要" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "AI 時代，人的差異化價值在於戰略思維和問題定義，而不是執行力。提問能力成為核心競爭力。"
  },
  {
    id: 75,
    section: 3,
    week: 4,
    question: "基於 AI 洞察做決策時，最常見的失誤是什麼？",
    options: [
      { label: "A", text: "完全不用 AI" },
      { label: "B", text: "100% 信任 AI 的建議，不考慮定性因素（團隊能力、市場變化、競爭對手反應等）" },
      { label: "C", text: "AI 建議總是正確的" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "AI 提供的是基於數據的量化分析，但重大決策需要加入定性判斷、經驗和直覺，二者結合才是最優。"
  },
  {
    id: 76,
    section: 3,
    week: 4,
    question: "如何評估一個 AI 時代的主管的核心能力？",
    options: [
      { label: "A", text: "懂多少 AI 技術細節" },
      { label: "B", text: "能否有效利用 AI 提升團隊效率 + 批判性思考 + 戰略眼光 + 倫理判斷 + 人才管理" },
      { label: "C", text: "只看 KPI" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "AI 時代主管的核心能力不是懂 AI 技術，而是懂得如何戰略性地利用 AI 和發展人才。"
  },
  {
    id: 77,
    section: 3,
    week: 4,
    question: "什麼情況下 Gemini 的建議應該『直接拒絕』而不是改進迭代？",
    options: [
      { label: "A", text: "任何建議都可以改進" },
      { label: "B", text: "涉及違法、違反公司價值觀、有明顯倫理問題、或超出商業合理範圍的建議應該直接拒絕" },
      { label: "C", text: "無法拒絕 AI" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "AI 雖然強大，但在倫理和合規邊界上必須有人類的最終判斷，某些建議不應該改進而是拒絕。"
  },
  {
    id: 78,
    section: 3,
    week: 4,
    question: "企業集體使用 Gemini 時，最容易出現的問題是什麼？",
    options: [
      { label: "A", text: "團隊效率不提升" },
      { label: "B", text: "不同團隊對 AI 的信任度和應用方式不一致，導致數據洩露或質量問題（需要統一的指引和訓練）" },
      { label: "C", text: "無法解決" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "團隊級別的 AI 應用需要統一的政策、訓練和文化，否則容易出現風險和效率問題。"
  },

  // 專家級應用 (7題)
  {
    id: 79,
    section: 3,
    week: 4,
    question: "什麼是『多 Gems 協作』？它的商業價值是什麼？",
    options: [
      { label: "A", text: "無此概念" },
      { label: "B", text: "為不同職能建立專用 Gems（銷售 Gem、財務 Gem、HR Gem 等），每個 Gem 都內建該領域的知識和規範，團隊協作效率翻倍" },
      { label: "C", text: "無法協作" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "多 Gems 協作創造了分工但統一的 AI 工作環境，每個部門用量身定製的 AI 助手，大幅提升協作效率。"
  },
  {
    id: 80,
    section: 3,
    week: 4,
    question: "設計一個企業級 Gem 時，哪個部分最容易被忽視但影響最大？",
    options: [
      { label: "A", text: "指令設定" },
      { label: "B", text: "知識庫（上傳的公司政策、案例、數據）— 沒有高質量的知識庫，Gem 就只是通用 Gemini 的複製品" },
      { label: "C", text: "風格設定" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Gems 的價值來自於內建的知識庫和上下文，沒有好的知識庫，Gem 就失去了定製化的優勢。"
  },
  {
    id: 81,
    section: 3,
    week: 4,
    question: "如何衡量 Gemini 投資的 ROI（投資回報率）？",
    options: [
      { label: "A", text: "無法衡量" },
      { label: "B", text: "時間節省（每週省多少小時）× 時薪 - 訂閱費 = ROI。通常 3-5 個月內回本" },
      { label: "C", text: "只能主觀判斷" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 的 ROI 可以數字化衡量，基於時間節省計算，大多企業能在數月內看到正回報。"
  },
  {
    id: 82,
    section: 3,
    week: 4,
    question: "什麼是『AI 時代的決策文化』？",
    options: [
      { label: "A", text: "聽主管說話，執行命令" },
      { label: "B", text: "提出問題 → 用 Gemini/Deep Research 收集數據 → 集體討論 → 民主決策，更開放、更數據驅動、更快" },
      { label: "C", text: "完全自動化決策" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "AI 時代的決策文化更民主化、更數據驅動，不是取代人的決策，而是用 AI 增強決策質量。"
  },
  {
    id: 83,
    section: 3,
    week: 4,
    question: "如何防止團隊『過度依賴 Gemini』失去批判思維？",
    options: [
      { label: "A", text: "禁用 Gemini" },
      { label: "B", text: "強調 Gemini 是『工具』而非『答案』，要求團隊總是『質疑、驗證、思考』AI 的輸出，訓練批判性思維" },
      { label: "C", text: "無法防止" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "使用 AI 工具時最大的風險是喪失思維能力，企業文化應該鼓勵批判性思考和驗證，而不是盲目相信。"
  },
  {
    id: 84,
    section: 3,
    week: 4,
    question: "在 AI 時代，企業最需要什麼類型的人才？",
    options: [
      { label: "A", text: "只懂 AI 技術的人" },
      { label: "B", text: "既懂業務又懂 AI 應用、具備批判思維、能帶領團隊適應變化的『混合型』人才" },
      { label: "C", text: "傳統技能的人才" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "企業最缺的是既懂業務又懂 AI 應用的人才，他們能橋接技術和商業，推動真正的轉變。"
  },
  {
    id: 85,
    section: 3,
    week: 4,
    question: "未來 5 年，AI 對工作市場的最大影響是什麼？",
    options: [
      { label: "A", text: "所有工作都會消失" },
      { label: "B", text: "『重複性、可自動化的工作』會減少，『策略性、創意性、人際互動』的工作會增加，懂 AI 的人薪資會翻倍" },
      { label: "C", text: "無影響" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "AI 會消除重複勞動，但會創造更高級的工作，適應能力強和懂 AI 的人會最受歡迎。"
  },

  // 額外題目來達到 100 題
  {
    id: 86,
    section: 3,
    week: 4,
    question: "Gemini 3.1 Pro 和 Ultra 在推理能力上的差異有多大？",
    options: [
      { label: "A", text: "完全相同" },
      { label: "B", text: "Ultra 的推理能力更強，特別是在複雜問題、多步邏輯、創意任務上表現更優（大約快 20-30%）" },
      { label: "C", text: "無差別" },
      { label: "D", text: "Pro 更強" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 3.1 Ultra 是 Google 最頂級的模型，在複雜推理上確實優於 Pro，但對大多數任務 Pro 足夠。"
  },
  {
    id: 87,
    section: 3,
    week: 4,
    question: "如何快速判斷一個 Gemini 生成的分析『可信度』？",
    options: [
      { label: "A", text: "直接相信" },
      { label: "B", text: "看數據來源是否明確 + 邏輯是否清晰 + 使用 Double-Check 驗證 + 檢查有沒有明顯的偏見" },
      { label: "C", text: "無法判斷" },
      { label: "D", text: "完全不信" }
    ],
    correctAnswer: "B",
    explanation: "評估 AI 輸出可信度需要多個維度的檢查，而不是單一信號，這是 AI 時代的必備技能。"
  },
  {
    id: 88,
    section: 3,
    week: 4,
    question: "如果 Gemini 拒絕回答某個問題，這通常意味著什麼？",
    options: [
      { label: "A", text: "功能故障" },
      { label: "B", text: "問題涉及違法、有害、隱私侵犯等敏感內容，Gemini 的安全過濾被觸發了（這是設計特性，不是 bug）" },
      { label: "C", text: "AI 無能力" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 的拒絕通常是合理的安全措施，而不是限制。理解這些邊界很重要。"
  },
  {
    id: 89,
    section: 3,
    week: 4,
    question: "為什麼『提高 Gemini 的效能』不是『學習更多提示詞技巧』？",
    options: [
      { label: "A", text: "提示詞技巧最重要" },
      { label: "B", text: "真正的效能來自『清晰的思考（什麼是你真正的問題）』+ 『準確的背景信息』+ 『迭代改進』，技巧只是輔助" },
      { label: "C", text: "技巧和思考同等重要" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Gemini 的效能根本上取決於使用者的思維清晰度，而不是炫技。好的提示詞來自清晰的想法。"
  },
  {
    id: 90,
    section: 3,
    week: 4,
    question: "在企業環境中，應該如何設定 Gemini 的使用政策？",
    options: [
      { label: "A", text: "無需政策，自由使用" },
      { label: "B", text: "明確『可以用什麼、不可以用什麼』（企業機密、個人數據）、『數據安全措施』（關閉改善模型）、『責任人制度』" },
      { label: "C", text: "禁止使用" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "企業級 Gemini 應用需要明確的政策和邊界，防止誤用和數據洩露。"
  },
  {
    id: 91,
    section: 3,
    week: 4,
    question: "什麼是 Pro 版本『價值最高』的使用場景？",
    options: [
      { label: "A", text: "所有場景都相同" },
      { label: "B", text: "深度研究（一份 Deep Research 報告省 3-5 小時）和視頻生成（省設計和編輯費用），這兩個場景 ROI 最高" },
      { label: "C", text: "文字對話" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "Pro 版本的最大價值在於時間和成本節省，特別是 Deep Research 和視頻生成這類高價值但高成本的任務。"
  },
  {
    id: 92,
    section: 3,
    week: 4,
    question: "AI 時代，『人機協作』的黃金比例是多少？",
    options: [
      { label: "A", text: "100% AI，0% 人工" },
      { label: "B", text: "AI 負責『執行和產出』（80%），人負責『判斷和決策』（20%），但這比例根據任務而異" },
      { label: "C", text: "100% 人工，0% AI" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "理想的人機協作不是一個固定比例，而是『人類在決策、AI 在執行』的模式，比例因任務而異。"
  },
  {
    id: 93,
    section: 3,
    week: 4,
    question: "如何評估一個組織『AI 就緒度』（是否準備好大規模應用 AI）？",
    options: [
      { label: "A", text: "技術就緒度" },
      { label: "B", text: "除了技術，還要看『數據質量』『人才培訓』『政策規範』『文化接受度』『倫理準則』—— 任何一個弱就會拖累整體" },
      { label: "C", text: "購買足夠的訂閱" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "AI 就緒度是一個多維度評估，不能只看技術，人員、政策、文化都很關鍵。"
  },
  {
    id: 94,
    section: 3,
    week: 4,
    question: "什麼時候應該『升級』從 Pro 到 Ultra？",
    options: [
      { label: "A", text: "立即升級" },
      { label: "B", text: "當你每月需要超過 5 份 Deep Research、超過 8 個 4K 視頻、或需要無限 Gems 時才升級（數據驅動決策）" },
      { label: "C", text: "永遠不升級" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "升級決策應該基於實際使用需求和 ROI，而不是盲目追求最高版本。"
  },
  {
    id: 95,
    section: 3,
    week: 4,
    question: "在『AI 時代的決策管理』中，什麼是最容易被忽視的環節？",
    options: [
      { label: "A", text: "數據收集" },
      { label: "B", text: "決策『執行後的監控』— 做決策容易，持續監控和及時調整難，但這決定了決策的最終成敗" },
      { label: "C", text: "決策本身" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "許多組織做決策時很用心，但執行後就不追蹤了。真正的智慧組織會持續監控和迭代調整。"
  },
  {
    id: 96,
    section: 3,
    week: 4,
    question: "Gemini 3.1 Pro 和 Ultra 的『無限 Deep Research』意味著什麼商業價值？",
    options: [
      { label: "A", text: "無實際價值" },
      { label: "B", text: "可以每天做 10+ 份深度分析（新產品研究、市場監控、競品追蹤、風險評估），即時掌握市場動態，比競爭對手快一步" },
      { label: "C", text: "無區別" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "無限 Deep Research 的價值在於『持續監控』和『實時決策』，讓企業始終領先市場。"
  },
  {
    id: 97,
    section: 3,
    week: 4,
    question: "在 AI 時代，什麼能力會『最不值錢』？",
    options: [
      { label: "A", text: "創意思維" },
      { label: "B", text: "純執行力和記憶力（AI 比人強），這些工作會被自動化，掌握這些的人最容易被取代" },
      { label: "C", text: "批判思維" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "AI 會直接替代執行力和記憶力驅動的工作，所以這些能力會貶值，而戰略和創意能力會升值。"
  },
  {
    id: 98,
    section: 3,
    week: 4,
    question: "如何防止『AI 決策陷阱』（AI 建議導致的決策失誤）？",
    options: [
      { label: "A", text: "完全不信 AI" },
      { label: "B", text: "三層檢查：(1) AI 的邏輯是否清晰，(2) 數據來源是否可信，(3) 決策是否考慮了 AI 無法量化的定性因素" },
      { label: "C", text: "只信 AI" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "AI 決策陷阱來自過度信任或不適當應用，需要人類的最終判斷和多層檢查。"
  },
  {
    id: 99,
    section: 3,
    week: 4,
    question: "為什麼說『提示詞』本質上反映的是『思維質量』？",
    options: [
      { label: "A", text: "無關聯" },
      { label: "B", text: "好的提示詞必須『清楚地定義問題、背景、限制』，這正是清晰思考的體現，思維模糊的人無法寫出好提示詞" },
      { label: "C", text: "只是技巧" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "提示詞工程本質上不是技巧，而是思維方法。好提示詞的人往往思維更清晰，更善於分析。"
  },
  {
    id: 100,
    section: 3,
    week: 4,
    question: "這門課最核心的一句話是什麼？",
    options: [
      { label: "A", text: "Gemini 可以做所有事情" },
      { label: "B", text: "Gemini 是『執行工具』，人是『決策者』。掌握怎麼『問問題』比『懂技巧』重要，批判思維比操作能力更值錢。學會用 AI 改變工作方式，而不是被 AI 改變。" },
      { label: "C", text: "AI 會取代所有人" },
      { label: "D", text: "無法確定" }
    ],
    correctAnswer: "B",
    explanation: "這門課的核心就是『人 + AI 的最佳協作方式』。AI 是工具，人的判斷力才是未來的價值所在。"
  }
];

/**
 * 根據章節 ID 獲取對應的問題組
 * 用於舊版 quiz 頁面的相容性
 */
export function getQuestionsBySection(sectionId: number): QuizQuestion[] {
  const sectionMap: { [key: number]: { min: number; max: number } } = {
    1: { min: 1, max: 20 },      // 基礎認識 (20題)
    2: { min: 21, max: 35 },     // 文本應用 (15題)
    3: { min: 36, max: 50 },     // 圖像應用 (15題)
    4: { min: 51, max: 65 },     // 視頻與音頻 (15題)
    5: { min: 66, max: 80 },     // 語音應用 (15題)
    6: { min: 81, max: 100 }     // 進階應用 (20題)
  };

  const range = sectionMap[sectionId];
  if (!range) {
    return [];
  }

  return quizData.filter(q => q.id >= range.min && q.id <= range.max);
}
