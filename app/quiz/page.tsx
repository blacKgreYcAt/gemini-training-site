'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getQuestionsBySection } from '@/lib/quiz-data';
import { updateQuizProgress } from '@/lib/progress-utils';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/lib/language-context';
import { getQuizData, t } from '@/lib/translations';

// 創建根據語言動態返回 SECTIONS 的函數
const getSections = (language: 'zh' | 'ja') => [
  { id: 1, name: t('section1', language), range: t('section1Range', language) },
  { id: 2, name: t('section2', language), range: t('section2Range', language) },
  { id: 3, name: t('section3', language), range: t('section3Range', language) },
  { id: 4, name: t('section4', language), range: t('section4Range', language) },
  { id: 5, name: t('section5', language), range: t('section5Range', language) },
  { id: 6, name: t('section6', language), range: t('section6Range', language) }
];

function QuizPageContent() {
  const { language } = useLanguage();
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const SECTIONS = getSections(language);
  const quizData = getQuizData(language);
  const currentQuestions = selectedSection ? getQuestionsBySection(selectedSection, quizData) : [];
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
      const isCorrect = answer === currentQuestion.correctAnswer;
      if (isCorrect) {
        setScore(score + 1);
      }
      setTotalAnswered(totalAnswered + 1);

      // 更新進度
      updateQuizProgress(currentQuestion.id, answer, isCorrect);
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
    if (percentage >= 93.3) return t('gradeAPlus', language);
    if (percentage >= 80) return t('gradeA', language);
    if (percentage >= 66.7) return t('gradeB', language);
    if (percentage >= 50) return t('gradeC', language);
    return t('gradeD', language);
  };

  // 主頁面 - 選擇題庫章節
  if (!selectedSection) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <Link href="/" style={styles.backLink}>
            ← {t('backToHome', language)}
          </Link>
          <h1 style={styles.title}>🎓 {t('quizTitle', language)}</h1>
          <p style={styles.subtitle}>{t('quizSubtitle', language)}</p>
        </div>

        <div style={styles.sectionsGrid}>
          {SECTIONS.map((section) => (
            <div
              key={section.id}
              style={styles.sectionCard}
              onClick={() => handleStartQuiz(section.id)}
            >
              <div style={styles.sectionNumber}>{language === 'ja' ? `第 ${section.id} パート` : `第 ${section.id} 部分`}</div>
              <h3 style={styles.sectionTitle}>{section.name}</h3>
              <p style={styles.sectionRange}>{section.range}</p>
              <p style={styles.startButton}>{language === 'ja' ? 'クイズ開始 →' : '開始測驗 →'}</p>
            </div>
          ))}
        </div>

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>📝 {language === 'ja' ? '使用方法' : '使用說明'}</h3>
          <ul style={styles.infoList}>
            <li>{t('quizInstruction1', language)}</li>
            <li>{t('quizInstruction2', language)}</li>
            <li>{t('quizInstruction3', language)}</li>
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
              ← {t('backToSections', language)}
            </button>
            <div style={styles.progressInfo}>
              {language === 'ja' ? `第 ${currentQuestionIdx + 1} / ${currentQuestions.length} 問題` : `第 ${currentQuestionIdx + 1} / ${currentQuestions.length} 題`}
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
            {currentQuestion.options.map((option) => {
              // 只產生一個 border 宣告：混用 border 簡寫與 borderColor 長寫時，
              // React 的樣式 diff 會清掉 border-style / border-width，邊框就消失
              const isRight = option.label === currentQuestion.correctAnswer
              const isPicked = showAnswer && selectedAnswer === option.label
              // 答錯時正解也要標綠，否則使用者只看到自己選的紅框，
              // 得另外去讀下方解說文字才知道正確答案是哪一個
              const marked = isPicked || (showAnswer && isRight)
              const accent = marked
                ? isRight
                  ? { line: 'var(--tf-green)', fill: 'rgba(46, 139, 87, 0.10)' }
                  : { line: 'var(--tf-red)', fill: 'rgba(237, 28, 36, 0.08)' }
                : { line: 'var(--tf-line)', fill: 'var(--tf-white)' }

              return (
              <button
                key={option.label}
                style={{
                  ...styles.optionButton,
                  border: `1px solid ${accent.line}`,
                  backgroundColor: accent.fill,
                  color: marked ? 'var(--tf-ink)' : styles.optionButton.color,
                }}
                onClick={() => !showAnswer && handleSelectAnswer(option.label)}
                disabled={showAnswer}
              >
                <div style={styles.optionLabel}>{option.label}</div>
                <div style={styles.optionText}>{option.text}</div>
              </button>
              )
            })}
          </div>

          {showAnswer && (
            <div style={styles.answerBox}>
              <div style={styles.answerResult}>
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <span style={styles.resultCorrect}>✓ {t('correctAnswer', language)}</span>
                ) : (
                  <span style={styles.resultIncorrect}>✗ {t('incorrectAnswer', language)}</span>
                )}
              </div>
              <div style={styles.explanation}>
                <p style={styles.explanationTitle}>{language === 'ja' ? '解説:' : '解析:'}</p>
                <p style={styles.explanationText}>{currentQuestion.explanation}</p>
                {selectedAnswer !== currentQuestion.correctAnswer && (
                  <p style={styles.correctAnswerText}>
                    {t('correctAnswerLabel', language)}{currentQuestion.correctAnswer}
                  </p>
                )}
              </div>

              <button
                style={styles.nextButton}
                onClick={handleNextQuestion}
              >
                {currentQuestionIdx === currentQuestions.length - 1
                  ? t('completeQuiz', language)
                  : t('nextQuestion', language)}
              </button>
            </div>
          )}

          <div style={styles.scoreInfo}>
            {language === 'ja' ? '現在のスコア' : '目前得分'}: {score} / {totalAnswered}
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
        <h1 style={styles.completeTitle}>{language === 'ja' ? '🎉 クイズ完了！' : '🎉 測驗完成！'}</h1>

        <div style={styles.scoreCard}>
          <div style={styles.finalScore}>{score} / {currentQuestions.length}</div>
          <div style={styles.gradeText}>{grade}</div>
          <div style={styles.percentageText}>{percentage.toFixed(1)}%</div>
        </div>

        <div style={styles.feedback}>
          {percentage >= 90 && <p>{language === 'ja' ? '🌟 完璧です！このセクションの中核概念を習得しました！' : '🌟 太棒了！您已掌握本章節的核心概念！'}</p>}
          {percentage >= 70 && percentage < 90 && <p>{language === 'ja' ? '✨ 良好です！このセクションについてはかなり理解しており、弱点箇所の復習をお勧めします。' : '✨ 很好！您對本章節有良好的理解，建議複習弱點單元。'}</p>}
          {percentage >= 50 && percentage < 70 && <p>{language === 'ja' ? '📚 進捗があります！理解を深めるために、繰り返し復習することをお勧めします。' : '📚 不錯的進度！建議多次複習以加深理解。'}</p>}
          {percentage < 50 && <p>{language === 'ja' ? '💪 もう少しです！コース内容を再度確認し、もう一度クイズに挑戦することをお勧めします。' : '💪 加油！建議回顧課程講義並重新測驗。'}</p>}
        </div>

        <div style={styles.buttonGroup}>
          <button
            style={styles.retryButton}
            onClick={() => handleStartQuiz(selectedSection!)}
          >
            {language === 'ja' ? 'このセクションを再度実施' : '重新測驗本章節'}
          </button>
          <button
            style={styles.homeButton}
            onClick={handleBackToSections}
          >
            {language === 'ja' ? '他のセクションを選択' : '選擇其他章節'}
          </button>
        </div>

        <Link href="/" style={styles.returnLink}>
          {t('backToHome', language)} →
        </Link>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <QuizPageContent />
    </ProtectedRoute>
  );
}

