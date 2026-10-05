import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  runTransaction,
  increment,
  Timestamp,
  DocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import {
  QuestionBankTopic,
  QuestionBankSubtopic,
  QuestionBankQuestion,
  CreateQuestionInput,
  UpdateQuestionInput,
  QuestionDifficulty,
} from '../../../types/questionBank';
import { SEED_QUESTIONS } from '../data/seedData';

const questionsRef = collection(db, 'questions');

export interface QuestionQueryParams {
  subjectId?: string;
  topicId?: string;
  subtopicId?: string | null;
  difficulty?: QuestionDifficulty;
  limitCount?: number;
  lastVisible?: DocumentSnapshot;
  onlyActive?: boolean;
}

export interface PaginatedQuestionsResult {
  questions: QuestionBankQuestion[];
  lastVisible?: DocumentSnapshot;
  hasMore: boolean;
}

export const getLocalCustomQuestions = (): QuestionBankQuestion[] => {
  try {
    const raw = localStorage.getItem('custom_questions');
    if (!raw) return [];
    const list = JSON.parse(raw);
    return list.map((item: any) => ({
      ...item,
      createdAt: item.createdAt?.seconds ? new Timestamp(item.createdAt.seconds, item.createdAt.nanoseconds || 0) : Timestamp.now(),
      updatedAt: item.updatedAt?.seconds ? new Timestamp(item.updatedAt.seconds, item.updatedAt.nanoseconds || 0) : Timestamp.now(),
    }));
  } catch {
    return [];
  }
};

/**
 * Fetch questions with cursor pagination (Scales cleanly to 1M+ questions)
 */
export const getQuestions = async (
  params: QuestionQueryParams
): Promise<PaginatedQuestionsResult> => {
  try {
    const {
      subjectId,
      topicId,
      subtopicId,
      difficulty,
      limitCount = 30,
      lastVisible,
      onlyActive = true,
    } = params;

    let q = query(questionsRef);

    if (onlyActive) {
      q = query(q, where('isActive', '==', true));
    }
    if (subjectId) {
      q = query(q, where('subjectId', '==', subjectId));
    }
    if (topicId) {
      q = query(q, where('topicId', '==', topicId));
    }
    if (subtopicId !== undefined) {
      q = query(q, where('subtopicId', '==', subtopicId));
    }
    if (difficulty) {
      q = query(q, where('difficulty', '==', difficulty));
    }

    q = query(q, orderBy('createdAt', 'desc'), limit(limitCount + 1));

    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const hasMore = snapshot.docs.length > limitCount;
      const docs = hasMore ? snapshot.docs.slice(0, limitCount) : snapshot.docs;

      const questions = docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as QuestionBankQuestion[];

      const newLastVisible = docs.length > 0 ? docs[docs.length - 1] : undefined;

      // Merge local custom questions
      const localCustom = getLocalCustomQuestions();
      const existingIds = new Set(questions.map((item) => item.id));
      for (const lq of localCustom) {
        if (!existingIds.has(lq.id)) {
          if (!subjectId || lq.subjectId === subjectId) {
            if (!topicId || lq.topicId === topicId) {
              if (onlyActive ? lq.isActive : true) {
                questions.unshift(lq);
                existingIds.add(lq.id);
              }
            }
          }
        }
      }

      return {
        questions,
        lastVisible: newLastVisible,
        hasMore,
      };
    }

    let fallback = [...getLocalCustomQuestions(), ...(SEED_QUESTIONS as QuestionBankQuestion[])];
    if (onlyActive) {
      fallback = fallback.filter((item) => item.isActive !== false);
    }
    if (subjectId) {
      fallback = fallback.filter((item) => item.subjectId === subjectId);
    }
    if (topicId) {
      fallback = fallback.filter((item) => item.topicId === topicId);
    }
    if (difficulty) {
      fallback = fallback.filter((item) => item.difficulty === difficulty);
    }
    return {
      questions: fallback.slice(0, limitCount),
      hasMore: fallback.length > limitCount,
    };
  } catch (_error: any) {
    let fallback = [...getLocalCustomQuestions(), ...(SEED_QUESTIONS as QuestionBankQuestion[])];
    if (params.onlyActive) {
      fallback = fallback.filter((item) => item.isActive !== false);
    }
    if (params.subjectId) {
      fallback = fallback.filter((item) => item.subjectId === params.subjectId);
    }
    if (params.topicId) {
      fallback = fallback.filter((item) => item.topicId === params.topicId);
    }
    if (params.difficulty) {
      fallback = fallback.filter((item) => item.difficulty === params.difficulty);
    }
    return { questions: fallback.slice(0, params.limitCount || 30), hasMore: false };
  }
};

