#!/bin/bash

# 使用 Gemini API 翻譯課程為日文
# 執行: bash scripts/translate-courses.sh

API_KEY="AQ.Ab8RN6K9ozEpvkoPtOfxH5tkXt60zcrIeHuR-gRGeXIl8PgdXw"
API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$API_KEY"

# 翻譯函數
translate_text() {
    local text="$1"

    # 構建 JSON 請求
    local json_data=$(cat <<EOF
{
  "contents": [{
    "parts": [{
      "text": "將以下繁體中文翻譯為日文，只返回翻譯結果，不包含其他文字：\n\n$text"
    }]
  }]
}
EOF
)

    # 調用 API
    local response=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "$json_data")

    # 提取翻譯結果
    echo "$response" | grep -o '"text":"[^"]*"' | head -1 | cut -d'"' -f4
}

echo "🚀 開始翻譯課程..."

# 簡單測試翻譯
test_text="Gemini Registration and Multi-Device Setup"
echo "測試翻譯: $test_text"
result=$(translate_text "$test_text")
echo "結果: $result"
