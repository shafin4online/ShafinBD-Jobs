import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  writeBatch,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import {
  QuizAttempt,
  QuizConfigOptions,
  QuizQuestionSnapshot,
  QuizAnswerRecord,
  QuestionBankQuestion,
  CorrectAnswer,
  QuestionDifficulty,
} from '../../../types/questionBank';

/**
 * Convert QuestionBankQuestion to QuizQuestionSnapshot with explicit order index
 */
export const toQuestionSnapshot = (
  q: QuestionBankQuestion,
  order: number,
  subjectName?: string,
  topicName?: string
): QuizQuestionSnapshot => {
  return {
    id: q.id,
    order,
    question: q.question,
    options: {
      A: q.options?.A || '',
      B: q.options?.B || '',
      C: q.options?.C || '',
      D: q.options?.D || '',
    },
    correctAnswer: q.correctAnswer,
    explanation: q.explanation || '',
    subjectId: q.subjectId,
    subjectName: subjectName || '',
    topicId: q.topicId,
    topicName: topicName || '',
    subtopicId: q.subtopicId ?? null,
    difficulty: q.difficulty,
    source: q.source,
    examName: q.examName,
    examYear: q.examYear,
    tags: q.tags || [],
  };
};

/**
 * Start a Quiz Attempt with Question Snapshots in Subcollection
 * Architecture:
 * - Parent: users/{userId}/quizAttempts/{attemptId} (lightweight metadata, config, questionIds)
 * - Subcollection: users/{userId}/quizAttempts/{attemptId}/questions/{questionId} (immutable snapshot per question)
 * This avoids document 1MB limits for 100+ questions and guarantees question immutability.
 */
export const startQuizAttempt = async (
  userId: string,
  config: QuizConfigOptions,
  questions: QuestionBankQuestion[]
): Promise<QuizAttempt> => {
  const attemptsRef = collection(db, 'users', userId, 'quizAttempts');
  const newDoc = doc(attemptsRef);
  const now = Timestamp.now();

  const questionSnapshots: QuizQuestionSnapshot[] = questions.map((q, idx) =>
    toQuestionSnapshot(q, idx, config.subjectName, config.topicName)
  );

  // Lightweight parent attempt document
  const attemptData: QuizAttempt = {
    id: newDoc.id,
    userId,
    title: config.title || 'কুইজ অনুশীলন',
    mode: config.mode,
    subjectId: config.subjectId,
    subjectName: config.subjectName,
    topicId: config.topicId,
    topicName: config.topicName,
    subtopicId: config.subtopicId ?? null,
    difficulty: config.difficulty,
    
    questionIds: questions.map((q) => q.id),
    answers: {},
    markedQuestionIds: [],
    currentQuestionIndex: 0,
    
    totalQuestions: questions.length,
    answeredCount: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    skippedAnswers: 0,
    score: 0,
    percentage: 0,
    negativeMarkingPerWrong: config.negativeMarkingPerWrong ?? 0,
    
    durationSeconds: config.durationSeconds || 0,
    timeTakenSeconds: 0,
    status: 'in-progress',
    startedAt: now,
  };

  // Write parent doc and subcollection docs in batch
  const batch = writeBatch(db);
  batch.set(newDoc, attemptData);

  const questionsSubcollection = collection(
    db,
    'users',
    userId,
    'quizAttempts',
    newDoc.id,
    'questions'
  );

  for (const snapshot of questionSnapshots) {
    const qDoc = doc(questionsSubcollection, snapshot.id);
    // Security Hardening: Client cannot inspect Firestore to view answer key during in-progress quiz
    const sanitizedSnapshot: QuizQuestionSnapshot = {
      ...snapshot,
      correctAnswer: '' as any,
      explanation: '',
    };
    batch.set(qDoc, sanitizedSnapshot);
  }

  await batch.commit();

  // Return sanitized snapshots for in-progress quiz so browser memory has no answer leaks
  const inProgressSnapshots: QuizQuestionSnapshot[] = questionSnapshots.map((s) => ({
    ...s,
    correctAnswer: '' as any,
    explanation: '',
  }));

  return {
    ...attemptData,
    questionsSnapshot: inProgressSnapshots,
  };
};

/**
 * Save user's answer incrementally during the quiz
 * Ensures reloading the browser doesn't lose current progress
 */
