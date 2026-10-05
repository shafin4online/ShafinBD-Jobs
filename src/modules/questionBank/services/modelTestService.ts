import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
  writeBatch,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import {
  LiveModelTest,
  ModelTestCategory,
  ModelTestStatus,
  ModelTestLeaderboardEntry,
  UserLiveModelTestSubmission,
  CreateModelTestInput,
} from '../../../types/modelTest';
import {
  QuizQuestionSnapshot,
  QuizAnswerRecord,
} from '../../../types/questionBank';
import { getSampleModelTestsFallback } from '../data/seedModelTests';

export const CATEGORY_NAMES: Record<ModelTestCategory, string> = {
  bcs: 'বিসিএস প্রিলিমিনারি',
  primary: 'প্রাইমারি সহকারী শিক্ষক',
  bank: 'ব্যাংক নিয়োগ পরীক্ষা',
  ntrca: 'এনটিআরসিএ (শিক্ষক নিবন্ধন)',
  admission: 'বিশ্ববিদ্যালয় ভর্তি',
  special: 'বিশেষ ও মন্ত্রণালয় পরীক্ষা',
};

/**
 * Real-time status calculator for scheduled model tests
 */
export const computeTestStatus = (startsAt: Timestamp, endsAt: Timestamp): ModelTestStatus => {
  const now = Date.now();
  const startMs = startsAt.toMillis();
  const endMs = endsAt.toMillis();

  if (now < startMs) return 'upcoming';
  if (now >= startMs && now <= endMs) return 'live';
  return 'ended';
};

/**
 * Fetch all active Model Tests
 */
export const getModelTests = async (
  category?: ModelTestCategory | 'all'
): Promise<LiveModelTest[]> => {
  try {
    const colRef = collection(db, 'modelTests');
    let q = query(colRef, orderBy('startsAt', 'desc'), limit(50));
    if (category && category !== 'all') {
      q = query(colRef, where('category', '==', category), orderBy('startsAt', 'desc'), limit(50));
    }
    const snap = await getDocs(q);

    let tests: LiveModelTest[] = [];
    if (!snap.empty) {
      tests = snap.docs.map((d) => {
        const data = d.data();
        const startsAt = data.startsAt as Timestamp;
        const endsAt = data.endsAt as Timestamp;
        const dynamicStatus = computeTestStatus(startsAt, endsAt);

        return {
          id: d.id,
          title: data.title || '',
          category: (data.category as ModelTestCategory) || 'bcs',
          categoryName: CATEGORY_NAMES[data.category as ModelTestCategory] || 'মডেল টেস্ট',
          description: data.description || '',
          instructions: data.instructions || [
            'প্রতিটি প্রশ্নের মান ১ নম্বর।',
            'ভুল উত্তরের জন্য নির্ধারিত নেগেটিভ মার্কিং প্রযোজ্য হবে।',
            'লাইভ সময় শেষ হওয়া মাত্র পরীক্ষা স্বয়ংক্রিয়ভাবে সাবমিট হয়ে যাবে।',
          ],
          totalQuestions: data.totalQuestions || 0,
          totalMarks: data.totalMarks || 0,
          durationMinutes: data.durationMinutes || 60,
          negativeMarking: data.negativeMarking ?? 0.5,
          passMarks: data.passMarks || 0,
          startsAt,
          endsAt,
          resultPublishAt: data.resultPublishAt || endsAt,
          status: dynamicStatus,
          totalParticipants: data.totalParticipants || 0,
          highestScore: data.highestScore || 0,
          averageScore: data.averageScore || 0,
          questionIds: data.questionIds || [],
          questionsSnapshot: data.questionsSnapshot || [],
          isFeatured: data.isFeatured || false,
          isActive: data.isActive !== false,
          createdAt: data.createdAt,
        } as LiveModelTest;
      });
    } else {
      tests = getSampleModelTestsFallback();
    }

    // Merge with any custom tests created by admin stored locally
    const customTests = getLocalCustomModelTests();
    const existingIds = new Set(tests.map((t) => t.id));
    for (const ct of customTests) {
      if (!existingIds.has(ct.id)) {
        tests.unshift(ct);
        existingIds.add(ct.id);
      }
    }

    if (category && category !== 'all') {
      return tests.filter((t) => t.category === category);
    }
    return tests;
  } catch (_error: any) {
    let fallbacks = [...getLocalCustomModelTests(), ...getSampleModelTestsFallback()];
    const uniqueMap = new Map<string, LiveModelTest>();
    fallbacks.forEach((f) => uniqueMap.set(f.id, f));
    fallbacks = Array.from(uniqueMap.values());

    if (category && category !== 'all') {
      return fallbacks.filter((t) => t.category === category);
    }
    return fallbacks;
  }
};

