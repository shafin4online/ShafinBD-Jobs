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
  CreateTopicInput,
  UpdateTopicInput,
} from '../../../types/questionBank';
import { generateSlug } from './subjectService';

const topicsRef = collection(db, 'topics');

/**
 * Fetch topics belonging to a subject
 */
export const getTopicsBySubject = async (
  subjectId: string,
  onlyActive = true
): Promise<QuestionBankTopic[]> => {
  try {
    let q = query(
      topicsRef,
      where('subjectId', '==', subjectId),
      orderBy('sortOrder', 'asc')
    );
    if (onlyActive) {
      q = query(
        topicsRef,
        where('subjectId', '==', subjectId),
        where('isActive', '==', true),
        orderBy('sortOrder', 'asc')
      );
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as QuestionBankTopic[];
  } catch (error) {
    console.error(`Error fetching topics for subject ${subjectId}:`, error);
    return [];
  }
};

export const getTopics = getTopicsBySubject;

/**
 * Get a single topic by ID
 */
export const getTopic = async (topicId: string): Promise<QuestionBankTopic | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'topics', topicId));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as QuestionBankTopic;
  } catch (error) {
    console.error(`Error fetching topic ${topicId}:`, error);
    return null;
  }
};

/**
 * Create a new Topic with parent validation & atomically increment Subject.topicCount
 */
export const createTopic = async (input: CreateTopicInput): Promise<string> => {
  return await runTransaction(db, async (transaction) => {
    const subjectRef = doc(db, 'subjects', input.subjectId);
    const subjectSnap = await transaction.get(subjectRef);

    if (!subjectSnap.exists()) {
      throw new Error(`Subject with ID "${input.subjectId}" does not exist.`);
    }

    const newTopicRef = doc(topicsRef);
    const now = Timestamp.now();
    const slug = generateSlug(input.name);

    const topicData: Omit<QuestionBankTopic, 'id'> = {
      subjectId: input.subjectId,
      name: input.name.trim(),
      slug,
      description: input.description?.trim() || '',
      questionCount: 0,
      subtopicCount: 0,
      sortOrder: input.sortOrder ?? 0,
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };

    transaction.set(newTopicRef, topicData);
    transaction.update(subjectRef, {
      topicCount: increment(1),
      updatedAt: now,
    });

    return newTopicRef.id;
  });
};

/**
 * Update Topic (excluding counter caches)
 */
export const updateTopic = async (
  topicId: string,
  input: UpdateTopicInput
): Promise<void> => {
  const topicDoc = doc(db, 'topics', topicId);
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

  await updateDoc(topicDoc, updatePayload);
};

/**
 * Delete Topic (soft delete or hard delete with atomic counter decrement)
 */
export const deleteTopic = async (
  topicId: string,
  subjectId: string,
  softDelete = true
): Promise<void> => {
  const topicDoc = doc(db, 'topics', topicId);
  if (softDelete) {
    await updateDoc(topicDoc, { isActive: false, updatedAt: Timestamp.now() });
  } else {
    const batch = writeBatch(db);
    batch.delete(topicDoc);
    batch.update(doc(db, 'subjects', subjectId), {
      topicCount: increment(-1),
      updatedAt: Timestamp.now(),
    });
    await batch.commit();
  }
};
