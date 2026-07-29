#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Complete quiz processing:
1. Fix Japanese answers format (simplify correct_answer, preserve details in explanation)
2. Add 10 new questions to reach 100 total (from current 90)
"""

import json
import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

QUIZ_DIR = Path(".")
QUIZ_JA = QUIZ_DIR / "course_quizzes_ja.json"
QUIZ_ZH = QUIZ_DIR / "course_quizzes.json"

def process_quizzes():
    # Load original files
    with open(QUIZ_ZH, 'r', encoding='utf-8') as f:
        data_zh = json.load(f)
    with open(QUIZ_JA, 'r', encoding='utf-8') as f:
        data_ja = json.load(f)

    print("Initial status:")
    total_zh = sum(len(c['questions']) for c in data_zh)
    total_ja = sum(len(c['questions']) for c in data_ja)
    print(f"  Chinese: {total_zh} questions")
    print(f"  Japanese: {total_ja} questions\n")

    # === TASK 1: SIMPLIFY LONG ANSWERS IN JAPANESE VERSION ===
    print("=" * 60)
    print("TASK 1: Standardize Japanese answer format")
    print("=" * 60)

    fixes_ja = 0
    answer_mapping = {
        'Managed Agents': 'Managed Agents',
        'Computer Use Tool': 'Computer Use Tool',
        'Gemini Omni Flash': 'Gemini Omni Flash',
        'Live Translate': 'Gemini Live Translate',
        'Flash-Lite': 'Gemini 3.5 Flash-Lite',
        '3.6 Flash': 'Gemini 3.6 Flash',
        'Google AI Pro': 'Google AI Pro',
        'Nano Banana': 'Nano Banana 2 Lite',
        'Canvas': 'Canvas',
        'NotebookLM': 'NotebookLM',
        'Gemini Spark': 'Gemini Spark',
        'Google Home': 'Google Home Speaker'
    }

    for course in data_ja:
        for q in course['questions']:
            answer = q.get('correct_answer', '')
            explanation = q.get('explanation', '')

            # Check if answer is too long
            if isinstance(answer, str) and len(answer) > 50:
                short_answer = None

                # Try to find matching short form
                for key, short in answer_mapping.items():
                    if key in answer:
                        short_answer = short
                        break

                # If found a shorter version, apply it
                if short_answer and len(short_answer) < len(answer):
                    # Preserve full answer in explanation if not already there
                    if not explanation or len(explanation) < len(answer):
                        q['explanation'] = answer
                    q['correct_answer'] = short_answer
                    fixes_ja += 1

    print(f"Fixed {fixes_ja} Japanese answers")
    print()

    # === TASK 2: ADD 10 NEW QUESTIONS ===
    print("=" * 60)
    print("TASK 2: Add 10 new questions (2 for course 0-1, 1 each for 8 other courses)")
    print("=" * 60)

    # Define 10 new questions
    new_zh = [
        {
            "id": "Q6",
            "type": "scenario",
            "question": "一個電子商務平台需要在購物車中集成實時產品推薦引擎。使用 Gemini 3.6 Flash 的哪些優勢最適合此用例？",
            "options": [],
            "correct_answer": "Token效率提高17%，更低的定價",
            "explanation": "Gemini 3.6 Flash 的改進的 Token 效率和更低的定價點使其成為實時推薦的理想選擇，能夠在降低成本的同時保持低延遲響應。"
        },
        {
            "id": "Q7",
            "type": "true_false",
            "question": "企業可以使用 Managed Agents 在其私有數據中心中運行自主代理。",
            "options": [],
            "correct_answer": "False",
            "explanation": "Managed Agents 在 Google 託管的隔離 Linux 沙箱環境中運行，不支持本地或私有數據中心部署。"
        },
        {
            "id": "Q6",
            "type": "scenario",
            "question": "您的團隊需要自動化跨瀏覽器、桌面和移動應用的用戶測試。哪種工具組合最有效？",
            "options": [],
            "correct_answer": "Computer Use Tool + Managed Agents",
            "explanation": "Computer Use Tool 提供跨環境支持，而 Managed Agents 為自動化測試流程提供可靠的執行環境和狀態管理。"
        },
        {
            "id": "Q6",
            "type": "multiple_choice",
            "question": "使用 Gemini 3.5 Flash-Lite 作為子代理的主要優勢是什麼？",
            "options": [
                "A) 它可以替代主模型",
                "B) 低延遲和成本效益適合執行子任務",
                "C) 它支持所有複雜推理",
                "D) 它不需要任何監控"
            ],
            "correct_answer": "B",
            "explanation": "Gemini 3.5 Flash-Lite 作為低延遲、高效率的子代理，特別適合在多代理架構中執行特定的子任務。"
        },
        {
            "id": "Q6",
            "type": "true_false",
            "question": "Omni Flash 的 720p 輸出限制對於社交媒體營銷視頻來說是一個缺點。",
            "options": [],
            "correct_answer": "False",
            "explanation": "對於社交媒體內容（TikTok、Instagram Reels），720p 實際上是最優選擇，提供完美的質量與成本平衡。"
        },
        {
            "id": "Q6",
            "type": "scenario",
            "question": "一個客戶服務中心需要同時處理中文、日文和英文客戶查詢。最適合的解決方案是什麼？",
            "options": [],
            "correct_answer": "Gemini Live Translate + 本地化模型",
            "explanation": "Live Translate 可以自動檢測和翻譯 70 多種語言，同時保持自然語調，是多語言客服的理想解決方案。"
        },
        {
            "id": "Q6",
            "type": "multiple_choice",
            "question": "在構建企業自主代理時，成本優化的首選策略是什麼？",
            "options": [
                "A) 對所有任務都使用最強大的模型",
                "B) 根據任務複雜性選擇合適的模型組合",
                "C) 只使用最便宜的模型",
                "D) 隨機選擇模型"
            ],
            "correct_answer": "B",
            "explanation": "最佳實踐是為簡單任務使用 3.5 Flash-Lite，為複雜推理使用 3.6 Flash，為視頻使用 Omni Flash，實現成本與性能的最優平衡。"
        },
        {
            "id": "Q6",
            "type": "true_false",
            "question": "計算機操作工具現在支持簡化的操作接口，使非技術人員也能構建自動化工作流。",
            "options": [],
            "correct_answer": "True",
            "explanation": "2026 年版本的 Computer Use Tool 具有簡化的操作和原生意圖支持，降低了自動化的技術門檻。"
        },
        {
            "id": "Q6",
            "type": "scenario",
            "question": "您的應用需要每分鐘處理數百個推理請求。選擇 Gemini 3.6 Flash 的成本優勢是多少？",
            "options": [],
            "correct_answer": "输出 Token 成本降低 17%",
            "explanation": "Gemini 3.6 Flash 的 17% Token 效率提升，加上更低的定價點，對於高吞吐量應用可實現顯著的成本節省。"
        },
        {
            "id": "Q6",
            "type": "true_false",
            "question": "NotebookLM 的 2026 升級版本包括高級推理和代碼執行功能，使其適合複雜的研究工作流程。",
            "options": [],
            "correct_answer": "True",
            "explanation": "NotebookLM 的 2026 升級增加了高級推理和代碼執行能力，成為構建結構化研究工作流程的強大工具。"
        }
    ]

    new_ja = [
        {
            "id": "Q6",
            "type": "scenario",
            "question": "eコマースプラットフォームがショッピングカートにリアルタイム製品推奨エンジンを統合する必要があります。このユースケースに最適なGemini 3.6 Flashの利点は何ですか？",
            "options": [],
            "correct_answer": "トークン効率が17%向上し、より低価格",
            "explanation": "Gemini 3.6 Flashの改善されたトークン効率とより低い価格設定により、コストを削減しながら低レイテンシー応答を維持するリアルタイム推奨に最適です。"
        },
        {
            "id": "Q7",
            "type": "true_false",
            "question": "企業はManaged Agents（Google が管理するセキュアな Linux サンドボックス環境）を自社のプライベートデータセンターで実行できる。",
            "options": [],
            "correct_answer": "False",
            "explanation": "Managed Agents（Google が管理するセキュアな Linux サンドボックス環境）はGoogleが管理する隔離されたLinuxサンドボックス環境で実行され、オンプレミスまたはプライベートデータセンターのデプロイはサポートされていません。"
        },
        {
            "id": "Q6",
            "type": "scenario",
            "question": "チームがブラウザ、デスクトップ、モバイルアプリケーション全体でユーザーテストを自動化する必要があります。最も効果的なツールの組み合わせは何ですか？",
            "options": [],
            "correct_answer": "Computer Use Tool + Managed Agents",
            "explanation": "Computer Use Toolはクロスプラットフォームサポートを提供し、Managed Agents（Google が管理するセキュアな Linux サンドボックス環境）は自動テストプロセスの信頼できる実行環境と状態管理を提供します。"
        },
        {
            "id": "Q6",
            "type": "multiple_choice",
            "question": "Gemini 3.5 Flash-Liteをサブエージェントとして使用する主な利点は何か。",
            "options": [
                "A) メインモデルに置き換えることができる",
                "B) 低レイテンシーと費用対効果により、サブタスク実行に適している",
                "C) すべての複雑な推論をサポートする",
                "D) 監視が不要である"
            ],
            "correct_answer": "B",
            "explanation": "Gemini 3.5 Flash-Liteは低レイテンシーで効率的なサブエージェントであり、マルチエージェントアーキテクチャ内で特定のサブタスク実行に特に適しています。"
        },
        {
            "id": "Q6",
            "type": "true_false",
            "question": "Omni Flashの720p出力制限はソーシャルメディアマーケティングビデオにとって欠点である。",
            "options": [],
            "correct_answer": "False",
            "explanation": "ソーシャルメディアコンテンツ（TikTok、Instagram Reels）の場合、720pは実際には最適な選択であり、品質とコストのバランスが完璧です。"
        },
        {
            "id": "Q6",
            "type": "scenario",
            "question": "カスタマーサービスセンターが中国語、日本語、英語の顧客問い合わせを同時に処理する必要があります。最適なソリューションは何か。",
            "options": [],
            "correct_answer": "Gemini Live Translate + ローカライズされたモデル",
            "explanation": "Live Translateは70以上の言語を自動検出して翻訳でき、自然な語調を保つため、多言語カスタマーサービスに最適です。"
        },
        {
            "id": "Q6",
            "type": "multiple_choice",
            "question": "エンタープライズ自律型エージェントを構築する際、コスト最適化の最優先戦略は何か。",
            "options": [
                "A) すべてのタスクに最も強力なモデルを使用する",
                "B) タスクの複雑さに応じて適切なモデルの組み合わせを選択する",
                "C) 最も安いモデルのみを使用する",
                "D) モデルをランダムに選択する"
            ],
            "correct_answer": "B",
            "explanation": "ベストプラクティスは、シンプルなタスクに3.5 Flash-Liteを、複雑な推論に3.6 Flashを、ビデオにOmni Flashを使用し、コストとパフォーマンスの最適なバランスを実現することです。"
        },
        {
            "id": "Q6",
            "type": "true_false",
            "question": "Computer Use Tool（デスクトップ、モバイル、ブラウザ環境にわたるコンピュータ操作の自動化）現在、簡素化された操作インターフェースをサポートしており、非技術者も自動化ワークフローを構築できます。",
            "options": [],
            "correct_answer": "True",
            "explanation": "2026年版のComputer Use Tool（デスクトップ、モバイル、ブラウザ環境にわたるコンピュータ操作の自動化）は簡素化された操作とネイティブなインテントサポートを備えており、自動化の技術的障壁を低下させます。"
        },
        {
            "id": "Q6",
            "type": "scenario",
            "question": "アプリケーションが1分間に数百の推論リクエストを処理する必要があります。他のモデルではなくGemini 3.6 Flashを選択するコスト利点は何か。",
            "options": [],
            "correct_answer": "出力トークンコストが17%削減",
            "explanation": "Gemini 3.6 Flashの17%のトークン効率改善と、より低い価格設定により、高スループットアプリケーションに対して顕著なコスト削減を実現できます。"
        },
        {
            "id": "Q6",
            "type": "true_false",
            "question": "NotebookLMの2026年アップグレード版には、高度な推論とコード実行機能が含まれており、複雑な研究ワークフローに適しています。",
            "options": [],
            "correct_answer": "True",
            "explanation": "NotebookLMの2026年アップグレードは、高度な推論とコード実行機能を追加し、構造化されたリサーチワークフロー構築のための強力なツールとなります。"
        }
    ]

    # Add to courses: 2 to 0-1, 1 each to 0-2, 0-3, 1-1, 1-2, 1-3, 2-1, 2-2, 2-3
    data_zh[0]['questions'].extend(new_zh[0:2])
    data_ja[0]['questions'].extend(new_ja[0:2])

    for i in range(8):
        data_zh[i + 1]['questions'].append(new_zh[2 + i])
        data_ja[i + 1]['questions'].append(new_ja[2 + i])

    # Save files
    with open(QUIZ_ZH, 'w', encoding='utf-8') as f:
        json.dump(data_zh, f, ensure_ascii=False, indent=2)
    with open(QUIZ_JA, 'w', encoding='utf-8') as f:
        json.dump(data_ja, f, ensure_ascii=False, indent=2)

    # Verify
    total_zh = sum(len(c['questions']) for c in data_zh)
    total_ja = sum(len(c['questions']) for c in data_ja)

    print(f"Added 10 new questions")
    print()
    print("=" * 60)
    print("FINAL RESULTS")
    print("=" * 60)
    print(f"Chinese version: {total_zh} questions (18 courses)")
    print(f"Japanese version: {total_ja} questions (18 courses)")
    print(f"Tasks completed:")
    print(f"  1. Fixed {fixes_ja} Japanese answer formats")
    print(f"  2. Added 10 new questions (2 for 0-1, 1 each for 8 others)")
    print()
    print("Distribution of new questions:")
    for i, course in enumerate(data_zh):
        if i == 0:
            new_count = len(course['questions']) - 5
        elif i <= 8:
            new_count = len(course['questions']) - 5
        else:
            new_count = 0
        if new_count > 0:
            print(f"  {course['course_id']}: +{new_count} new questions")

if __name__ == "__main__":
    process_quizzes()