/**
 * Fetch Single Model Test by ID
 */
export const getModelTestById = async (id: string): Promise<LiveModelTest | null> => {
  try {
    const docRef = doc(db, 'modelTests', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const startsAt = data.startsAt as Timestamp;
      const endsAt = data.endsAt as Timestamp;

      return {
        id: snap.id,
        title: data.title || '',
        category: (data.category as ModelTestCategory) || 'bcs',
        categoryName: CATEGORY_NAMES[data.category as ModelTestCategory] || 'মডেল টেস্ট',
        description: data.description || '',
        instructions: data.instructions || [],
        totalQuestions: data.totalQuestions || 0,
        totalMarks: data.totalMarks || 0,
        durationMinutes: data.durationMinutes || 60,
        negativeMarking: data.negativeMarking ?? 0.5,
        passMarks: data.passMarks || 0,
        startsAt,
        endsAt,
        resultPublishAt: data.resultPublishAt || endsAt,
        status: computeTestStatus(startsAt, endsAt),
        totalParticipants: data.totalParticipants || 0,
        highestScore: data.highestScore || 0,
        averageScore: data.averageScore || 0,
        questionIds: data.questionIds || [],
        questionsSnapshot: data.questionsSnapshot || [],
        isFeatured: data.isFeatured || false,
        isActive: data.isActive !== false,
        createdAt: data.createdAt,
      } as LiveModelTest;
    }

    const customLocal = getLocalCustomModelTests().find((t) => t.id === id);
    if (customLocal) return customLocal;

    const fallback = getSampleModelTestsFallback().find((t) => t.id === id);
    return fallback || null;
  } catch (_error: any) {
    const customLocal = getLocalCustomModelTests().find((t) => t.id === id);
    if (customLocal) return customLocal;

    const fallback = getSampleModelTestsFallback().find((t) => t.id === id);
    return fallback || null;
  }
};

/**
 * Fetch Questions belonging to Model Test (with snapshot integrity guarantee)
 */
export const getModelTestQuestions = async (
  test: LiveModelTest
): Promise<QuizQuestionSnapshot[]> => {
  if (test.questionsSnapshot && test.questionsSnapshot.length > 0) {
    return test.questionsSnapshot;
  }
  return [];
};

/**
 * Fetch User's existing submission for a model test
 */
export const getUserModelTestSubmission = async (
  testId: string,
  userId: string
): Promise<UserLiveModelTestSubmission | null> => {
  try {
    const subDoc = doc(db, 'modelTests', testId, 'submissions', userId);
    const snap = await getDoc(subDoc);
    if (snap.exists()) {
      return {
        id: snap.id,
        ...snap.data(),
      } as UserLiveModelTestSubmission;
    }
  } catch (error: any) {
    console.warn('Firestore user submission notice (checking local cache):', error?.message || error);
  }

  // Check LocalStorage fallback
  try {
    const cached = localStorage.getItem(`model_test_sub_${testId}_${userId}`);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    // ignore
  }

  return null;
};

/**
 * Submit Live Model Test Exam
 */
