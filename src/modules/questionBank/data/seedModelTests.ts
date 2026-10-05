import {
  collection,
  doc,
  getDocs,
  query,
  limit,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { CreateModelTestInput, LiveModelTest } from '../../../types/modelTest';
import { QuizQuestionSnapshot } from '../../../types/questionBank';
import { SEED_QUESTIONS } from './seedData';
import { computeTestStatus } from '../services/modelTestService';

export const getSampleQuestionSnapshots = (): QuizQuestionSnapshot[] => {
  return SEED_QUESTIONS.slice(0, 20).map((q, idx) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation || '',
    subjectId: q.subjectId,
    subjectName:
      q.subjectId === 'subject-bangla'
        ? 'বাংলা ভাষা ও সাহিত্য'
        : q.subjectId === 'subject-bangladesh'
        ? 'বাংলাদেশ বিষয়াবলী'
        : q.subjectId === 'subject-english'
        ? 'English Language'
        : 'বিজ্ঞান ও গণিত',
    topicId: q.topicId,
    topicName: '',
    subtopicId: q.subtopicId || null,
    difficulty: q.difficulty || 'medium',
    order: idx + 1,
  }));
};

/**
 * Returns instant in-memory fallback model tests when Firestore is empty or restricted
 */
export const getSampleModelTestsFallback = (): LiveModelTest[] => {
  const qSnapshots = getSampleQuestionSnapshots();
  const now = new Date();

  // 1. Currently LIVE test (Started 30 mins ago, ends in 90 mins)
  const liveStarts = new Date(now.getTime() - 30 * 60 * 1000);
  const liveEnds = new Date(now.getTime() + 90 * 60 * 1000);

  // 2. UPCOMING test (Starts tomorrow evening)
  const upcomingStarts = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const upcomingEnds = new Date(now.getTime() + 26 * 60 * 60 * 1000);

  // 3. COMPLETED test (Ended yesterday)
  const completedStarts = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const completedEnds = new Date(now.getTime() - 46 * 60 * 60 * 1000);

  return [
    {
      id: 'sample-model-test-bcs-1',
      title: '৪৬তম বিসিএস প্রিলিমিনারি পূর্ণাঙ্গ লাইভ মডেল টেস্ট - ০১',
      category: 'bcs',
      categoryName: 'বিসিএস প্রিলিমিনারি',
      description: 'বাংলা, ইংরেজি, গণিত, বিজ্ঞান ও সাধারণ জ্ঞান সমন্বিত পূর্ণাঙ্গ বিসিএস স্ট্যান্ডার্ড লাইভ পরীক্ষা।',
      instructions: [
        'পরীক্ষার পূর্ণমান ২০ নম্বর (নমুনা পরীক্ষা)।',
        'প্রতিটি ভুল উত্তরের জন্য ০.৫০ নম্বর কাটা যাবে।',
        'নির্ধারিত লাইভ সময় শেষ হলে উত্তর স্বয়ংক্রিয়ভাবে জমা হয়ে যাবে।',
        'পরীক্ষা শেষে তাৎক্ষণিক জাতীয় মেধা তালিকা (Merit List) ও পারসেন্টাইল দেখতে পাবেন।',
      ],
      totalQuestions: qSnapshots.length || 20,
      totalMarks: qSnapshots.length || 20,
      durationMinutes: 20,
      negativeMarking: 0.5,
      passMarks: 10,
      startsAt: Timestamp.fromDate(liveStarts),
      endsAt: Timestamp.fromDate(liveEnds),
      resultPublishAt: Timestamp.fromDate(liveEnds),
      status: computeTestStatus(Timestamp.fromDate(liveStarts), Timestamp.fromDate(liveEnds)),
      totalParticipants: 42,
      highestScore: 19.0,
      averageScore: 13.5,
      questionIds: qSnapshots.map((q) => q.id),
      questionsSnapshot: qSnapshots,
      isFeatured: true,
      isActive: true,
      createdAt: Timestamp.now(),
    },
    {
      id: 'sample-model-test-primary-1',
      title: 'প্রাথমিক শিক্ষক নিয়োগ স্পেশাল লাইভ মডেল টেস্ট',
      category: 'primary',
      categoryName: 'প্রাইমারি শিক্ষক নিয়োগ',
      description: 'ডিপিই শিক্ষক নিয়োগের সর্বশেষ মানবন্টন অনুযায়ী বিষয়ভিত্তিক সমন্বিত লাইভ পরীক্ষা।',
      instructions: [
        'সময় ২০ মিনিট, ভুল উত্তরের জন্য ০.২৫ নম্বর কাটা যাবে।',
        'লাইভ টাইমার শেষ হলে স্বয়ংক্রিয়ভাবে ফলাফল প্রকাশিত হবে।',
      ],
      totalQuestions: qSnapshots.length || 20,
      totalMarks: qSnapshots.length || 20,
      durationMinutes: 20,
      negativeMarking: 0.25,
      passMarks: 11,
      startsAt: Timestamp.fromDate(upcomingStarts),
      endsAt: Timestamp.fromDate(upcomingEnds),
      resultPublishAt: Timestamp.fromDate(upcomingEnds),
      status: computeTestStatus(Timestamp.fromDate(upcomingStarts), Timestamp.fromDate(upcomingEnds)),
      totalParticipants: 18,
      highestScore: 0,
      averageScore: 0,
      questionIds: qSnapshots.map((q) => q.id),
      questionsSnapshot: qSnapshots,
      isFeatured: true,
      isActive: true,
      createdAt: Timestamp.now(),
    },
    {
      id: 'sample-model-test-special-1',
      title: '১০ম গ্রেড মন্ত্রণালয় ও অধিদপ্তর সাধারণ জ্ঞান স্পেশাল টেস্ট',
      category: 'special',
      categoryName: 'বিশেষ ও মন্ত্রণালয় পরীক্ষা',
      description: 'সাম্প্রতিক বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলি সংক্রান্ত প্রশ্নাবলি।',
      instructions: ['সকল প্রশ্নের উত্তর দেওয়া বাধ্যতামূলক নয়।'],
      totalQuestions: qSnapshots.length || 20,
      totalMarks: qSnapshots.length || 20,
      durationMinutes: 15,
      negativeMarking: 0.5,
      passMarks: 9,
      startsAt: Timestamp.fromDate(completedStarts),
      endsAt: Timestamp.fromDate(completedEnds),
      resultPublishAt: Timestamp.fromDate(completedEnds),
      status: computeTestStatus(Timestamp.fromDate(completedStarts), Timestamp.fromDate(completedEnds)),
      totalParticipants: 56,
      highestScore: 18.5,
      averageScore: 12.2,
      questionIds: qSnapshots.map((q) => q.id),
      questionsSnapshot: qSnapshots,
      isFeatured: false,
      isActive: true,
      createdAt: Timestamp.now(),
    },
  ];
};

export const seedSampleModelTestsIfEmpty = async (): Promise<void> => {
  try {
    const colRef = collection(db, 'modelTests');
    const snap = await getDocs(query(colRef, limit(1)));
    if (!snap.empty) return;

    const sampleTests = getSampleModelTestsFallback();
    const batch = writeBatch(db);
    for (const st of sampleTests) {
      const docRef = doc(collection(db, 'modelTests'), st.id);
      batch.set(docRef, st);
    }

    await batch.commit();
    console.log('Successfully seeded sample Live Model Tests');
  } catch (error: any) {
    console.warn('Model test seed notice (using in-memory fallback):', error?.message || error);
  }
};