export const saveQuizAnswer = async (
  userId: string,
  attemptId: string,
  questionId: string,
  selectedAnswer: CorrectAnswer | null,
  timeSpentSeconds = 0
): Promise<void> => {
  try {
    const attemptDoc = doc(db, 'users', userId, 'quizAttempts', attemptId);
    await updateDoc(attemptDoc, {
      [`answers.${questionId}`]: {
        selectedAnswer,
        timeSpentSeconds,
      },
    });
  } catch (error) {
    console.error('Error auto-saving quiz answer:', error);
  }
};

/**
 * Toggle Mark for Review for a question
 */
export const markForReview = async (
  userId: string,
  attemptId: string,
  markedQuestionIds: string[]
): Promise<void> => {
  try {
    const attemptDoc = doc(db, 'users', userId, 'quizAttempts', attemptId);
    await updateDoc(attemptDoc, {
      markedQuestionIds,
    });
  } catch (error) {
    console.error('Error updating marked questions:', error);
  }
};

/**
 * Submit Quiz Attempt with Server-Authoritative Evaluation & Idempotency
 * 1. Calls server endpoint /api/quiz/submit with user inputs (attemptId, answers, durationSeconds)
 * 2. Server evaluates score, negative marking, deadline/timer, and idempotent state transitions
 * 3. Fallback to client-side transactional evaluation if server route is unavailable
 */
