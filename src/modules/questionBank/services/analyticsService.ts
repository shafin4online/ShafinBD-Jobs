import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  setDoc,
  writeBatch,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import {
  UserAnalyticsOverview,
  UserSubjectAnalytics,
  UserTopicAnalytics,
  UserDailyAnalytics,
  SmartInsightRecommendation,
  QuizAttempt,
} from '../../../types/questionBank';

/**
 * Fetch Overall User Analytics Overview (O(1) read)
 */
export const getUserAnalyticsOverview = async (
  userId: string
): Promise<UserAnalyticsOverview | null> => {
  try {
    const overviewRef = doc(db, 'users', userId, 'analytics', 'overview');
    const snap = await getDoc(overviewRef);

    if (!snap.exists()) {
      return null;
    }

    const data = snap.data();
    const totalAttempted = data.totalQuestionsAttempted || 0;
    const totalCorrect = data.totalCorrect || 0;
    const totalQuizzes = data.totalQuizzes || 0;
    const totalScore = data.totalScore || 0;

    return {
      userId,
      totalQuizzes,
      totalQuestionsAttempted: totalAttempted,
      totalCorrect,
      totalWrong: data.totalWrong || 0,
      totalSkipped: data.totalSkipped || 0,
      totalScore,
      totalDurationSeconds: data.totalDurationSeconds || 0,
      overallAccuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
      averageScore: totalQuizzes > 0 ? parseFloat((totalScore / totalQuizzes).toFixed(2)) : 0,
      lastQuizAt: data.lastQuizAt,
      lastScore: data.lastScore,
      lastPercentage: data.lastPercentage,
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    return null;
  }
};

/**
 * Fetch Subject Level Analytics (O(1) batch read per subject)
 */
export const getUserSubjectAnalytics = async (
  userId: string
): Promise<UserSubjectAnalytics[]> => {
  try {
    const subCol = collection(db, 'users', userId, 'analytics_subjects');
    const snap = await getDocs(subCol);

    return snap.docs.map((d) => {
      const data = d.data();
      const totalAttempted = data.totalAttempted || 0;
      const totalCorrect = data.totalCorrect || 0;

      return {
        subjectId: d.id,
        subjectName: data.subjectName || '',
        quizzesCount: data.quizzesCount || 0,
        totalAttempted,
        totalCorrect,
        totalWrong: data.totalWrong || 0,
        accuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
        lastAttemptAt: data.lastAttemptAt,
        updatedAt: data.updatedAt,
      };
    });
  } catch (error) {
    console.error('Error fetching subject analytics:', error);
    return [];
  }
};

/**
 * Fetch Topic Level Analytics with Strong/Moderate/Weak classification
 */
export const getUserTopicAnalytics = async (
  userId: string
): Promise<UserTopicAnalytics[]> => {
  try {
    const topicCol = collection(db, 'users', userId, 'analytics_topics');
    const snap = await getDocs(topicCol);

    return snap.docs.map((d) => {
      const data = d.data();
      const totalAttempted = data.totalAttempted || 0;
      const totalCorrect = data.totalCorrect || 0;
      const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

      let classification: 'strong' | 'moderate' | 'weak' = 'moderate';
      if (accuracy >= 75) {
        classification = 'strong';
      } else if (accuracy < 50) {
        classification = 'weak';
      }

      return {
        topicId: d.id,
        topicName: data.topicName || '',
        subjectId: data.subjectId || '',
        subjectName: data.subjectName || '',
        totalAttempted,
        totalCorrect,
        totalWrong: data.totalWrong || 0,
        accuracy,
        classification,
        lastAttemptAt: data.lastAttemptAt,
        updatedAt: data.updatedAt,
      };
    });
  } catch (error) {
    console.error('Error fetching topic analytics:', error);
    return [];
  }
};

/**
 * Fetch Daily Trend History for Charts (Last N Days)
 */
export const getUserDailyTrend = async (
  userId: string,
  daysLimit = 14
): Promise<UserDailyAnalytics[]> => {
  try {
    const dailyCol = collection(db, 'users', userId, 'analytics_daily');
    const q = query(dailyCol, orderBy('date', 'desc'), limit(daysLimit));
    const snap = await getDocs(q);

    const items = snap.docs.map((d) => {
      const data = d.data();
      const attempted = data.questionsAttempted || 0;
      const correct = data.correctCount || 0;

      return {
        date: d.id,
        quizzesCount: data.quizzesCount || 0,
        questionsAttempted: attempted,
        correctCount: correct,
        wrongCount: data.wrongCount || 0,
        totalScore: data.totalScore || 0,
        timeSpentSeconds: data.timeSpentSeconds || 0,
        accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
        updatedAt: data.updatedAt,
      };
    });

    // Return in chronological order (oldest to newest) for chart display
    return items.reverse();
  } catch (error) {
    console.error('Error fetching daily trend:', error);
    return [];
  }
};

/**
 * Generate Actionable Smart Insights & Recommendations
 */
export const generateSmartInsights = (
  overview: UserAnalyticsOverview | null,
  subjects: UserSubjectAnalytics[],
  topics: UserTopicAnalytics[]
): SmartInsightRecommendation[] => {
  const recommendations: SmartInsightRecommendation[] = [];

  // 1. Weak Topic Actionable Recommendations (Priority High)
  const weakTopics = topics
    .filter((t) => t.classification === 'weak' && t.totalAttempted >= 3)
    .sort((a, b) => a.accuracy - b.accuracy);

  weakTopics.slice(0, 3).forEach((wt) => {
    recommendations.push({
      id: `weak-${wt.topicId}`,
      type: 'weak-topic',
      title: `${wt.topicName}-এ বাড়তি নজর দিন`,
      description: `এই টপিকে আপনার সঠিকতা মাত্র ${wt.accuracy}% (${wt.totalAttempted}টির মধ্যে ${wt.totalCorrect}টি সঠিক)। এখনই অনুশীলন করে দুর্বলতা দূর করুন।`,
      actionText: `${wt.topicName} অনুশীলন করুন`,
      subjectId: wt.subjectId,
      subjectName: wt.subjectName,
      topicId: wt.topicId,
      topicName: wt.topicName,
      accuracy: wt.accuracy,
      attemptCount: wt.totalAttempted,
      priority: 'high',
    });
  });

  // 2. Strong Topic Reinforcement
  const strongTopics = topics
    .filter((t) => t.classification === 'strong' && t.totalAttempted >= 5)
    .sort((a, b) => b.accuracy - a.accuracy);

  if (strongTopics.length > 0) {
    const best = strongTopics[0];
    recommendations.push({
      id: `strong-${best.topicId}`,
      type: 'strong-topic',
      title: `${best.topicName}-এ আপনার দখল দুর্দান্ত!`,
      description: `দারুণ প্রস্তুতি! এই টপিকে আপনার সাফল্যের হার ${best.accuracy}%। নিয়মিত রিভিশন দিয়ে এই পারফরম্যান্স বজায় রাখুন।`,
      actionText: 'মক টেস্ট দিন',
      subjectId: best.subjectId,
      subjectName: best.subjectName,
      topicId: best.topicId,
      topicName: best.topicName,
      accuracy: best.accuracy,
      attemptCount: best.totalAttempted,
      priority: 'low',
    });
  }

  // 3. Overall Revision Recommendation
  if (overview && overview.totalWrong > 5) {
    recommendations.push({
      id: 'revision-all-wrong',
      type: 'daily-revision',
      title: 'ভুল প্রশ্নগুলোর স্মার্ট রিভিশন',
      description: `সর্বমোট ${overview.totalWrong}টি প্রশ্নে আপনি ভুল করেছিলেন। ভুল থেকে শিক্ষা নিতে বুকমার্ক ও অনুশীলন করুন।`,
      actionText: 'রিভিশন শুরু করুন',
      priority: 'medium',
    });
  }

  // 4. Default recommendation if new user
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'default-start',
      type: 'daily-revision',
      title: 'প্রতিদিনের মক টেস্ট শুরু করুন',
      description: 'নিয়মিত অন্তত ১টি কুইজ দিলে আপনার শক্তি ও দুর্বল টপিকগুলো এখানে নির্ভুলভাবে চিহ্নিত হবে।',
      actionText: 'নতুন কুইজ দিন',
      priority: 'high',
    });
  }

  return recommendations;
};

