import { Timestamp } from 'firebase/firestore';

/**
 * ShafinBD Jobs - Question Bank Module Type Definitions
 * Scalable schema supporting 1M+ questions, hierarchical navigation,
 * counter caches, progress tracking, and bulk Excel imports.
 */

// Common Enums & Base Types
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type CorrectAnswer = 'A' | 'B' | 'C' | 'D';

export type ImportStatus = 'processing' | 'validated' | 'completed' | 'failed';

export type ImportErrorType = 
  | 'missing_question' 
  | 'missing_option' 
  | 'invalid_answer' 
  | 'duplicate' 
  | 'invalid_year' 
  | 'unknown';

// Level 1: Subject (e.g. বাংলা সাহিত্য, English Literature, বাংলাদেশ বিষয়াবলি)
export interface QuestionBankSubject {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  
  // Counter caches for instant high-performance display
  questionCount: number;
  topicCount: number;
  
  sortOrder: number;
  isActive: boolean;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Level 2: Topic (e.g. বাংলা সাহিত্যের প্রাচীন যুগ, মধ্যযুগ, আধুনিক যুগ)
export interface QuestionBankTopic {
  id: string;
  subjectId: string;
  name: string;
  slug: string;
  description?: string;
  
  // Counter caches
  questionCount: number;
  subtopicCount: number;
  
  sortOrder: number;
  isActive: boolean;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Level 3: Subtopic (e.g. চর্যাপদ, চর্যাপদের কবিগণ)
// Note: Some topics might have no subtopics; in that case subtopicId is null in questions
export interface QuestionBankSubtopic {
  id: string;
  subjectId: string;
  topicId: string;
  name: string;
  slug: string;
  description?: string;
  
  // Counter cache
  questionCount: number;
  
  sortOrder: number;
  isActive: boolean;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Level 4: Question Options
export interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
}

// Level 4: Question Core Entity
export interface QuestionBankQuestion {
  id: string;
  subjectId: string;
  topicId: string;
  subtopicId: string | null; // null if topic has no deeper subtopics
  
  question: string;
  options: QuestionOptions;
  correctAnswer: CorrectAnswer;
  explanation?: string;
  
  difficulty: QuestionDifficulty;
  source?: string;       // e.g. "BCS", "Primary", "Combined 8 Banks"
  examName?: string;     // e.g. "45th BCS Preliminary"
  examYear?: number;     // e.g. 2023
  tags?: string[];
  
  // Random key float (0..1) for uniform O(1) random sampling across millions of questions
  randomKey?: number;
  
  isActive: boolean;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Aggregated User Subject Progress Stats: users/{userId}/progressStats/{subjectId}
// Instant O(1) read for the "0/12.7K (0.00% পড়া হয়েছে)" progress bar without querying 1M+ docs
export interface SubjectProgressStats {
  subjectId: string;
  viewedCount: number;
  answeredCount: number;
  correctCount: number;
  updatedAt: Timestamp;
}

// Student User Progress Tracking: users/{userId}/questionProgress/{questionId}
export interface QuestionProgress {
  questionId: string;
  subjectId: string;
  topicId: string;
  subtopicId: string | null;
  
  viewed: boolean;
  answered: boolean;
  selectedAnswer?: CorrectAnswer;
  isCorrect?: boolean;
  
  firstViewedAt?: Timestamp;
  lastViewedAt?: Timestamp;
  answeredAt?: Timestamp;
}

// Student Favorite / Bookmark: users/{userId}/favorites/{questionId}
export interface QuestionFavorite {
  questionId: string;
  subjectId: string;
  topicId: string;
  subtopicId: string | null;
  createdAt: Timestamp;
}

// Quiz Modes & Engine Types
export type QuizMode = 'subject' | 'topic' | 'mixed' | 'bcs-mock' | 'smart-revision';
export type QuizStatus = 'in-progress' | 'completed' | 'abandoned' | 'timed-out';

export interface QuizQuestionSnapshot {
  id: string;
  order?: number;
  question: string;
  options: QuestionOptions;
  correctAnswer: CorrectAnswer;
  explanation?: string;
  subjectId: string;
  subjectName?: string;
  topicId: string;
  topicName?: string;
  subtopicId?: string | null;
  difficulty?: QuestionDifficulty;
  source?: string;
  examName?: string;
  examYear?: number;
  tags?: string[];
}

export interface QuizAnswerRecord {
  selectedAnswer: CorrectAnswer | null;
  isCorrect: boolean;
  timeSpentSeconds?: number;
}

export interface QuizConfigOptions {
  title?: string;
  mode: QuizMode;
  subjectId?: string;
  subjectName?: string;
  topicId?: string;
  topicName?: string;
  subtopicId?: string | null;
  difficulty?: QuestionDifficulty | 'mixed';
  questionCount: number;
  durationSeconds: number; // 0 for untimed
  negativeMarkingPerWrong?: number; // e.g., 0.25, 0.5, or 0
}

// Quiz Attempt / Mock Test Session: users/{userId}/quizAttempts/{attemptId}
export interface QuizAttempt {
  id: string;
  userId: string;
  title: string;
  mode: QuizMode;
  subjectId?: string;
  subjectName?: string;
  topicId?: string;
  topicName?: string;
  subtopicId?: string | null;
  
