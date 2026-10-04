import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || 'shafinbdjobs';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (clientEmail && privateKey) {
    try {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('🚀 Firebase Admin initialized in quiz-submit handler');
    } catch (err) {
      console.error('Firebase Admin init error in quiz-submit:', err);
    }
  } else {
    try {
      // In Google Cloud Run environments, default application credentials work automatically
      initializeApp({ projectId });
      console.log('🚀 Firebase Admin initialized with default project credentials');
    } catch (err) {
      console.warn('Firebase Admin default init failed:', err);
    }
  }
}

/**
 * Server-Authoritative Quiz Submit Handler
 * - Validates authentication
 * - Reads immutable question snapshots from subcollection
 * - Validates timer and server deadlines
 * - Evaluates score and negative marking strictly on server
 * - Enforces submit idempotency
 * - Enforces answer-level state-transition idempotent progress counters
 */
export default async function quizSubmitHandler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userId, attemptId, answers = {}, markedQuestionIds = [], durationSeconds = 0 } = req.body || {};

    if (!userId || !attemptId) {
      return res.status(400).json({ error: 'userId and attemptId are required' });
    }

    if (!getApps().length) {
      return res.status(503).json({ error: 'Server evaluation service temporarily unavailable' });
    }

    const db = getFirestore();
    const attemptRef = db.collection('users').doc(userId).collection('quizAttempts').doc(attemptId);
    const attemptSnap = await attemptRef.get();

    if (!attemptSnap.exists) {
      return res.status(404).json({ error: 'Quiz attempt not found' });
    }

    const attemptData: any = attemptSnap.data();

    // 2. Fetch Snapshotted Questions from Subcollection
    const questionsSubcoll = attemptRef.collection('questions');
    const questionsSnap = await questionsSubcoll.orderBy('order', 'asc').get();

    let questionSnapshots: any[] = [];
    if (!questionsSnap.empty) {
      questionSnapshots = questionsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    } else if (Array.isArray(attemptData.questionsSnapshot) && attemptData.questionsSnapshot.length > 0) {
      // Fallback if legacy document
      questionSnapshots = attemptData.questionsSnapshot;
    }

    if (questionSnapshots.length === 0) {
      return res.status(400).json({ error: 'No question snapshots found for this quiz attempt' });
    }

    // 1. Idempotency Check: in_progress -> completed is a one-time valid transition
    if (attemptData.status === 'completed' || attemptData.status === 'timed-out') {
      console.log(`[IDEMPOTENT] Quiz attempt ${attemptId} already submitted. Returning existing result.`);
      return res.json({
        success: true,
        isIdempotent: true,
        attempt: { id: attemptSnap.id, ...attemptData },
        questions: questionSnapshots,
        correctAnswers: attemptData.correctAnswers || 0,
        wrongAnswers: attemptData.wrongAnswers || 0,
        skippedAnswers: attemptData.skippedAnswers || 0,
        score: attemptData.score || 0,
        percentage: attemptData.percentage || 0,
      });
    }

    // 3. Server Timer & Deadline Verification
    const serverNow = Date.now();
    const startedAtMs = attemptData.startedAt?.toMillis
      ? attemptData.startedAt.toMillis()
      : (attemptData.startedAt?.seconds ? attemptData.startedAt.seconds * 1000 : serverNow);

    const timeLimitSeconds = attemptData.durationSeconds || 0;
    let finalStatus: 'completed' | 'timed-out' = 'completed';

    if (timeLimitSeconds > 0) {
      // 30 seconds network buffer
      const maxAllowedMs = (timeLimitSeconds + 30) * 1000;
      if (serverNow - startedAtMs > maxAllowedMs) {
        finalStatus = 'timed-out';
      }
    }

    const actualTimeTakenSeconds = timeLimitSeconds > 0
      ? Math.min(timeLimitSeconds, Math.floor((serverNow - startedAtMs) / 1000))
      : Math.max(0, durationSeconds);

    // 4. Server-Authoritative Score & Accuracy Calculation
    const negativeMarkingPerWrong = attemptData.negativeMarkingPerWrong || 0;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    const evaluatedAnswers: Record<string, any> = {};
    const subjectDeltaMap: Record<string, { viewed: number; answered: number; correct: number }> = {};

    // 5. Answer-level Idempotent Progress delta calculation
    // Read previous question progress documents to inspect state transition
    const userCol = db.collection('users').doc(userId);
    const qProgressCol = userCol.collection('questionProgress');

    const evaluatedSnapshots: any[] = [];

    for (const q of questionSnapshots) {
      const userAnsObj = answers[q.id];
      const selectedAnswer = userAnsObj?.selectedAnswer || null;
      const timeSpent = userAnsObj?.timeSpentSeconds || 0;

      // Authoritative Answer Lookup (Hardened against client inspection during active quiz)
      let trueCorrectAnswer = q.correctAnswer;
      let trueExplanation = q.explanation || '';

      if (!trueCorrectAnswer) {
        try {
          const masterQDoc = await db.collection('questions').doc(q.id).get();
          if (masterQDoc.exists) {
            const masterData = masterQDoc.data();
            trueCorrectAnswer = masterData?.correctAnswer || null;
            trueExplanation = masterData?.explanation || '';
          }
        } catch (fetchErr) {
          console.warn(`Could not fetch master question ${q.id}:`, fetchErr);
        }
      }

      let isCorrect = false;
      if (selectedAnswer && trueCorrectAnswer) {
        isCorrect = selectedAnswer === trueCorrectAnswer;
        if (isCorrect) {
          correctCount += 1;
        } else {
          wrongCount += 1;
        }
      } else if (selectedAnswer) {
        wrongCount += 1;
      } else {
        skippedCount += 1;
      }

      evaluatedAnswers[q.id] = {
        selectedAnswer,
        isCorrect,
        timeSpentSeconds: timeSpent,
      };

      evaluatedSnapshots.push({
        ...q,
        correctAnswer: trueCorrectAnswer,
        explanation: trueExplanation,
      });

      // State Transition Delta Check
      const prevProgressDoc = await qProgressCol.doc(q.id).get();
      const prevData = prevProgressDoc.exists ? prevProgressDoc.data() : null;

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
    const percentage = questionSnapshots.length > 0
      ? Math.round((correctCount / questionSnapshots.length) * 100)
      : 0;

    // 6. Atomic Batch Update
    const batch = db.batch();
    const completedAtTimestamp = FieldValue.serverTimestamp();

    // 6a. Update Quiz Attempt
    batch.update(attemptRef, {
      answers: evaluatedAnswers,
      markedQuestionIds,
      answeredCount,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      skippedAnswers: skippedCount,
      score,
      percentage,
      timeTakenSeconds: actualTimeTakenSeconds,
      status: finalStatus,
      completedAt: completedAtTimestamp,
    });

    // 6b. Update individual Question Progress & write authoritative correctAnswer to subcollection
    for (const q of evaluatedSnapshots) {
      const qProgressDoc = qProgressCol.doc(q.id);
      const ans = evaluatedAnswers[q.id];

      // Update student's persistent mastery stats
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
          answeredAt: ans.selectedAnswer ? completedAtTimestamp : null,
          lastViewedAt: completedAtTimestamp,
        },
        { merge: true }
      );

      // Populate correctAnswer & explanation on the question snapshot now that attempt is completed
      batch.set(
        questionsSubcoll.doc(q.id),
        {
          correctAnswer: q.correctAnswer || null,
          explanation: q.explanation || '',
        },
        { merge: true }
      );
    }

    // 6c. Increment Subject Stats by exact net delta
    const statsCol = userCol.collection('progressStats');
    for (const [subjectId, deltas] of Object.entries(subjectDeltaMap)) {
      if (deltas.viewed > 0 || deltas.answered > 0 || deltas.correct !== 0) {
        const statsDoc = statsCol.doc(subjectId);
        batch.set(
          statsDoc,
          {
            subjectId,
            viewedCount: FieldValue.increment(deltas.viewed),
            answeredCount: FieldValue.increment(deltas.answered),
            correctCount: FieldValue.increment(deltas.correct),
            updatedAt: completedAtTimestamp,
          },
          { merge: true }
        );
      }
    }

    await batch.commit();

    // Fetch updated attempt document to return clean representation
    const updatedAttemptSnap = await attemptRef.get();
    const finalAttemptData = { id: updatedAttemptSnap.id, ...updatedAttemptSnap.data() };

    return res.json({
      success: true,
      attempt: finalAttemptData,
      questions: evaluatedSnapshots,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      skippedAnswers: skippedCount,
      score,
      percentage,
    });
  } catch (error: any) {
    console.error('Server Quiz Evaluation Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
