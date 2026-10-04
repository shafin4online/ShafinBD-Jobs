import {
  doc,
  getDoc,
  runTransaction,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import {
  QuestionBankQuestion,
  QuestionProgress,
  SubjectProgressStats,
  CorrectAnswer,
} from '../../../types/questionBank';

/**
 * Mark question as viewed / read by user and atomically update subject summary stats
 */
export const markQuestionViewed = async (
  userId: string,
  question: QuestionBankQuestion
): Promise<void> => {
  if (!userId || !question.id) return;
  const progressDoc = doc(db, 'users', userId, 'questionProgress', question.id);
  const statsDoc = doc(db, 'users', userId, 'progressStats', question.subjectId);
  const now = Timestamp.now();

  await runTransaction(db, async (transaction) => {
    const progressSnap = await transaction.get(progressDoc);
    const alreadyViewed = progressSnap.exists() && progressSnap.data()?.viewed;

    transaction.set(
      progressDoc,
      {
        questionId: question.id,
        subjectId: question.subjectId,
        topicId: question.topicId,
        subtopicId: question.subtopicId,
        viewed: true,
        lastViewedAt: now,
        firstViewedAt: alreadyViewed ? progressSnap.data()?.firstViewedAt : now,
      },
      { merge: true }
    );

    // Atomically increment subject viewedCount only if not previously viewed
    if (!alreadyViewed) {
      transaction.set(
        statsDoc,
        {
          subjectId: question.subjectId,
          viewedCount: increment(1),
          updatedAt: now,
        },
        { merge: true }
      );
    }
  });
};

/**
 * Save user's answer & atomically update summary stats
 */
export const saveAnswer = async (
  userId: string,
  question: QuestionBankQuestion,
  selectedAnswer: CorrectAnswer
): Promise<{ isCorrect: boolean }> => {
  if (!userId || !question.id) return { isCorrect: false };
  const progressDoc = doc(db, 'users', userId, 'questionProgress', question.id);
  const statsDoc = doc(db, 'users', userId, 'progressStats', question.subjectId);
  const now = Timestamp.now();
  const isCorrect = selectedAnswer === question.correctAnswer;

  await runTransaction(db, async (transaction) => {
    const progressSnap = await transaction.get(progressDoc);
    const alreadyAnswered = progressSnap.exists() && progressSnap.data()?.answered;
    const previouslyCorrect = progressSnap.exists() && progressSnap.data()?.isCorrect;

    transaction.set(
      progressDoc,
      {
        questionId: question.id,
        subjectId: question.subjectId,
        topicId: question.topicId,
        subtopicId: question.subtopicId,
        viewed: true,
        answered: true,
        selectedAnswer,
        isCorrect,
        answeredAt: now,
        lastViewedAt: now,
      },
      { merge: true }
    );

    // Update aggregated stats document
    const statsUpdate: Record<string, unknown> = {
      subjectId: question.subjectId,
      updatedAt: now,
    };

    if (!alreadyAnswered) {
      statsUpdate.answeredCount = increment(1);
      if (isCorrect) {
        statsUpdate.correctCount = increment(1);
      }
    } else if (previouslyCorrect !== isCorrect) {
      // User changed from wrong to correct or vice versa
      statsUpdate.correctCount = increment(isCorrect ? 1 : -1);
    }

    transaction.set(statsDoc, statsUpdate, { merge: true });
  });

  return { isCorrect };
};

/**
 * Get progress on a specific question
 */
export const getQuestionProgress = async (
  userId: string,
  questionId: string
): Promise<QuestionProgress | null> => {
  if (!userId || !questionId) return null;
  try {
    const snap = await getDoc(doc(db, 'users', userId, 'questionProgress', questionId));
    if (!snap.exists()) return null;
    return snap.data() as QuestionProgress;
  } catch (error) {
    console.error('Error fetching question progress:', error);
    return null;
  }
};

/**
 * Instant O(1) read of user's subject progress from summary document
 */
export const getUserSubjectProgress = async (
  userId: string,
  subjectId: string
): Promise<{ viewedCount: number; answeredCount: number; correctCount: number }> => {
  if (!userId || !subjectId) return { viewedCount: 0, answeredCount: 0, correctCount: 0 };
  try {
    const statsSnap = await getDoc(doc(db, 'users', userId, 'progressStats', subjectId));
    if (statsSnap.exists()) {
      const data = statsSnap.data() as SubjectProgressStats;
      return {
        viewedCount: data.viewedCount || 0,
        answeredCount: data.answeredCount || 0,
        correctCount: data.correctCount || 0,
      };
    }
    return { viewedCount: 0, answeredCount: 0, correctCount: 0 };
  } catch (error) {
    console.error(`Error reading progress stats for subject ${subjectId}:`, error);
    return { viewedCount: 0, answeredCount: 0, correctCount: 0 };
  }
};

export const getSubjectStats = getUserSubjectProgress;
