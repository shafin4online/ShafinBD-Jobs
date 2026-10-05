import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import {
  QuestionBankSubject,
  CreateSubjectInput,
  UpdateSubjectInput,
} from '../../../types/questionBank';
import { SEED_SUBJECTS } from '../data/seedData';

// Helper to generate URL-safe slugs
export const generateSlug = (text: string): string => {
  return (
    text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '') || `item-${Date.now()}`
  );
};

const subjectsRef = collection(db, 'subjects');

/**
 * Fetch all subjects (ordered by sortOrder ascending)
 */
export const getSubjects = async (onlyActive = true): Promise<QuestionBankSubject[]> => {
  try {
    let q = query(subjectsRef, orderBy('sortOrder', 'asc'));
    if (onlyActive) {
      q = query(subjectsRef, where('isActive', '==', true), orderBy('sortOrder', 'asc'));
    }
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as QuestionBankSubject[];
    }
    return SEED_SUBJECTS as QuestionBankSubject[];
  } catch (_error: any) {
    return SEED_SUBJECTS as QuestionBankSubject[];
  }
};

/**
 * Get a single subject by ID
 */
export const getSubject = async (subjectId: string): Promise<QuestionBankSubject | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'subjects', subjectId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as QuestionBankSubject;
    }
    const fallback = SEED_SUBJECTS.find((s) => s.id === subjectId);
    return (fallback as QuestionBankSubject) || null;
  } catch (_error: any) {
    const fallback = SEED_SUBJECTS.find((s) => s.id === subjectId);
    return (fallback as QuestionBankSubject) || null;
  }
};

/**
 * Create a new Subject
 */
export const createSubject = async (input: CreateSubjectInput): Promise<string> => {
  const newDocRef = doc(subjectsRef);
  const now = Timestamp.now();
  const slug = generateSlug(input.name);

  const subjectData: Omit<QuestionBankSubject, 'id'> = {
    name: input.name.trim(),
    slug,
    description: input.description?.trim() || '',
    icon: input.icon?.trim() || '',
    questionCount: 0,
    topicCount: 0,
    sortOrder: input.sortOrder ?? 0,
    isActive: input.isActive ?? true,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(newDocRef, subjectData);
  return newDocRef.id;
};

/**
 * Update Subject (excluding counter cache fields)
 */
export const updateSubject = async (
  subjectId: string,
  input: UpdateSubjectInput
): Promise<void> => {
  const subjectDoc = doc(db, 'subjects', subjectId);
  const updatePayload: Record<string, unknown> = {
    updatedAt: Timestamp.now(),
  };

  if (input.name !== undefined) {
    updatePayload.name = input.name.trim();
    updatePayload.slug = generateSlug(input.name);
  }
  if (input.description !== undefined) updatePayload.description = input.description.trim();
  if (input.icon !== undefined) updatePayload.icon = input.icon.trim();
  if (input.sortOrder !== undefined) updatePayload.sortOrder = input.sortOrder;
  if (input.isActive !== undefined) updatePayload.isActive = input.isActive;

  await updateDoc(subjectDoc, updatePayload);
};

/**
 * Delete Subject (supports soft delete or hard delete)
 */
export const deleteSubject = async (subjectId: string, softDelete = true): Promise<void> => {
  const subjectDoc = doc(db, 'subjects', subjectId);
  if (softDelete) {
    await updateDoc(subjectDoc, { isActive: false, updatedAt: Timestamp.now() });
  } else {
    await deleteDoc(subjectDoc);
  }
};