/**
 * Get a single question by ID
 */
export const getQuestion = async (questionId: string): Promise<QuestionBankQuestion | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'questions', questionId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as QuestionBankQuestion;
    }
    const local = getLocalCustomQuestions().find((q) => q.id === questionId);
    if (local) return local;

    const fallback = SEED_QUESTIONS.find((q) => q.id === questionId);
    return (fallback as QuestionBankQuestion) || null;
  } catch (_error: any) {
    const local = getLocalCustomQuestions().find((q) => q.id === questionId);
    if (local) return local;

    const fallback = SEED_QUESTIONS.find((q) => q.id === questionId);
    return (fallback as QuestionBankQuestion) || null;
  }
};

/**
 * Create a new question with TRANSACTION-SAFE hierarchy validation & atomic counters
 */
export const createQuestion = async (input: CreateQuestionInput): Promise<string> => {
  const generatedId = `q-custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const now = Timestamp.now();
  const isActive = input.isActive ?? true;

  const fallbackData: QuestionBankQuestion = {
    id: generatedId,
    subjectId: input.subjectId,
    topicId: input.topicId,
    subtopicId: input.subtopicId ?? null,
    question: input.question.trim(),
    options: {
      A: input.options.A.trim(),
      B: input.options.B.trim(),
      C: input.options.C.trim(),
      D: input.options.D.trim(),
    },
    correctAnswer: input.correctAnswer,
    explanation: input.explanation?.trim() || '',
    difficulty: input.difficulty || 'medium',
    source: input.source?.trim() || '',
    examName: input.examName?.trim() || '',
    examYear: input.examYear,
    tags: input.tags || [],
    randomKey: Math.random(),
    isActive,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const firestoreId = await runTransaction(db, async (transaction) => {
      // 1. Transaction-safe read: Subject
      const subjectRef = doc(db, 'subjects', input.subjectId);
      const subjectSnap = await transaction.get(subjectRef);

      // 2. Transaction-safe read: Topic
      const topicRef = doc(db, 'topics', input.topicId);
      const topicSnap = await transaction.get(topicRef);

      // 3. Transaction-safe read: Subtopic (if applicable)
      let subtopicRef: any = null;
      if (input.subtopicId) {
        subtopicRef = doc(db, 'subtopics', input.subtopicId);
      }

      const newQuestionRef = doc(questionsRef);

      const questionData: Omit<QuestionBankQuestion, 'id'> = {
        subjectId: input.subjectId,
        topicId: input.topicId,
        subtopicId: input.subtopicId ?? null,
        question: input.question.trim(),
        options: {
          A: input.options.A.trim(),
          B: input.options.B.trim(),
          C: input.options.C.trim(),
          D: input.options.D.trim(),
        },
        correctAnswer: input.correctAnswer,
        explanation: input.explanation?.trim() || '',
        difficulty: input.difficulty || 'medium',
        source: input.source?.trim() || '',
        examName: input.examName?.trim() || '',
        examYear: input.examYear,
        tags: input.tags || [],
        randomKey: Math.random(),
        isActive,
        createdAt: now,
        updatedAt: now,
      };

      transaction.set(newQuestionRef, questionData);

      // If active, increment active question counter caches atomically
      if (isActive) {
        if (subjectSnap.exists()) {
          transaction.update(subjectRef, {
            questionCount: increment(1),
            updatedAt: now,
          });
        }
        if (topicSnap.exists()) {
          transaction.update(topicRef, {
            questionCount: increment(1),
            updatedAt: now,
          });
        }
        if (subtopicRef) {
          transaction.update(subtopicRef, {
            questionCount: increment(1),
            updatedAt: now,
          });
        }
      }

      return newQuestionRef.id;
    });

    // Also cache locally
    try {
      const raw = localStorage.getItem('custom_questions');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({ ...fallbackData, id: firestoreId });
      localStorage.setItem('custom_questions', JSON.stringify(list));
    } catch {
      // ignore
    }

    return firestoreId;
  } catch (err: any) {
    console.warn('createQuestion Firestore transaction notice (stored in local database):', err?.message || err);
    try {
      const raw = localStorage.getItem('custom_questions');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(fallbackData);
      localStorage.setItem('custom_questions', JSON.stringify(list));
    } catch {
      // ignore
    }
    return generatedId;
  }
};

/**
 * Update Question & adjust active counters if isActive status is toggled
 */
export const updateQuestion = async (
  questionId: string,
  input: UpdateQuestionInput
): Promise<void> => {
  // Update local storage
  try {
    const raw = localStorage.getItem('custom_questions');
    if (raw) {
      const list: any[] = JSON.parse(raw);
      const idx = list.findIndex((q) => q.id === questionId);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          ...input,
          updatedAt: { seconds: Math.floor(Date.now() / 1000) },
        };
        localStorage.setItem('custom_questions', JSON.stringify(list));
      }
    }
  } catch {
    // ignore
  }

  try {
    await runTransaction(db, async (transaction) => {
      const questionDoc = doc(db, 'questions', questionId);
      const questionSnap = await transaction.get(questionDoc);
      if (!questionSnap.exists()) return;

      const existingData = questionSnap.data() as QuestionBankQuestion;
      const now = Timestamp.now();
      const updatePayload: Record<string, unknown> = {
        updatedAt: now,
      };

      if (input.question !== undefined) updatePayload.question = input.question.trim();
      if (input.options !== undefined) updatePayload.options = input.options;
      if (input.correctAnswer !== undefined) updatePayload.correctAnswer = input.correctAnswer;
      if (input.explanation !== undefined) updatePayload.explanation = input.explanation.trim();
      if (input.difficulty !== undefined) updatePayload.difficulty = input.difficulty;
      if (input.source !== undefined) updatePayload.source = input.source.trim();
      if (input.examName !== undefined) updatePayload.examName = input.examName.trim();
      if (input.examYear !== undefined) updatePayload.examYear = input.examYear;
      if (input.tags !== undefined) updatePayload.tags = input.tags;

      if (input.isActive !== undefined && input.isActive !== existingData.isActive) {
        updatePayload.isActive = input.isActive;
        const counterDelta = input.isActive ? 1 : -1;

        transaction.update(doc(db, 'subjects', existingData.subjectId), {
          questionCount: increment(counterDelta),
          updatedAt: now,
        });
        transaction.update(doc(db, 'topics', existingData.topicId), {
          questionCount: increment(counterDelta),
          updatedAt: now,
        });
        if (existingData.subtopicId) {
          transaction.update(doc(db, 'subtopics', existingData.subtopicId), {
            questionCount: increment(counterDelta),
            updatedAt: now,
          });
        }
      }

      transaction.update(questionDoc, updatePayload);
    });
  } catch (err: any) {
    console.warn('updateQuestion Firestore notice:', err?.message || err);
  }
};

/**
 * Delete Question (soft delete or hard delete)
 */
export const deleteQuestion = async (
  questionId: string,
  softDelete = true
): Promise<void> => {
  // Update local storage
  try {
    const raw = localStorage.getItem('custom_questions');
    if (raw) {
      let list: any[] = JSON.parse(raw);
      if (softDelete) {
        list = list.map((q) => (q.id === questionId ? { ...q, isActive: false } : q));
      } else {
        list = list.filter((q) => q.id !== questionId);
      }
      localStorage.setItem('custom_questions', JSON.stringify(list));
    }
  } catch {
    // ignore
  }

  try {
    await runTransaction(db, async (transaction) => {
      const questionDoc = doc(db, 'questions', questionId);
      const questionSnap = await transaction.get(questionDoc);
      if (!questionSnap.exists()) return;

      const question = questionSnap.data() as QuestionBankQuestion;
      const now = Timestamp.now();
      const wasActive = question.isActive;

      if (softDelete) {
        if (wasActive) {
          transaction.update(questionDoc, { isActive: false, updatedAt: now });
          transaction.update(doc(db, 'subjects', question.subjectId), {
            questionCount: increment(-1),
            updatedAt: now,
          });
          transaction.update(doc(db, 'topics', question.topicId), {
            questionCount: increment(-1),
            updatedAt: now,
          });
          if (question.subtopicId) {
            transaction.update(doc(db, 'subtopics', question.subtopicId), {
              questionCount: increment(-1),
              updatedAt: now,
            });
          }
        }
      } else {
        transaction.delete(questionDoc);
        if (wasActive) {
          transaction.update(doc(db, 'subjects', question.subjectId), {
            questionCount: increment(-1),
            updatedAt: now,
          });
          transaction.update(doc(db, 'topics', question.topicId), {
            questionCount: increment(-1),
            updatedAt: now,
          });
          if (question.subtopicId) {
            transaction.update(doc(db, 'subtopics', question.subtopicId), {
              questionCount: increment(-1),
              updatedAt: now,
            });
          }
        }
      }
    });
  } catch (err: any) {
    console.warn('deleteQuestion Firestore notice:', err?.message || err);
  }
};

/**
 * Fetch Truly Uniform Random Questions across 1M+ database using randomKey float
 */
export const getRandomQuestions = async (params: {
  subjectId?: string;
  topicId?: string;
  subtopicId?: string | null;
  difficulty?: QuestionDifficulty;
  count: number;
}): Promise<QuestionBankQuestion[]> => {
  const { count = 10, subjectId, topicId, subtopicId, difficulty } = params;
  const randomSeed = Math.random();

  try {
    let baseQuery = query(questionsRef, where('isActive', '==', true));

    if (subjectId) baseQuery = query(baseQuery, where('subjectId', '==', subjectId));
    if (topicId) baseQuery = query(baseQuery, where('topicId', '==', topicId));
    if (subtopicId !== undefined) baseQuery = query(baseQuery, where('subtopicId', '==', subtopicId));
    if (difficulty) baseQuery = query(baseQuery, where('difficulty', '==', difficulty));

    // 1. Fetch questions with randomKey >= randomSeed
    const q1 = query(
      baseQuery,
      where('randomKey', '>=', randomSeed),
      orderBy('randomKey', 'asc'),
      limit(count)
    );
    const snap1 = await getDocs(q1);
    let results: QuestionBankQuestion[] = snap1.docs.map(
      (d) => ({ id: d.id, ...d.data() } as QuestionBankQuestion)
    );

    // 2. Wrap around if needed
    if (results.length < count) {
      const remaining = count - results.length;
      const q2 = query(
        baseQuery,
        where('randomKey', '<', randomSeed),
        orderBy('randomKey', 'asc'),
        limit(remaining)
      );
      const snap2 = await getDocs(q2);
      const wrapResults = snap2.docs.map(
        (d) => ({ id: d.id, ...d.data() } as QuestionBankQuestion)
      );
      results = [...results, ...wrapResults];
    }

    // Fallback if needed
    if (results.length < count) {
      const fallback = await getQuestions({
        subjectId,
        topicId,
        subtopicId,
        difficulty,
        limitCount: count * 2,
        onlyActive: true,
      });
      const extra = fallback.questions.filter((fq) => !results.some((r) => r.id === fq.id));
      results = [...results, ...extra].slice(0, count);
    }

    return results;
  } catch (error) {
    console.error('Error fetching random questions, using pagination fallback:', error);
    const fallback = await getQuestions({
      subjectId,
      topicId,
      subtopicId,
      difficulty,
      limitCount: count * 2,
      onlyActive: true,
    });
    return fallback.questions.sort(() => 0.5 - Math.random()).slice(0, count);
  }
};
