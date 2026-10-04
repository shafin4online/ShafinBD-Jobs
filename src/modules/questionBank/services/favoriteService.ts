import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import {
  QuestionBankQuestion,
  QuestionFavorite,
} from '../../../types/questionBank';

/**
 * Add question to user's favorites
 */
export const addFavorite = async (
  userId: string,
  question: QuestionBankQuestion
): Promise<void> => {
  if (!userId || !question.id) return;
  const favDoc = doc(db, 'users', userId, 'favorites', question.id);
  const favData: QuestionFavorite = {
    questionId: question.id,
    subjectId: question.subjectId,
    topicId: question.topicId,
    subtopicId: question.subtopicId,
    createdAt: Timestamp.now(),
  };
  await setDoc(favDoc, favData);
};

/**
 * Remove question from user's favorites
 */
export const removeFavorite = async (userId: string, questionId: string): Promise<void> => {
  if (!userId || !questionId) return;
  const favDoc = doc(db, 'users', userId, 'favorites', questionId);
  await deleteDoc(favDoc);
};

/**
 * Check if a question is favorited
 */
export const isFavorite = async (userId: string, questionId: string): Promise<boolean> => {
  if (!userId || !questionId) return false;
  try {
    const favDoc = doc(db, 'users', userId, 'favorites', questionId);
    const snap = await getDoc(favDoc);
    return snap.exists();
  } catch {
    return false;
  }
};

/**
 * Toggle favorite on a question. Returns true if now favorite, false if removed.
 */
export const toggleFavorite = async (
  userId: string,
  question: QuestionBankQuestion
): Promise<boolean> => {
  const isFav = await isFavorite(userId, question.id);
  if (isFav) {
    await removeFavorite(userId, question.id);
    return false;
  } else {
    await addFavorite(userId, question);
    return true;
  }
};

/**
 * Get user favorites list
 */
export const getUserFavorites = async (
  userId: string,
  limitCount = 50
): Promise<QuestionFavorite[]> => {
  if (!userId) return [];
  try {
    const favsRef = collection(db, 'users', userId, 'favorites');
    const q = query(favsRef, orderBy('createdAt', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as QuestionFavorite);
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    return [];
  }
};

/**
 * Fetch full QuestionBankQuestion documents for user favorites
 */
export const getUserFavoriteQuestions = async (
  userId: string,
  limitCount = 50
): Promise<QuestionBankQuestion[]> => {
  if (!userId) return [];
  try {
    const favs = await getUserFavorites(userId, limitCount);
    if (favs.length === 0) return [];

    const questionPromises = favs.map(async (fav) => {
      const qDoc = await getDoc(doc(db, 'questions', fav.questionId));
      if (qDoc.exists()) {
        const qData = qDoc.data() as QuestionBankQuestion;
        if (qData.isActive !== false) {
          return { id: qDoc.id, ...qData } as QuestionBankQuestion;
        }
      }
      return null;
    });

    const results = await Promise.all(questionPromises);
    return results.filter((q): q is QuestionBankQuestion => q !== null);
  } catch (error) {
    console.error('Error fetching user favorite questions:', error);
    return [];
  }
};
