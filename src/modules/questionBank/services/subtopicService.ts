import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  writeBatch,
  runTransaction,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import {
  QuestionBankTopic,
  QuestionBankSubtopic,
  CreateSubtopicInput,
  UpdateSubtopicInput,
} from '../../../types/questionBank';
import { generateSlug } from './subjectService';

const subtopicsRef = collection(db, 'subtopics');

/**
 * Fetch subtopics belonging to a topic
 */
export const getSubtopicsByTopic = async (
  topicId: string,
  onlyActive = true
): Promise<QuestionBankSubtopic[]> => {
  try {
    let q = query(
      subtopicsRef,
      where('topicId', '==', topicId),
      orderBy('sortOrder', 'asc')
    );
    if (onlyActive) {
      q = query(
        subtopicsRef,
        where('topicId', '==', topicId),
        where('isActive', '==', true),
        orderBy('sortOrder', 'asc')
      );
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as QuestionBankSubtopic[];
  } catch (error) {
    console.error(`Error fetching subtopics for topic ${topicId}:`, error);
    return [];
  }
};

/**
 * Get a single subtopic by ID
 */
export const getSubtopic = async (subtopicId: string): Promise<QuestionBankSubtopic | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'subtopics', subtopicId));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as QuestionBankSubtopic;
  } catch (error) {
    console.error(`Error fetching subtopic ${subtopicId}:`, error);
    return null;
  }
};

/**
 * Create a new Subtopic with transaction-safe validation & atomic increment
 */
export const createSubtopic = async (input: CreateSubtopicInput): Promise<string> => {
  return await runTransaction(db, async (transaction) => {
    const topicRef = doc(db, 'topics', input.topicId);
    const topicSnap = await transaction.get(topicRef);

    if (!topicSnap.exists()) {
      throw new Error(`Parent topic with ID "${input.topicId}" does not exist.`);
    }

    const topicData = topicSnap.data() as QuestionBankTopic;
    if (topicData.subjectId !== input.subjectId) {
      throw new Error(
        `Hierarchy Error: Topic "${input.topicId}" does not belong to subject "${input.subjectId}".`
      );
    }

    const newSubtopicRef = doc(subtopicsRef);
    const now = Timestamp.now();
    const slug = generateSlug(input.name);

    const subtopicData: Omit<QuestionBankSubtopic, 'id'> = {
      subjectId: input.subjectId,
      topicId: input.topicId,
      name: input.name.trim(),
      slug,
      description: input.description?.trim() || '',
      questionCount: 0,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    transaction.set(newSubtopicRef, subtopicData);
    transaction.update(topicRef, {
      subtopicCount: increment(1),
      updatedAt: now,
    });

    return newSubtopicRef.id;
  });
};

/**
 * Update Subtopic
 */
export const updateSubtopic = async (
  subtopicId: string,
  input: UpdateSubtopicInput
): Promise<void> => {
  const subtopicDoc = doc(db, 'subtopics', subtopicId);
  const updatePayload: Record<string, unknown> = {
    updatedAt: Timestamp.now(),
  };

  if (input.name !== undefined) {
    updatePayload.name = input.name.trim();
    updatePayload.slug = generateSlug(input.name);
  }
  if (input.description !== undefined) updatePayload.description = input.description.trim();
  if (input.sortOrder !== undefined) updatePayload.sortOrder = input.sortOrder;
  if (input.isActive !== undefined) updatePayload.isActive = input.isActive;

  await updateDoc(subtopicDoc, updatePayload);
};

/**
 * Delete Subtopic
 */
export const deleteSubtopic = async (
  subtopicId: string,
  topicId: string,
  softDelete = true
): Promise<void> => {
  const subtopicDoc = doc(db, 'subtopics', subtopicId);
  if (softDelete) {
    await updateDoc(subtopicDoc, { isActive: false, updatedAt: Timestamp.now() });
  } else {
    const batch = writeBatch(db);
    batch.delete(subtopicDoc);
    batch.update(doc(db, 'topics', topicId), {
      subtopicCount: increment(-1),
      updatedAt: Timestamp.now(),
    });
    await batch.commit();
  }
};
