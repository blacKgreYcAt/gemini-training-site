export interface Course {
  id: string;
  week: number;
  module: number;
  title: string;
  description: string;
  content: string;
  duration_minutes: number;
}

export const courseData: Course[] = [
  // Week 1
  {
    id: "1-1",
    week: 1,
    module: 1,
    title: "見樹又見林 —— Gemini 六大神器總覽",
    description: "帶領主管巡禮左側工具列的所有功能，了解 AI 的能力邊界",
    content: "第一週第一模組：了解 Gemini 的六大核心神器和應用場景",
    duration_minutes: 120,
  },
  {
    id: "1-2",
    week: 1,
    module: 2,
    title: "Gemini 介面導覽與基礎設定",
    description: "熟悉 Gemini 的工作界面和基本操作流程",
    content: "第一週第二模組：詳細介面說明和初期設定教學",
    duration_minutes: 120,
  },
  {
    id: "1-3",
    week: 1,
    module: 3,
    title: "AI 能力邊界與實踐限制",
    description: "了解 AI 的能力邊界，建立正確期望",
    content: "第一週第三模組：認識 AI 的優勢和限制",
    duration_minutes: 120,
  },
  // Week 2
  {
    id: "2-1",
    week: 2,
    module: 1,
    title: "打破舊觀念：AI 不只是搜尋工具",
    description: "重新認識 AI 的真正價值和商業應用",
    content: "第二週第一模組：AI 與傳統工具的根本差異",
    duration_minutes: 120,
  },
  {
    id: "2-2",
    week: 2,
    module: 2,
    title: "四段式交辦公式 - Prompt 黃金法則",
    description: "掌握商業實用的 Prompt 溝通術",
    content: "第二週第二模組：精通 Prompt 撰寫技巧",
    duration_minutes: 120,
  },
  {
    id: "2-3",
    week: 2,
    module: 3,
    title: "Prompt 優化與迭代技巧",
    description: "不斷優化提示詞以獲得更好結果",
    content: "第二週第三模組：進階 Prompt 最佳實踐",
    duration_minutes: 120,
  },
  // Week 3
  {
    id: "3-1",
    week: 3,
    module: 1,
    title: "告別 Google 海洋迷航",
    description: "用 AI 高效找資料、讀重點",
    content: "第三週第一模組：智能信息檢索技術",
    duration_minutes: 120,
  },
  {
    id: "3-2",
    week: 3,
    module: 2,
    title: "文件分析與數據處理",
    description: "將死板檔案變成活字典",
    content: "第三週第二模組：AI 驅動的文件分析",
    duration_minutes: 120,
  },
  {
    id: "3-3",
    week: 3,
    module: 3,
    title: "構建個人知識庫與資料檔案系統",
    description: "建立組織化的信息管理體系",
    content: "第三週第三模組：知識管理系統構建",
    duration_minutes: 120,
  },
  // Week 4
  {
    id: "4-1",
    week: 4,
    module: 1,
    title: "長文修改與 SOP 撰寫專攻",
    description: "用 AI 高效完成企業文件創作",
    content: "第四週第一模組：專業文件創作技術",
    duration_minutes: 120,
  },
  {
    id: "4-2",
    week: 4,
    module: 2,
    title: "沉浸式協作與團隊應用",
    description: "在團隊中高效應用 Gemini",
    content: "第四週第二模組：企業協作最佳實踐",
    duration_minutes: 120,
  },
  {
    id: "4-3",
    week: 4,
    module: 3,
    title: "視覺點綴與多模態生成",
    description: "為簡報配上漂亮配圖，融會四週技能",
    content: "第四週第三模組：多模態內容生成",
    duration_minutes: 120,
  },
];