  difficulty?: QuestionDifficulty | 'mixed';
  questionIds: string[];
  questionsSnapshot?: QuizQuestionSnapshot[];
  answers: Record<string, QuizAnswerRecord>;
  markedQuestionIds: string[];
  currentQuestionIndex?: number;
  
  totalQuestions: number;
  answeredCount: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  
  score: number;
  percentage: number;
  negativeMarkingPerWrong?: number;
  
  durationSeconds: number;
  timeTakenSeconds: number;
  status: QuizStatus;
  
  startedAt: Timestamp;
  completedAt?: Timestamp;
}

// Admin Bulk Import Log: questionImports/{importId}
export interface QuestionImportLog {
  id: string;
  adminId: string;
  adminEmail?: string;
  fileName: string;
  
  subjectId: string;
  topicId: string;
  subtopicId: string | null;
  
  totalRows: number;
  validRows: number;
  invalidRows: number;
  importedRows: number;
  
  status: ImportStatus;
  startedAt?: Timestamp;
  createdAt: Timestamp;
  completedAt?: Timestamp;
}

// Import Error Row: questionImports/{importId}/errors/{errorId}
export interface QuestionImportError {
  id: string;
  importId: string;
  rowNumber: number;
  errorType: ImportErrorType;
  message: string;
  rawData?: Record<string, unknown>;
}

// Form & Mutation Input Types
// Note: Counters (questionCount, topicCount, subtopicCount) are strictly protected
// and can only be updated via the service layer atomic transactions/increments.
export interface CreateSubjectInput {
  name: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateSubjectInput {
  name?: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateTopicInput {
  subjectId: string;
  name: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateTopicInput {
  name?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateSubtopicInput {
  subjectId: string;
  topicId: string;
  name: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateSubtopicInput {
  name?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateQuestionInput {
  subjectId: string;
  topicId: string;
  subtopicId?: string | null;
  question: string;
  options: QuestionOptions;
  correctAnswer: CorrectAnswer;
  explanation?: string;
  difficulty?: QuestionDifficulty;
  source?: string;
  examName?: string;
  examYear?: number;
  tags?: string[];
  isActive?: boolean;
}

export interface UpdateQuestionInput {
  subjectId?: string;
  topicId?: string;
  subtopicId?: string | null;
  question?: string;
  options?: QuestionOptions;
  correctAnswer?: CorrectAnswer;
  explanation?: string;
  difficulty?: QuestionDifficulty;
  source?: string;
  examName?: string;
  examYear?: number;
  tags?: string[];
  isActive?: boolean;
}

// ==========================================
// Phase 4.3: Student Performance Analytics
// Constant O(1) Read Aggregates & Smart Insights
// ==========================================

export interface UserAnalyticsOverview {
  userId: string;
  totalQuizzes: number;
  totalQuestionsAttempted: number;
  totalCorrect: number;
  totalWrong: number;
  totalSkipped: number;
  totalScore: number;
  totalDurationSeconds: number;
  overallAccuracy: number; // Percentage (0-100)
  averageScore: number;
  lastQuizAt?: Timestamp;
  lastScore?: number;
  lastPercentage?: number;
  updatedAt?: Timestamp;
}

export interface UserSubjectAnalytics {
  subjectId: string;
  subjectName: string;
  quizzesCount: number;
  totalAttempted: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number; // Percentage (0-100)
  lastAttemptAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface UserTopicAnalytics {
  topicId: string;
  topicName: string;
  subjectId: string;
  subjectName?: string;
  totalAttempted: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number; // Percentage (0-100)
  classification: 'strong' | 'moderate' | 'weak'; // strong >= 75%, moderate 50-74%, weak < 50%
  lastAttemptAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface UserDailyAnalytics {
  date: string; // YYYY-MM-DD
  quizzesCount: number;
  questionsAttempted: number;
  correctCount: number;
  wrongCount: number;
  totalScore: number;
  timeSpentSeconds: number;
  accuracy: number; // Percentage (0-100)
  updatedAt?: Timestamp;
}

export interface SmartInsightRecommendation {
  id: string;
  type: 'weak-topic' | 'daily-revision' | 'strong-topic' | 'time-management';
  title: string;
  description: string;
  actionText: string;
  subjectId?: string;
  subjectName?: string;
  topicId?: string;
  topicName?: string;
  accuracy?: number;
  attemptCount?: number;
  priority: 'high' | 'medium' | 'low';
}