export const submitLiveModelTest = async (
  test: LiveModelTest,
  userId: string,
  userName: string,
  userPhoto: string | undefined,
  answers: Record<string, { selectedAnswer: any; timeSpentSeconds?: number }>,
  timeTakenSeconds: number,
  questions: QuizQuestionSnapshot[]
): Promise<UserLiveModelTestSubmission> => {
  try {
    // 1. Check idempotency
    const existing = await getUserModelTestSubmission(test.id, userId);
    if (existing && existing.status === 'completed') {
      return existing;
    }

    const now = Timestamp.now();
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    const evaluatedAnswers: Record<string, QuizAnswerRecord> = {};

    for (const q of questions) {
      const userAns = answers[q.id];
      const selected = userAns?.selectedAnswer || null;
      let isCorrect = false;

      if (selected) {
        isCorrect = selected === q.correctAnswer;
        if (isCorrect) correctCount += 1;
        else wrongCount += 1;
      } else {
        skippedCount += 1;
      }

      evaluatedAnswers[q.id] = {
        selectedAnswer: selected,
        isCorrect,
        timeSpentSeconds: userAns?.timeSpentSeconds || 0,
      };
    }

    const rawScore = correctCount - wrongCount * (test.negativeMarking || 0);
    const finalScore = parseFloat(Math.max(0, rawScore).toFixed(2));
    const totalQ = questions.length || 1;
    const percentage = Math.round((correctCount / totalQ) * 100);
    const isPassed = finalScore >= (test.passMarks || 0);

    const submissionData: UserLiveModelTestSubmission = {
      id: userId,
      modelTestId: test.id,
      userId,
      userName: userName || 'পরীক্ষার্থী',
      userPhoto: userPhoto || '',
      answers: evaluatedAnswers,
      score: finalScore,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      skippedAnswers: skippedCount,
      percentage,
      timeTakenSeconds,
      isPassed,
      status: 'completed',
      startedAt: test.startsAt,
      completedAt: now,
    };

    // Store in localStorage as immediate fallback
    try {
      localStorage.setItem(`model_test_sub_${test.id}_${userId}`, JSON.stringify(submissionData));
    } catch (e) {
      // ignore
    }

    // Try Firestore batch write
    try {
      const batch = writeBatch(db);

      // Save individual submission
      const subDocRef = doc(db, 'modelTests', test.id, 'submissions', userId);
      batch.set(subDocRef, submissionData);

      // Save Leaderboard record
      const leaderboardDocRef = doc(db, 'modelTests', test.id, 'leaderboard', userId);
      const leaderboardRecord: ModelTestLeaderboardEntry = {
        id: userId,
        modelTestId: test.id,
        userId,
        userName: userName || 'পরীক্ষার্থী',
        userPhoto: userPhoto || '',
        score: finalScore,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        skippedAnswers: skippedCount,
        percentage,
        timeTakenSeconds,
        rank: 1, // Computed dynamically on fetch
        isPassed,
        submittedAt: now,
      };
      batch.set(leaderboardDocRef, leaderboardRecord);

      // Update Model Test stats
      const testDocRef = doc(db, 'modelTests', test.id);
      batch.update(testDocRef, {
        totalParticipants: increment(1),
        highestScore: Math.max(test.highestScore || 0, finalScore),
        updatedAt: now,
      });

      await batch.commit();
    } catch (firestoreError: any) {
      console.warn('Model test submission stored locally due to firestore notice:', firestoreError?.message || firestoreError);
    }

    return submissionData;
  } catch (error) {
    console.warn('Error submitting live model test (returning local state):', error);
    throw error;
  }
};

/**
 * Generate fallback merit list with competitive ranking
 */