// 全部走品牌 token，不再出現寫死的色值
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: 'clamp(40px, 7vw, 80px) clamp(20px, 5vw, 48px)',
    fontFamily: 'var(--tf-sans)',
  },
  header: {
    marginBottom: '48px',
  },
  backLink: {
    display: 'inline-block',
    marginBottom: '24px',
    color: 'var(--tf-blue-500)',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 600,
  },
  title: {
    fontFamily: 'var(--tf-serif)',
    fontSize: 'clamp(30px, 5vw, 48px)',
    fontWeight: 500,
    color: 'var(--tf-ink)',
    margin: '0 0 8px 0',
    lineHeight: 1.25,
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--tf-body)',
    margin: 0,
  },

  // 章節選擇
  sectionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
    gap: '20px',
    marginBottom: '48px',
  },
  sectionCard: {
    padding: '26px',
    border: '1px solid var(--tf-line)',
    borderRadius: 'var(--tf-radius-lg)',
    cursor: 'pointer',
    transition: 'box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease',
    backgroundColor: 'var(--tf-white)',
  },
  sectionNumber: {
    fontSize: '12.5px',
    fontWeight: 600,
    color: 'var(--tf-blue-500)',
    marginBottom: '6px',
    letterSpacing: '0.08em',
  },
  sectionTitle: {
    fontFamily: 'var(--tf-serif)',
    fontSize: '20px',
    fontWeight: 500,
    color: 'var(--tf-ink)',
    margin: '10px 0',
    lineHeight: 1.45,
  },
  sectionRange: {
    fontSize: '12.5px',
    color: 'var(--tf-muted)',
    margin: '6px 0 18px 0',
    fontVariantNumeric: 'tabular-nums',
  },
  startButton: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--tf-blue-500)',
    margin: 0,
  },
  infoBox: {
    padding: '28px',
    border: '1px solid var(--tf-line)',
    borderRadius: 'var(--tf-radius-lg)',
    backgroundColor: 'var(--tf-white)',
  },
  infoTitle: {
    fontFamily: 'var(--tf-serif)',
    fontSize: '20px',
    fontWeight: 500,
    color: 'var(--tf-ink)',
    margin: '0 0 14px 0',
  },
  infoList: {
    fontSize: '15px',
    lineHeight: 1.9,
    color: 'var(--tf-body)',
    margin: 0,
    paddingLeft: '22px',
  },

  // 作答中
  quizHeader: {
    marginBottom: '32px',
  },
  quizNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  backButton: {
    padding: '11px 22px',
    border: '1px solid var(--tf-navy-700)',
    borderRadius: '3px',
    backgroundColor: 'var(--tf-white)',
    color: 'var(--tf-navy-700)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--tf-sans)',
  },
  progressInfo: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--tf-body)',
    fontVariantNumeric: 'tabular-nums',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: 'var(--tf-blue-100)',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, var(--tf-blue-500), var(--tf-blue-600))',
    transition: 'width 0.4s ease',
  },
  questionBox: {
    padding: 'clamp(24px, 4vw, 40px)',
    border: '1px solid var(--tf-line)',
    borderRadius: 'var(--tf-radius-lg)',
    backgroundColor: 'var(--tf-white)',
  },
  questionNumber: {
    fontSize: '12.5px',
    fontWeight: 600,
    color: 'var(--tf-blue-500)',
    letterSpacing: '0.08em',
    marginBottom: '12px',
    fontVariantNumeric: 'tabular-nums',
  },
  questionText: {
    fontFamily: 'var(--tf-serif)',
    fontSize: 'clamp(20px, 3vw, 27px)',
    fontWeight: 500,
    color: 'var(--tf-ink)',
    margin: '0 0 28px 0',
    lineHeight: 1.45,
  },
  optionsContainer: {
    display: 'grid',
    gap: '12px',
    marginBottom: '28px',
  },
  optionButton: {
    padding: '16px 20px',
    border: '1px solid var(--tf-line)',
    borderRadius: 'var(--tf-radius)',
    backgroundColor: 'var(--tf-white)',
    textAlign: 'left',
    fontSize: '15.5px',
    color: 'var(--tf-body)',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease, background-color 0.2s ease',
    display: 'flex',
    gap: '14px',
    fontFamily: 'var(--tf-sans)',
  },
  optionLabel: {
    fontWeight: 700,
    fontSize: '15.5px',
    minWidth: '24px',
    color: 'var(--tf-blue-500)',
  },
  optionText: {
    flex: 1,
  },

  // 答案回饋
  answerBox: {
    padding: 'clamp(20px, 3vw, 28px)',
    border: '1px solid var(--tf-line)',
    borderLeft: '3px solid var(--tf-blue-500)',
    borderRadius: 'var(--tf-radius)',
    backgroundColor: 'var(--tf-blue-050)',
  },
  answerResult: {
    marginBottom: '14px',
  },
  resultCorrect: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--tf-green)',
  },
  resultIncorrect: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--tf-red)',
  },
  explanation: {
    marginBottom: '20px',
  },
  explanationTitle: {
    fontSize: '13.5px',
    fontWeight: 600,
    color: 'var(--tf-ink)',
    letterSpacing: '0.04em',
    margin: '0 0 8px 0',
  },
  explanationText: {
    fontSize: '15.5px',
    color: 'var(--tf-body)',
    margin: '0 0 10px 0',
    lineHeight: 1.85,
  },
  correctAnswerText: {
    fontSize: '15px',
    color: 'var(--tf-navy-700)',
    fontWeight: 700,
    margin: 0,
  },
  nextButton: {
    padding: '13px 28px',
    border: '1px solid var(--tf-navy-700)',
    borderRadius: '3px',
    backgroundColor: 'var(--tf-navy-700)',
    color: 'var(--tf-white)',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--tf-sans)',
  },
  scoreInfo: {
    marginTop: '20px',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--tf-blue-500)',
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
  },

  // 完成畫面
  completeBox: {
    textAlign: 'center',
    padding: 'clamp(36px, 6vw, 64px) clamp(20px, 4vw, 40px)',
    border: '1px solid var(--tf-line)',
    borderRadius: 'var(--tf-radius-lg)',
    backgroundColor: 'var(--tf-white)',
  },
  completeTitle: {
    fontFamily: 'var(--tf-serif)',
    fontSize: 'clamp(28px, 5vw, 44px)',
    fontWeight: 500,
    color: 'var(--tf-ink)',
    margin: '0 0 32px 0',
  },
  scoreCard: {
    padding: 'clamp(28px, 4vw, 40px)',
    border: '1px solid var(--tf-blue-200)',
    borderRadius: 'var(--tf-radius-lg)',
    backgroundColor: 'var(--tf-blue-050)',
    marginBottom: '28px',
  },
  finalScore: {
    fontFamily: 'var(--tf-serif)',
    fontSize: 'clamp(48px, 9vw, 72px)',
    fontWeight: 500,
    color: 'var(--tf-navy-700)',
    margin: '0 0 12px 0',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1.1,
  },
  gradeText: {
    fontFamily: 'var(--tf-serif)',
    fontSize: 'clamp(22px, 3.5vw, 30px)',
    fontWeight: 500,
    color: 'var(--tf-ink)',
    margin: '0 0 6px 0',
  },
  percentageText: {
    fontSize: '16px',
    color: 'var(--tf-body)',
    fontVariantNumeric: 'tabular-nums',
  },
  feedback: {
    fontSize: '16px',
    color: 'var(--tf-body)',
    marginBottom: '32px',
    lineHeight: 1.85,
  },
  buttonGroup: {
    display: 'flex',
    gap: '14px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  retryButton: {
    padding: '13px 28px',
    border: '1px solid var(--tf-navy-700)',
    borderRadius: '3px',
    backgroundColor: 'var(--tf-navy-700)',
    color: 'var(--tf-white)',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--tf-sans)',
  },
  homeButton: {
    padding: '13px 28px',
    border: '1px solid var(--tf-navy-700)',
    borderRadius: '3px',
    backgroundColor: 'var(--tf-white)',
    color: 'var(--tf-navy-700)',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--tf-sans)',
  },
  returnLink: {
    display: 'inline-block',
    marginTop: '20px',
    color: 'var(--tf-blue-500)',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: 600,
  },
};
