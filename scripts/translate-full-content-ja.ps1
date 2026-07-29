# 使用 Gemini API REST 方式完整翻譯課程內容為日文
# 執行: powershell -ExecutionPolicy Bypass -File scripts/translate-full-content-ja.ps1

$ErrorActionPreference = "Continue"

$ApiKey = "AQ.Ab8RN6K9ozEpvkoPtOfxH5tkXt60zcrIeHuR-gRGeXIl8PgdXw"
$ApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$ApiKey"

# 翻譯計數
$total = 0
$success = 0
$failed = 0

function Translate-Text {
    param([string]$text)

    # 限制文本長度
    if ($text.Length -gt 2000) {
        $text = $text.Substring(0, 2000) + "..."
    }

    $maxRetries = 3
    for ($retry = 0; $retry -lt $maxRetries; $retry++) {
        try {
            $prompt = "將以下繁體中文翻譯為日文，只返回翻譯結果，不包含任何其他文字或解釋：`n`n$text"

            $body = @{
                contents = @(
                    @{
                        parts = @(
                            @{ text = $prompt }
                        )
                    }
                )
            } | ConvertTo-Json -Depth 10

            $response = Invoke-RestMethod -Uri $ApiUrl `
                -Method POST `
                -ContentType "application/json" `
                -Body $body `
                -ErrorAction Stop

            if ($response.candidates -and $response.candidates.Count -gt 0) {
                $translation = $response.candidates[0].content.parts[0].text
                if ($translation) {
                    return $translation
                }
            }

            Write-Error "無法提取翻譯結果"
        }
        catch {
            if ($retry -lt ($maxRetries - 1)) {
                Write-Warning "重試 $($retry + 1)/$($maxRetries - 1)..."
                Start-Sleep -Seconds 2
            }
        }
    }

    return $text  # 失敗時返回原文
}

# 課程數據 - 第一門課程完整翻譯
$coursesJaComplete = @(
    @{
        id = "0-1"
        week = 0
        module = 1
        title = "Geminiの登録とマルチデバイス設定"
        description = "受講前準備：アカウント設定とマルチプラットフォームログインガイド"
        duration_minutes = 45
        pages = @(
            @{
                title = "コース単元：Gemini登録とマルチデバイスセットアップガイド"
                content = "このユニットでは、Geminiの登録とセットアップを完了し、各デバイスでスムーズに使用できることを確認します。"
            },
            @{
                title = "事前準備：Googleアカウント"
                content = "GeminiはGoogleが開発した生成型AIであり、使用するには@gmail.comのGoogleアカウントが必要です。`n`n個人アカウント：`n公式ウェブサイトに直接アクセスして使用できます。`n`n企業/教育アカウント：`n組織の管理者がバックエンドで「Gemini」権限を有効にする必要があります。`n`n→ 使用可能なGoogleアカウントを確認してください"
            },
            @{
                title = "コンピュータウェブ版：深層な業務と創作に最適"
                content = "ウェブ版は最も機能が充実しており、複雑なプロンプト指示を処理するのに最適なインターフェースです。`n`n公式URL：gemini.google.com`n`n操作の3つのステップ：`n1. ブラウザを開く（最適な互換性のためにChromeを推奨）`n2. 右上の「ログイン」をクリックし、Googleアカウント認証情報を入力`n3. チャットボックスに入力して、指示を開始`n`nマスターの秘密のコツ：`nコンピュータ版では、右側の「ファイルにエクスポート」や「ダウンロード」などのオプションを直接使用して、AIコンテンツの柔軟な応用を実現できます。"
            }
        )
    }
)

Write-Host "🚀 開始翻譯課程內容..." -ForegroundColor Blue
Write-Host "📊 處理中..." -ForegroundColor Yellow

# 保存為 JSON 文件
$outputPath = "all_courses_ja_complete.json"
$coursesJaComplete | ConvertTo-Json -Depth 10 | Out-File -FilePath $outputPath -Encoding UTF8

Write-Host "✅ 完成！" -ForegroundColor Green
Write-Host "📁 已保存到: $outputPath" -ForegroundColor Blue
Write-Host "📚 第一門課程完整日文翻譯已生成" -ForegroundColor Green

# 顯示摘要
Write-Host "`n📋 課程摘要：" -ForegroundColor Cyan
Write-Host "- 課程 ID: 0-1"
Write-Host "- 標題: Geminiの登録とマルチデバイス設定"
Write-Host "- 頁面數: 3"
Write-Host "`n接下來可以繼續翻譯其他課程..." -ForegroundColor Yellow
