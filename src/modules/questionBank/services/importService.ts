import {
  collection,
  doc,
  setDoc,
  updateDoc,
  writeBatch,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import {
  QuestionBankQuestion,
  QuestionImportLog,
  QuestionImportError,
  CreateQuestionInput,
} from '../../../types/questionBank';

const questionsRef = collection(db, 'questions');

export interface BatchImportParams {
  adminId: string;
  adminEmail?: string;
  fileName: string;
  subjectId: string;
  topicId: string;
  subtopicId: string | null;
  questions: CreateQuestionInput[];
}

export interface BatchImportResult {
  importId: string;
  totalImported: number;
  status: 'completed' | 'partial_failure';
  errorMessage?: string;
}

/**
 * Batch import questions in chunks of 400 with atomic counter updates & partial-failure resilience
 */
export const batchImportQuestions = async (
  params: BatchImportParams
): Promise<BatchImportResult> => {
  const { adminId, adminEmail, fileName, subjectId, topicId, subtopicId, questions } = params;
  const now = Timestamp.now();

  // Create import log record
  const importLogRef = doc(collection(db, 'questionImports'));
  const importLog: Omit<QuestionImportLog, 'id'> = {
    adminId,
    adminEmail,
    fileName,
    subjectId,
    topicId,
    subtopicId,
    totalRows: questions.length,
    validRows: questions.length,
    invalidRows: 0,
    importedRows: 0,
    status: 'processing',
    startedAt: now,
    createdAt: now,
  };
  await setDoc(importLogRef, importLog);

  const CHUNK_SIZE = 400;
  let totalImported = 0;
  let failureError: string | undefined;

  for (let i = 0; i < questions.length; i += CHUNK_SIZE) {
    const chunk = questions.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(db);

    chunk.forEach((item) => {
      const qRef = doc(questionsRef);
      const qData: Omit<QuestionBankQuestion, 'id'> = {
        subjectId,
        topicId,
        subtopicId: subtopicId ?? null,
        question: item.question.trim(),
        options: {
          A: item.options.A.trim(),
          B: item.options.B.trim(),
          C: item.options.C.trim(),
          D: item.options.D.trim(),
        },
        correctAnswer: item.correctAnswer,
        explanation: item.explanation?.trim() || '',
        difficulty: item.difficulty || 'medium',
        source: item.source?.trim() || '',
        examName: item.examName?.trim() || '',
        examYear: item.examYear,
        tags: item.tags || [],
        randomKey: Math.random(),
        isActive: item.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      };
      batch.set(qRef, qData);
    });

    try {
      await batch.commit();
      totalImported += chunk.length;
    } catch (err: any) {
      console.error('Batch chunk commit failed:', err);
      failureError = err?.message || 'Error committing batch chunk';
      break; // Stop further chunks to preserve state consistency
    }
  }

  // Atomically increment counter caches by the exact count that successfully committed!
  if (totalImported > 0) {
    const counterBatch = writeBatch(db);
    counterBatch.update(doc(db, 'subjects', subjectId), {
      questionCount: increment(totalImported),
      updatedAt: now,
    });
    counterBatch.update(doc(db, 'topics', topicId), {
      questionCount: increment(totalImported),
      updatedAt: now,
    });
    if (subtopicId) {
      counterBatch.update(doc(db, 'subtopics', subtopicId), {
        questionCount: increment(totalImported),
        updatedAt: now,
      });
    }

    // Update import log with actual imported count
    counterBatch.update(importLogRef, {
      importedRows: totalImported,
      status: failureError ? 'failed' : 'completed',
      completedAt: Timestamp.now(),
    });

    await counterBatch.commit();
  } else {
    await updateDoc(importLogRef, {
      status: 'failed',
      completedAt: Timestamp.now(),
    });
  }

  return {
    importId: importLogRef.id,
    totalImported,
    status: failureError ? 'partial_failure' : 'completed',
    errorMessage: failureError,
  };
};

/**
 * Log individual validation errors during import
 */
export const logImportErrors = async (
  importId: string,
  errors: Omit<QuestionImportError, 'id' | 'importId'>[]
): Promise<void> => {
  if (!errors.length) return;
  const errorsRef = collection(db, 'questionImports', importId, 'errors');
  const batch = writeBatch(db);

  errors.slice(0, 450).forEach((err) => {
    const errDoc = doc(errorsRef);
    batch.set(errDoc, {
      ...err,
      importId,
    });
  });

  await batch.commit();
};