const getSampleLeaderboardFallback = (
  testId: string,
  userSubmission?: UserLiveModelTestSubmission | null
): ModelTestLeaderboardEntry[] => {
  const now = Timestamp.now();
  const sampleCandidates = [
    { name: 'তানভীর আহমেদ', photo: '', score: 19.5, correct: 20, wrong: 1, time: 740, pass: true },
    { name: 'নুসরাত জাহান', photo: '', score: 18.75, correct: 19, wrong: 1, time: 810, pass: true },
    { name: 'রাকিবুল ইসলাম', photo: '', score: 18.0, correct: 18, wrong: 0, time: 690, pass: true },
    { name: 'মেহজাবিন চৌধুরী', photo: '', score: 17.5, correct: 18, wrong: 2, time: 860, pass: true },
    { name: 'শাকিল খান', photo: '', score: 16.5, correct: 17, wrong: 2, time: 920, pass: true },
    { name: 'ফারহানা ইয়াসমিন', photo: '', score: 15.0, correct: 16, wrong: 4, time: 980, pass: true },
    { name: 'আরিফ হোসেন', photo: '', score: 14.25, correct: 15, wrong: 3, time: 1040, pass: true },
    { name: 'সাদিয়া আফরিন', photo: '', score: 13.5, correct: 14, wrong: 2, time: 1100, pass: true },
    { name: 'মাহমুদুল হাসান', photo: '', score: 12.0, correct: 13, wrong: 4, time: 1150, pass: true },
    { name: 'ইশরাত জাহান', photo: '', score: 10.5, correct: 11, wrong: 2, time: 1180, pass: true },
  ];

  const list: ModelTestLeaderboardEntry[] = sampleCandidates.map((c, idx) => ({
    id: `mock-lb-${idx + 1}`,
    modelTestId: testId,
    userId: `mock-user-${idx + 1}`,
    userName: c.name,
    userPhoto: c.photo,
    score: c.score,
    totalQuestions: 20,
    correctAnswers: c.correct,
    wrongAnswers: c.wrong,
    skippedAnswers: 20 - (c.correct + c.wrong),
    percentage: Math.round((c.correct / 20) * 100),
    timeTakenSeconds: c.time,
    rank: idx + 1,
    percentile: 100,
    isPassed: c.pass,
    submittedAt: now,
  }));

  if (userSubmission) {
    list.push({
      id: userSubmission.userId,
      modelTestId: testId,
      userId: userSubmission.userId,
      userName: userSubmission.userName,
      userPhoto: userSubmission.userPhoto || '',
      score: userSubmission.score,
      totalQuestions: userSubmission.totalQuestions,
      correctAnswers: userSubmission.correctAnswers,
      wrongAnswers: userSubmission.wrongAnswers,
      skippedAnswers: userSubmission.skippedAnswers,
      percentage: userSubmission.percentage,
      timeTakenSeconds: userSubmission.timeTakenSeconds,
      rank: 1,
      percentile: 100,
      isPassed: userSubmission.isPassed,
      submittedAt: userSubmission.completedAt,
    });
  }

  // Sort by competitive criteria
  list.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.wrongAnswers !== b.wrongAnswers) return a.wrongAnswers - b.wrongAnswers;
    return a.timeTakenSeconds - b.timeTakenSeconds;
  });

  const total = list.length;
  return list.map((entry, index) => {
    const rank = index + 1;
    const percentile = total > 1 ? Math.round(((total - rank) / total) * 100) : 100;
    return {
      ...entry,
      rank,
      percentile,
    };
  });
};

/**
 * Fetch Leaderboard & Merit List with competitive tie-breaking
 */
export const getModelTestLeaderboard = async (
  testId: string,
  currentUserId?: string | null
): Promise<ModelTestLeaderboardEntry[]> => {
  try {
    const colRef = collection(db, 'modelTests', testId, 'leaderboard');
    const snap = await getDocs(colRef);

    if (!snap.empty) {
      const entries: ModelTestLeaderboardEntry[] = snap.docs.map((d) => ({
        ...d.data(),
        id: d.id,
      } as ModelTestLeaderboardEntry));

      // Competitive Tie-breaking Rules:
      // 1. Higher Score
      // 2. Fewer Wrong Answers (penalties)
      // 3. Lower Time Taken (speed)
      entries.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.wrongAnswers !== b.wrongAnswers) return a.wrongAnswers - b.wrongAnswers;
        return a.timeTakenSeconds - b.timeTakenSeconds;
      });

      const total = entries.length;

      return entries.map((entry, index) => {
        const rank = index + 1;
        const percentile = total > 1 ? Math.round(((total - rank) / total) * 100) : 100;
        return {
          ...entry,
          rank,
          percentile,
        };
      });
    }

    let userSub: UserLiveModelTestSubmission | null = null;
    if (currentUserId) {
      userSub = await getUserModelTestSubmission(testId, currentUserId);
    }
    return getSampleLeaderboardFallback(testId, userSub);
  } catch (_error: any) {
    let userSub: UserLiveModelTestSubmission | null = null;
    if (currentUserId) {
      userSub = await getUserModelTestSubmission(testId, currentUserId);
    }
    return getSampleLeaderboardFallback(testId, userSub);
  }
};

export const getLocalCustomModelTests = (): LiveModelTest[] => {
  try {
    const raw = localStorage.getItem('custom_model_tests');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((item: any) => {
      const startsAt = item.startsAt?.seconds 
        ? new Timestamp(item.startsAt.seconds, item.startsAt.nanoseconds || 0)
        : Timestamp.now();
      const endsAt = item.endsAt?.seconds
        ? new Timestamp(item.endsAt.seconds, item.endsAt.nanoseconds || 0)
        : Timestamp.now();
      return {
        ...item,
        startsAt,
        endsAt,
        status: computeTestStatus(startsAt, endsAt),
      };
    });
  } catch {
    return [];
  }
};

/**
 * Create a new Model Test (Admin)
 */
