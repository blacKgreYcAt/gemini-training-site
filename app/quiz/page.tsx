'use client';

import { useState } from 'react';
import Link from 'next/link';
import { quizData, getQuestionsBySection } from '@/lib/quiz-data';
import type { QuizQuestion } from '@/lib/quiz-data';

const SECTIONS = [
  { id: 1, name: '第一週課程 - 六大神器總覽', range: '問題 1-10' },
  { id: 2, name: '第二週課程 - Prompt 溝通術', range: '問題 11-20' },
  { id: 3, name: '第三週課程 - 數據處理工具', range: '問題 21-30' },
  { id: 4, name: '第四週課程 - Canvas、建立影片、創作音樂', range: '問題 31-40' },
  { id: 5, name: '綜合應用情景題', range: '問題 41-60' }
];

export default function QuizPage() {
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const currentQuestions = selectedSection ? getQuestionsBySection(selectedSection) : [];
  const currentQuestion = currentQuestions[currentQuestionIdx];

  const handleStartQuiz = (sectionId: number) => {
    setSelectedSection(sectionId);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setTotalAnswered(0);
    setQuizComplete(false);
  };

  const handleSelectAnswer = (answer: string) => {
    if (!showAnswer) {
      setSelectedAnswer(answer);
      setShowAnswer(true);
      if (answer === currentQuestion.correctAnswer) {
        setScore(score + 1);
      }
      setTotalAnswered(totalAnswered + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < currentQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleBackToSections = () => {
    setSelectedSection(null);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setTotalAnswered(0);
    setQuizComplete(false);
  };

  // 計算成績
  const calculateGrade = (points: number, total: number) => {
    const percentage = (points / total) * 100;
    if (percentage >= 93.3) return 'A+ (優秀)';
    if (percentage >= 80) return 'A (很好)';
    if (percentage >= 66.7) return 'B (良好)';
    if (percentage >= 50) return 'C (及格)';
    return 'D (需加強)';
  };

  // 主頁面 - 選擇題庫章節
  if (!selectedSection) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <Link href="/" style={styles.backLink}>
            ← 返回課程列表
          </Link>
          <h1 style={styles.title}>🎓 Gemini 企業協作能力自測題庫</h1>
          <p style={styles.subtitle}>完成測驗，檢視您的學習成果</p>
        </div>

        <div style={styles.sectionsGrid}>
          {SECTIONS.map((section) => (
            <div
              key={section.id}
              style={styles.sectionCard}
              onClick={() => handleStartQuiz(section.id)}
            >
              <div style={styles.sectionNumber}>第 {section.id} 部分</div>
              <h3 style={styles.sectionTitle}>{section.name}</h3>
              <p style={styles.sectionRange}>{section.range}</p>
              <p style={styles.startButton}>開始測驗 →</p>
            </div>
          ))}
        </div>

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>📝 使用說明</h3>
          <ul style={styles.infoList}>
            <li>每個章節包含 10 道題目</li>
            <li>綜合應用章節包含 20 道題目</li>
            <li>選擇您的答案後，系統會立即顯示正確答案</li>
            <li>完成所有題目後，您將獲得成績評級</li>
            <li>可隨時返回重新測試不同章節</li>
          </ul>
        </div>
      </div>
    );
  }

  // 測驗進行中
  if (!quizComplete && currentQuestion) {
    const progress = ((currentQuestionIdx + 1) / currentQuestions.length) * 100;

    return (
      <div style={styles.container}>
        <div style={styles.quizHeader}>
          <div style={styles.quizNav}>
            <button style={styles.backButton} onClick={handleBackToSections}>
              ← 返回章節選擇
            </button>
            <div style={styles.progressInfo}>
              第 {currentQuestionIdx + 1} / {currentQuestions.length} 題
            </div>
          </div>

          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${progress}%`
              }}
            ></div>
          </div>
        </div>

        <div style={styles.questionBox}>
          <div style={styles.questionNumber}>問題 {currentQuestion.id}</div>
          <h2 style={styles.questionText}>{currentQuestion.question}</h2>

          <div style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => (
              <button
                key={option.label}
                style={{
                  ...styles.optionButton,
                  ...(selectedAnswer === option.label && showAnswer
                    ? option.label === currentQuestion.correctAnswer
                      ? styles.optionCorrect
                      : styles.optionIncorrect
                    : {}),
                  ...(!showAnswer ? styles.optionClickable : {})
                }}
                onClick={() => !showAnswer && handleSelectAnswer(option.label)}
                disabled={showAnswer}
              >
                <div style={styles.optionLabel}>{option.label}</div>
                <div style={styles.optionText}>{option.text}</div>
              </button>
            ))}
          </div>

          {showAnswer && (
            <div style={styles.answerBox}>
              <div style={styles.answerResult}>
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <span style={styles.resultCorrect}>✓ 正確！</span>
                ) : (
                  <span style={styles.resultIncorrect}>✗ 錯誤</span>
                )}
              </div>
              <div style={styles.explanation}>
                <p style={styles.explanationTitle}>解析：</p>
                <p style={styles.explanationText}>{currentQuestion.explanation}</p>
                {selectedAnswer !== currentQuestion.correctAnswer && (
                  <p style={styles.correctAnswerText}>
                    正確答案：{currentQuestion.correctAnswer}
                  </p>
                )}
              </div>

              <button
                style={styles.nextButton}
                onClick={handleNextQuestion}
              >
                {currentQuestionIdx === currentQuestions.length - 1
                  ? '完成測驗 →'
                  : '下一題 →'}
              </button>
            </div>
          )}

          <div style={styles.scoreInfo}>
            目前得分：{score} / {totalAnswered}
          </div>
        </div>
      </div>
    );
  }

  // 測驗完成頁面
  const percentage = (score / currentQuestions.length) * 100;
  const grade = calculateGrade(score, currentQuestions.length);

  return (
    <div style={styles.container}>
      <div style={styles.completeBox}>
        <h1 style={styles.completeTitle}>🎉 測驗完成！</h1>

        <div style={styles.scoreCard}>
          <div style={styles.finalScore}>{score} / {currentQuestions.length}</div>
          <div style={styles.gradeText}>{grade}</div>
          <div style={styles.percentageText}>{percentage.toFixed(1)}%</div>
        </div>

        <div style={styles.feedback}>
          {percentage >= 90 && <p>🌟 太棒了！您已掌握本章節的核心概念！</p>}
          {percentage >= 70 && percentage < 90 && <p>✨ 很好！您對本章節有良好的理解，建議複習弱點單元。</p>}
          {percentage >= 50 && percentage < 70 && <p>📚 不錯的進度！建議多次複習以加深理解。</p>}
          {percentage < 50 && <p>💪 加油！建議回顧課程講義並重新測驗。</p>}
        </div>

        <div style={styles.buttonGroup}>
          <button
            style={styles.retryButton}
            onClick={() => handleStartQuiz(selectedSection!)}
          >
            重新測驗本章節
          </button>
          <button
            style={styles.homeButton}
            onClick={handleBackToSections}
          >
            選擇其他章節
          </button>
        </div>

        <Link href="/" style={styles.returnLink}>
          返回課程列表 →
        </Link>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    marginBottom: '60px',
    textAlign: 'center',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '20px',
    color: '#00aeef',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: '500',
  },
  title: {
    fontSize: '64px',
    fontWeight: 'bold',
    color: '#0a0a0a',
    margin: '20px 0 10px 0',
  },
  subtitle: {
    fontSize: '24px',
    color: '#666',
    margin: '0',
  },
  sectionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '60px',
  },
  sectionCard: {
    padding: '32px',
    border: '2px solid #0a0a0a',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: '#f5f5f5',
  } as React.CSSProperties & { '&:hover'?: React.CSSProperties },
  sectionNumber: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#00aeef',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#0a0a0a',
    margin: '12px 0',
  },
  sectionRange: {
    fontSize: '14px',
    color: '#666',
    margin: '8px 0 16px 0',
  },
  startButton: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#00aeef',
    margin: '0',
  },
  infoBox: {
    padding: '32px',
    border: '2px solid #0a0a0a',
    backgroundColor: '#f9f9f9',
  },
  infoTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 16px 0',
  },
  infoList: {
    fontSize: '18px',
    lineHeight: '1.8',
    margin: '0',
    paddingLeft: '24px',
  },
  quizHeader: {
    marginBottom: '40px',
  },
  quizNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  backButton: {
    padding: '12px 24px',
    border: '2px solid #00aeef',
    backgroundColor: 'transparent',
    color: '#00aeef',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  progressInfo: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0a0a0a',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    border: '1px solid #0a0a0a',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00aeef',
    transition: 'width 0.3s ease',
  },
  questionBox: {
    padding: '40px',
    border: '2px solid #0a0a0a',
    backgroundColor: '#fff',
  },
  questionNumber: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#00aeef',
    textTransform: 'uppercase',
    marginBottom: '16px',
    letterSpacing: '2px',
  },
  questionText: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#0a0a0a',
    margin: '0 0 32px 0',
    lineHeight: '1.4',
  },
  optionsContainer: {
    display: 'grid',
    gap: '16px',
    marginBottom: '32px',
  },
  optionButton: {
    padding: '20px 24px',
    border: '2px solid #0a0a0a',
    backgroundColor: '#f5f5f5',
    textAlign: 'left',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    gap: '16px',
  },
  optionClickable: {
    cursor: 'pointer',
  } as React.CSSProperties,
  optionCorrect: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  optionIncorrect: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  optionLabel: {
    fontWeight: 'bold',
    fontSize: '20px',
    minWidth: '40px',
    color: '#00aeef',
  },
  optionText: {
    flex: 1,
  },
  answerBox: {
    padding: '32px',
    border: '2px solid #0a0a0a',
    backgroundColor: '#f9f9f9',
  },
  answerResult: {
    marginBottom: '20px',
  },
  resultCorrect: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4caf50',
  },
  resultIncorrect: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#f44336',
  },
  explanation: {
    marginBottom: '24px',
  },
  explanationTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 12px 0',
  },
  explanationText: {
    fontSize: '18px',
    color: '#333',
    margin: '0 0 12px 0',
    lineHeight: '1.6',
  },
  correctAnswerText: {
    fontSize: '18px',
    color: '#f44336',
    fontWeight: 'bold',
    margin: '0',
  },
  nextButton: {
    padding: '16px 32px',
    border: '2px solid #00aeef',
    backgroundColor: '#00aeef',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  scoreInfo: {
    marginTop: '24px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#00aeef',
    textAlign: 'right',
  },
  completeBox: {
    textAlign: 'center',
    padding: '60px 40px',
    border: '2px solid #0a0a0a',
    backgroundColor: '#f5f5f5',
  },
  completeTitle: {
    fontSize: '56px',
    fontWeight: 'bold',
    margin: '0 0 40px 0',
  },
  scoreCard: {
    padding: '40px',
    border: '2px solid #0a0a0a',
    backgroundColor: '#fff',
    marginBottom: '32px',
  },
  finalScore: {
    fontSize: '72px',
    fontWeight: 'bold',
    color: '#00aeef',
    margin: '0 0 16px 0',
  },
  gradeText: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#0a0a0a',
    margin: '0 0 8px 0',
  },
  percentageText: {
    fontSize: '24px',
    color: '#666',
  },
  feedback: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '40px',
    lineHeight: '1.8',
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginBottom: '32px',
  },
  retryButton: {
    padding: '16px 32px',
    border: '2px solid #00aeef',
    backgroundColor: '#00aeef',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  homeButton: {
    padding: '16px 32px',
    border: '2px solid #0a0a0a',
    backgroundColor: 'transparent',
    color: '#0a0a0a',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  returnLink: {
    display: 'inline-block',
    marginTop: '24px',
    color: '#00aeef',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: '600',
  },
};