/**
 * Rebuild / Reconciliation Function:
 * Rebuilds all analytics documents (overview, subjects, topics, daily)
 * directly from raw immutable quizAttempts history!
 */
export const rebuildUserAnalytics = async (userId: string): Promise<void> => {
  try {
    const attemptsCol = collection(db, 'users', userId, 'quizAttempts');
    const q = query(attemptsCol, where('status', 'in', ['completed', 'timed-out']));
    const snap = await getDocs(q);

    let totalQuizzes = 0;
    let totalQuestionsAttempted = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalSkipped = 0;
    let totalScore = 0;
    let totalDurationSeconds = 0;
    let lastQuizAt: Timestamp | undefined;
    let lastScore: number | undefined;
    let lastPercentage: number | undefined;

    const subjectMap: Record<string, { subjectId: string; subjectName: string; quizzesCount: number; attempted: number; correct: number; wrong: number; lastAttemptAt?: Timestamp }> = {};
    const topicMap: Record<string, { topicId: string; topicName: string; subjectId: string; subjectName: string; attempted: number; correct: number; wrong: number; lastAttemptAt?: Timestamp }> = {};
    const dailyMap: Record<string, { date: string; quizzesCount: number; questionsAttempted: number; correctCount: number; wrongCount: number; totalScore: number; timeSpentSeconds: number }> = {};

    for (const d of snap.docs) {
      const attempt = d.data() as QuizAttempt;
      totalQuizzes += 1;
      totalQuestionsAttempted += attempt.answeredCount || 0;
      totalCorrect += attempt.correctAnswers || 0;
      totalWrong += attempt.wrongAnswers || 0;
      totalSkipped += attempt.skippedAnswers || 0;
      totalScore += attempt.score || 0;
      totalDurationSeconds += attempt.timeTakenSeconds || 0;

      if (!lastQuizAt || (attempt.completedAt && attempt.completedAt.toMillis() > lastQuizAt.toMillis())) {
        lastQuizAt = attempt.completedAt;
        lastScore = attempt.score;
        lastPercentage = attempt.percentage;
      }

      // Daily mapping
      const dateStr = attempt.completedAt?.toDate
        ? attempt.completedAt.toDate().toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = {
          date: dateStr,
          quizzesCount: 0,
          questionsAttempted: 0,
          correctCount: 0,
          wrongCount: 0,
          totalScore: 0,
          timeSpentSeconds: 0,
        };
      }
      dailyMap[dateStr].quizzesCount += 1;
      dailyMap[dateStr].questionsAttempted += attempt.answeredCount || 0;
      dailyMap[dateStr].correctCount += attempt.correctAnswers || 0;
      dailyMap[dateStr].wrongCount += attempt.wrongAnswers || 0;
      dailyMap[dateStr].totalScore += attempt.score || 0;
      dailyMap[dateStr].timeSpentSeconds += attempt.timeTakenSeconds || 0;

      // Subject primary count
      if (attempt.subjectId) {
        if (!subjectMap[attempt.subjectId]) {
          subjectMap[attempt.subjectId] = {
            subjectId: attempt.subjectId,
            subjectName: attempt.subjectName || '',
            quizzesCount: 0,
            attempted: 0,
            correct: 0,
            wrong: 0,
          };
        }
        subjectMap[attempt.subjectId].quizzesCount += 1;
      }

      // Check answers breakdown
      if (attempt.answers) {
        for (const [qId, ans] of Object.entries(attempt.answers)) {
          if (ans.selectedAnswer) {
            // Find in question snapshots if available
            const qSnap = attempt.questionsSnapshot?.find((s) => s.id === qId);
            if (qSnap?.subjectId) {
              if (!subjectMap[qSnap.subjectId]) {
                subjectMap[qSnap.subjectId] = {
                  subjectId: qSnap.subjectId,
                  subjectName: qSnap.subjectName || '',
                  quizzesCount: 0,
                  attempted: 0,
                  correct: 0,
                  wrong: 0,
                };
              }
              subjectMap[qSnap.subjectId].attempted += 1;
              if (ans.isCorrect) subjectMap[qSnap.subjectId].correct += 1;
              else subjectMap[qSnap.subjectId].wrong += 1;
            }

            if (qSnap?.topicId) {
              if (!topicMap[qSnap.topicId]) {
                topicMap[qSnap.topicId] = {
                  topicId: qSnap.topicId,
                  topicName: qSnap.topicName || '',
                  subjectId: qSnap.subjectId || '',
                  subjectName: qSnap.subjectName || '',
                  attempted: 0,
                  correct: 0,
                  wrong: 0,
                };
              }
              topicMap[qSnap.topicId].attempted += 1;
              if (ans.isCorrect) topicMap[qSnap.topicId].correct += 1;
              else topicMap[qSnap.topicId].wrong += 1;
            }
          }
        }
      }
    }

    const batch = writeBatch(db);
    const now = Timestamp.now();

    // 1. Overview
    const overviewRef = doc(db, 'users', userId, 'analytics', 'overview');
    batch.set(overviewRef, {
      userId,
      totalQuizzes,
      totalQuestionsAttempted,
      totalCorrect,
      totalWrong,
      totalSkipped,
      totalScore,
      totalDurationSeconds,
      lastQuizAt: lastQuizAt || null,
      lastScore: lastScore || 0,
      lastPercentage: lastPercentage || 0,
      updatedAt: now,
    });

    // 2. Subjects
    for (const [sId, sData] of Object.entries(subjectMap)) {
      const sRef = doc(db, 'users', userId, 'analytics_subjects', sId);
      batch.set(sRef, {
        subjectId: sId,
        subjectName: sData.subjectName,
        quizzesCount: sData.quizzesCount,
        totalAttempted: sData.attempted,
        totalCorrect: sData.correct,
        totalWrong: sData.wrong,
        updatedAt: now,
      });
    }

    // 3. Topics
    for (const [tId, tData] of Object.entries(topicMap)) {
      const tRef = doc(db, 'users', userId, 'analytics_topics', tId);
      batch.set(tRef, {
        topicId: tId,
        topicName: tData.topicName,
        subjectId: tData.subjectId,
        subjectName: tData.subjectName,
        totalAttempted: tData.attempted,
        totalCorrect: tData.correct,
        totalWrong: tData.wrong,
        updatedAt: now,
      });
    }

    // 4. Daily
    for (const [dateStr, dData] of Object.entries(dailyMap)) {
      const dRef = doc(db, 'users', userId, 'analytics_daily', dateStr);
      batch.set(dRef, {
        ...dData,
        updatedAt: now,
      });
    }

    await batch.commit();
    console.log(`[ANALYTICS] Successfully rebuilt analytics for user ${userId} from ${totalQuizzes} attempts`);
  } catch (error) {
    console.error('Error rebuilding user analytics:', error);
    throw error;
  }
};