export const submitQuizAttemptWithAnswers = async (params: {
  userId: string;
  attemptId: string;
  questions?: (QuestionBankQuestion | QuizQuestionSnapshot)[];
  userAnswers: Record<string, { selectedAnswer: CorrectAnswer | null; timeSpentSeconds?: number }>;
  markedQuestionIds: string[];
  timeTakenSeconds: number;
  negativeMarkingPerWrong?: number;
  status?: 'completed' | 'timed-out';
}): Promise<{
  attempt: QuizAttempt;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  score: number;
  percentage: number;
}> => {
  const {
    userId,
    attemptId,
    questions = [],
    userAnswers,
    markedQuestionIds,
    timeTakenSeconds,
    negativeMarkingPerWrong = 0,
    status = 'completed',
  } = params;

  // 1. Try Server-Authoritative Evaluation via /api/quiz/submit
  try {
    const response = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        attemptId,
        answers: userAnswers,
        markedQuestionIds,
        durationSeconds: timeTakenSeconds,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.attempt) {
        // Fetch question snapshots to ensure full client review UX
        const fullSnapshots =
          data.questions && data.questions.length > 0
            ? data.questions
            : await getQuizAttemptQuestions(userId, attemptId);
        return {
          attempt: {
            ...data.attempt,
            questionsSnapshot: fullSnapshots.length > 0 ? fullSnapshots : (data.attempt.questionsSnapshot || []),
          },
          correctAnswers: data.correctAnswers,
          wrongAnswers: data.wrongAnswers,
          skippedAnswers: data.skippedAnswers,
          score: data.score,
          percentage: data.percentage,
        };
      }
    }
  } catch (serverErr) {
    console.warn('Server quiz evaluation endpoint unreachable, executing transactional fallback:', serverErr);
  }

  // 2. Client-Side Idempotent Fallback (Guaranteed consistency if server route unavailable)
  const attemptDoc = doc(db, 'users', userId, 'quizAttempts', attemptId);
  const attemptSnap = await getDoc(attemptDoc);

  if (!attemptSnap.exists()) {
    throw new Error('Quiz attempt document not found');
  }

  const existingAttempt = attemptSnap.data() as QuizAttempt;

  // Idempotency: If already completed, return existing evaluated result
  if (existingAttempt.status === 'completed' || existingAttempt.status === 'timed-out') {
    console.log('[IDEMPOTENT] Quiz attempt already completed. Returning existing results.');
    const fullSnapshots = await getQuizAttemptQuestions(userId, attemptId);
    return {
      attempt: {
        id: attemptSnap.id,
        ...existingAttempt,
        questionsSnapshot: fullSnapshots.length > 0 ? fullSnapshots : (existingAttempt.questionsSnapshot || []),
      },
      correctAnswers: existingAttempt.correctAnswers || 0,
      wrongAnswers: existingAttempt.wrongAnswers || 0,
      skippedAnswers: existingAttempt.skippedAnswers || 0,
      score: existingAttempt.score || 0,
      percentage: existingAttempt.percentage || 0,
    };
  }

  // Read snapshots from subcollection
  let questionSnapshots = await getQuizAttemptQuestions(userId, attemptId);
  if (questionSnapshots.length === 0 && questions.length > 0) {
    questionSnapshots = questions.map((q, idx) =>
      'order' in q ? (q as QuizQuestionSnapshot) : toQuestionSnapshot(q as QuestionBankQuestion, idx)
    );
  }

  const now = Timestamp.now();
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  const finalAnswers: Record<string, QuizAnswerRecord> = {};
  const subjectDeltaMap: Record<string, { viewed: number; answered: number; correct: number }> = {};

  // Answer-level Idempotency: Read previous progress to calculate exact net transition deltas
  for (const q of questionSnapshots) {
    const userAnswer = userAnswers[q.id];
    const selectedAnswer = userAnswer?.selectedAnswer || null;
    const timeSpent = userAnswer?.timeSpentSeconds || 0;

    let isCorrect = false;
    if (selectedAnswer) {
      isCorrect = selectedAnswer === q.correctAnswer;
      if (isCorrect) {
        correctCount += 1;
      } else {
        wrongCount += 1;
      }
    } else {
      skippedCount += 1;
    }

    finalAnswers[q.id] = {
      selectedAnswer,
      isCorrect,
      timeSpentSeconds: timeSpent,
    };

    // Inspect previous progress state
    const qProgressDoc = doc(db, 'users', userId, 'questionProgress', q.id);
    const prevSnap = await getDoc(qProgressDoc);
    const prevData = prevSnap.exists() ? prevSnap.data() : null;

    const wasViewed = prevData?.viewed === true;
    const wasAnswered = prevData?.answered === true;
    const wasCorrect = prevData?.isCorrect === true;

    const nowAnswered = selectedAnswer !== null;
    const nowCorrect = isCorrect;

    const viewedDelta = wasViewed ? 0 : 1;
    let answeredDelta = 0;
    let correctDelta = 0;

    if (!wasAnswered && nowAnswered) {
      answeredDelta = 1;
    }

    if (!wasCorrect && nowCorrect) {
      correctDelta = 1;
    } else if (wasCorrect && !nowCorrect && wasAnswered) {
      correctDelta = -1;
    }

    if (q.subjectId) {
      if (!subjectDeltaMap[q.subjectId]) {
        subjectDeltaMap[q.subjectId] = { viewed: 0, answered: 0, correct: 0 };
      }
      subjectDeltaMap[q.subjectId].viewed += viewedDelta;
      subjectDeltaMap[q.subjectId].answered += answeredDelta;
      subjectDeltaMap[q.subjectId].correct += correctDelta;
    }
  }

  const answeredCount = correctCount + wrongCount;
  const rawScore = correctCount - (wrongCount * negativeMarkingPerWrong);
  const score = Math.max(0, parseFloat(rawScore.toFixed(2)));
  const percentage = questionSnapshots.length > 0 ? Math.round((correctCount / questionSnapshots.length) * 100) : 0;

  // Prepare Firestore Batch
  const batch = writeBatch(db);

  batch.update(attemptDoc, {
    answers: finalAnswers,
    markedQuestionIds,
    answeredCount,
    correctAnswers: correctCount,
    wrongAnswers: wrongCount,
    skippedAnswers: skippedCount,
    score,
    percentage,
    timeTakenSeconds,
    status,
    completedAt: now,
  });

  // Synchronize individual Question Progress
  for (const q of questionSnapshots) {
    const qProgressDoc = doc(db, 'users', userId, 'questionProgress', q.id);
    const ans = finalAnswers[q.id];

    batch.set(
      qProgressDoc,
      {
        questionId: q.id,
        subjectId: q.subjectId,
        topicId: q.topicId,
        subtopicId: q.subtopicId || null,
        viewed: true,
        answered: ans.selectedAnswer !== null,
        selectedAnswer: ans.selectedAnswer || null,
        isCorrect: ans.isCorrect,
        answeredAt: ans.selectedAnswer ? now : null,
        lastViewedAt: now,
      },
      { merge: true }
    );
  }

  // Increment Subject Stats by exact net delta only
  for (const [subjectId, deltas] of Object.entries(subjectDeltaMap)) {
    if (deltas.viewed > 0 || deltas.answered > 0 || deltas.correct !== 0) {
      const statsDoc = doc(db, 'users', userId, 'progressStats', subjectId);
      batch.set(
        statsDoc,
        {
          subjectId,
          viewedCount: increment(deltas.viewed),
          answeredCount: increment(deltas.answered),
          correctCount: increment(deltas.correct),
          updatedAt: now,
        },
        { merge: true }
      );
    }
  }

  // Phase 4.3 Analytics Aggregates (O(1) dashboard reads)
  const analyticsOverviewDoc = doc(db, 'users', userId, 'analytics', 'overview');
  batch.set(
    analyticsOverviewDoc,
    {
      userId,
      totalQuizzes: increment(1),
      totalQuestionsAttempted: increment(answeredCount),
      totalCorrect: increment(correctCount),
      totalWrong: increment(wrongCount),
      totalSkipped: increment(skippedCount),
      totalScore: increment(score),
      totalDurationSeconds: increment(timeTakenSeconds),
      lastQuizAt: now,
      lastScore: score,
      lastPercentage: percentage,
      updatedAt: now,
    },
    { merge: true }
  );

  const subjectAttemptMap: Record<string, { subjectId: string; subjectName: string; attempted: number; correct: number; wrong: number }> = {};
  const topicAttemptMap: Record<string, { topicId: string; topicName: string; subjectId: string; subjectName: string; attempted: number; correct: number; wrong: number }> = {};

  for (const q of questionSnapshots) {
    const ans = finalAnswers[q.id];
    if (ans && ans.selectedAnswer) {
      if (q.subjectId) {
        if (!subjectAttemptMap[q.subjectId]) {
          subjectAttemptMap[q.subjectId] = {
            subjectId: q.subjectId,
            subjectName: q.subjectName || '',
            attempted: 0,
            correct: 0,
            wrong: 0,
          };
        }
        subjectAttemptMap[q.subjectId].attempted += 1;
        if (ans.isCorrect) subjectAttemptMap[q.subjectId].correct += 1;
        else subjectAttemptMap[q.subjectId].wrong += 1;
      }

      if (q.topicId) {
        if (!topicAttemptMap[q.topicId]) {
          topicAttemptMap[q.topicId] = {
            topicId: q.topicId,
            topicName: q.topicName || '',
            subjectId: q.subjectId || '',
            subjectName: q.subjectName || '',
            attempted: 0,
            correct: 0,
            wrong: 0,
          };
        }
        topicAttemptMap[q.topicId].attempted += 1;
        if (ans.isCorrect) topicAttemptMap[q.topicId].correct += 1;
        else topicAttemptMap[q.topicId].wrong += 1;
      }
    }
  }

  for (const [sId, sData] of Object.entries(subjectAttemptMap)) {
    const sDoc = doc(db, 'users', userId, 'analytics_subjects', sId);
    batch.set(
      sDoc,
      {
        subjectId: sId,
        subjectName: sData.subjectName,
        quizzesCount: increment(existingAttempt.subjectId === sId ? 1 : 0),
        totalAttempted: increment(sData.attempted),
        totalCorrect: increment(sData.correct),
        totalWrong: increment(sData.wrong),
        lastAttemptAt: now,
        updatedAt: now,
      },
      { merge: true }
    );
  }

  for (const [tId, tData] of Object.entries(topicAttemptMap)) {
    const tDoc = doc(db, 'users', userId, 'analytics_topics', tId);
    batch.set(
      tDoc,
      {
        topicId: tId,
        topicName: tData.topicName,
        subjectId: tData.subjectId,
        subjectName: tData.subjectName,
        totalAttempted: increment(tData.attempted),
        totalCorrect: increment(tData.correct),
        totalWrong: increment(tData.wrong),
        lastAttemptAt: now,
        updatedAt: now,
      },
      { merge: true }
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const dailyDoc = doc(db, 'users', userId, 'analytics_daily', todayStr);
  batch.set(
    dailyDoc,
    {
      date: todayStr,
      quizzesCount: increment(1),
      questionsAttempted: increment(answeredCount),
      correctCount: increment(correctCount),
      wrongCount: increment(wrongCount),
      totalScore: increment(score),
      timeSpentSeconds: increment(timeTakenSeconds),
      updatedAt: now,
    },
    { merge: true }
  );

  await batch.commit();

  const updatedSnap = await getDoc(attemptDoc);
  const fullAttempt = {
    id: attemptId,
    ...(updatedSnap.exists() ? updatedSnap.data() : existingAttempt),
    questionsSnapshot: questionSnapshots,
  } as QuizAttempt;

  return {
    attempt: fullAttempt,
    correctAnswers: correctCount,
    wrongAnswers: wrongCount,
    skippedAnswers: skippedCount,
    score,
    percentage,
  };
};

/**
 * Fetch all snapshotted questions from the attempt's subcollection
 */
export const getQuizAttemptQuestions = async (
  userId: string,
  attemptId: string
): Promise<QuizQuestionSnapshot[]> => {
  try {
    const subcollectionRef = collection(db, 'users', userId, 'quizAttempts', attemptId, 'questions');
    const q = query(subcollectionRef, orderBy('order', 'asc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as QuizQuestionSnapshot));
    }
    return [];
  } catch (error) {
    console.error('Error fetching quiz attempt question subcollection:', error);
    return [];
  }
};

/**
 * Fetch a single quiz attempt by ID with questions subcollection loaded
 */
export const getQuizAttemptById = async (
  userId: string,
  attemptId: string
): Promise<QuizAttempt | null> => {
  try {
    const attemptDoc = doc(db, 'users', userId, 'quizAttempts', attemptId);
    const snap = await getDoc(attemptDoc);
    if (!snap.exists()) return null;

    const attemptData = { id: snap.id, ...snap.data() } as QuizAttempt;
    const questionsSnapshot = await getQuizAttemptQuestions(userId, attemptId);

    return {
      ...attemptData,
      questionsSnapshot: questionsSnapshot.length > 0 ? questionsSnapshot : (attemptData.questionsSnapshot || []),
    };
  } catch (error) {
    console.error('Error fetching quiz attempt:', error);
    return null;
  }
};

/**
 * Fetch user's recent quiz attempts
 */
export const getUserQuizAttempts = async (
  userId: string,
  limitCount = 20
): Promise<QuizAttempt[]> => {
  try {
    const attemptsRef = collection(db, 'users', userId, 'quizAttempts');
    const q = query(attemptsRef, orderBy('startedAt', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as QuizAttempt));
  } catch (error) {
    console.error('Error fetching quiz attempts list:', error);
    return [];
  }
};

/**
 * Abandon/exit a quiz early
 */
export const abandonQuizAttempt = async (
  userId: string,
  attemptId: string,
  timeTakenSeconds = 0
): Promise<void> => {
  try {
    const attemptDoc = doc(db, 'users', userId, 'quizAttempts', attemptId);
    const now = Timestamp.now();
    await updateDoc(attemptDoc, {
      status: 'abandoned',
      timeTakenSeconds,
      completedAt: now,
    });
  } catch (error) {
    console.error('Error abandoning quiz attempt:', error);
  }
};

// Aliases for legacy compatibility
export const createQuizAttempt = async (
  userId: string,
  params: {
    subjectId?: string;
    topicId?: string;
    subtopicId?: string | null;
    totalQuestions: number;
    difficulty?: QuestionDifficulty;
  }
): Promise<string> => {
  const attempt = await startQuizAttempt(
    userId,
    {
      mode: params.subjectId ? 'subject' : 'mixed',
      subjectId: params.subjectId,
      topicId: params.topicId,
      subtopicId: params.subtopicId,
      difficulty: params.difficulty,
      questionCount: params.totalQuestions,
      durationSeconds: 0,
    },
    []
  );
  return attempt.id;
};

export const completeQuizAttempt = async (
  userId: string,
  attemptId: string,
  results: {
    correctAnswers: number;
    wrongAnswers: number;
    skippedAnswers?: number;
    score: number;
    percentage?: number;
    durationSeconds?: number;
  }
): Promise<void> => {
  const attemptDoc = doc(db, 'users', userId, 'quizAttempts', attemptId);
  const now = Timestamp.now();
  await updateDoc(attemptDoc, {
    ...results,
    status: 'completed',
    completedAt: now,
  });
};