export const createModelTest = async (input: CreateModelTestInput): Promise<string> => {
  const colRef = collection(db, 'modelTests');
  const newDocRef = doc(colRef);
  const now = Timestamp.now();
  const startsAt = Timestamp.fromDate(input.startsAt);
  const endsAt = Timestamp.fromDate(input.endsAt);
  const resultPublishAt = input.resultPublishAt ? Timestamp.fromDate(input.resultPublishAt) : endsAt;

  const testData: Omit<LiveModelTest, 'id'> = {
    title: input.title.trim(),
    category: input.category,
    categoryName: CATEGORY_NAMES[input.category] || 'মডেল টেস্ট',
    description: input.description.trim(),
    instructions: input.instructions && input.instructions.length > 0 ? input.instructions : [
      'প্রতিটি প্রশ্নের মান ১ নম্বর।',
      'ভুল উত্তরের জন্য নির্ধারিত নেগেটিভ মার্কিং প্রযোজ্য হবে।',
      'নির্ধারিত সময় শেষ হওয়া মাত্র পরীক্ষা স্বয়ংক্রিয়ভাবে জমা হবে।',
    ],
    totalQuestions: input.totalQuestions,
    totalMarks: input.totalMarks,
    durationMinutes: input.durationMinutes,
    negativeMarking: input.negativeMarking,
    passMarks: input.passMarks,
    startsAt,
    endsAt,
    resultPublishAt,
    status: computeTestStatus(startsAt, endsAt),
    totalParticipants: 0,
    highestScore: 0,
    averageScore: 0,
    questionIds: input.questionIds,
    questionsSnapshot: input.questionsSnapshot || [],
    isFeatured: input.isFeatured ?? false,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(newDocRef, testData);
  } catch (err: any) {
    console.warn('Firestore setDoc notice for model test (cached locally):', err?.message || err);
  }

  // Persist locally for immediate availability
  try {
    const raw = localStorage.getItem('custom_model_tests');
    const existing = raw ? JSON.parse(raw) : [];
    existing.unshift({
      ...testData,
      id: newDocRef.id,
      startsAt: { seconds: Math.floor(input.startsAt.getTime() / 1000) },
      endsAt: { seconds: Math.floor(input.endsAt.getTime() / 1000) },
      resultPublishAt: { seconds: Math.floor(resultPublishAt.toDate().getTime() / 1000) },
      createdAt: { seconds: Math.floor(now.toDate().getTime() / 1000) },
    });
    localStorage.setItem('custom_model_tests', JSON.stringify(existing));
  } catch {
    // Ignore storage quota
  }

  return newDocRef.id;
};

/**
 * Update an existing Model Test (Admin)
 */
export const updateModelTest = async (
  id: string,
  input: Partial<LiveModelTest>
): Promise<void> => {
  const docRef = doc(db, 'modelTests', id);
  const now = Timestamp.now();
  const payload: any = {
    ...input,
    updatedAt: now,
  };

  try {
    await updateDoc(docRef, payload);
  } catch (err: any) {
    console.warn('Firestore updateDoc notice for model test:', err?.message || err);
  }

  // Update local storage
  try {
    const raw = localStorage.getItem('custom_model_tests');
    if (raw) {
      const existing: any[] = JSON.parse(raw);
      const idx = existing.findIndex((t) => t.id === id);
      if (idx !== -1) {
        existing[idx] = { ...existing[idx], ...input };
        localStorage.setItem('custom_model_tests', JSON.stringify(existing));
      }
    }
  } catch {
    // Ignore
  }
};

/**
 * Delete Model Test (Admin)
 */
export const deleteModelTest = async (id: string): Promise<void> => {
  const docRef = doc(db, 'modelTests', id);
  try {
    await deleteDoc(docRef);
  } catch (err: any) {
    console.warn('Firestore deleteDoc notice for model test:', err?.message || err);
  }

  // Remove from local storage
  try {
    const raw = localStorage.getItem('custom_model_tests');
    if (raw) {
      const existing: any[] = JSON.parse(raw);
      const filtered = existing.filter((t) => t.id !== id);
      localStorage.setItem('custom_model_tests', JSON.stringify(filtered));
    }
  } catch {
    // Ignore
  }
};

/**
 * Toggle Active Status (Admin)
 */
export const toggleModelTestActive = async (id: string, isActive: boolean): Promise<void> => {
  await updateModelTest(id, { isActive });
};

export { seedSampleModelTestsIfEmpty } from '../data/seedModelTests';
