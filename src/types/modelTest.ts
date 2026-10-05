import { Timestamp } from 'firebase/firestore';
import { QuizQuestionSnapshot, QuizAnswerRecord } from './questionBank';

export type ModelTestCategory = 'bcs' | 'primary' | 'bank' | 'ntrca' | 'admission' | 'special';

export type ModelTestStatus = 'upcoming' | 'live' | 'ended';

export interface LiveModelTest {
  id: string;
  title: string;
  category: ModelTestCategory;
  categoryName: string;
  description: string;
  instructions: string[];
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  negativeMarking: number;
  passMarks: number;
  startsAt: Timestamp;
  endsAt: Timestamp;
  resultPublishAt: Timestamp;
  status: ModelTestStatus;
  totalParticipants: number;
  highestScore?: number;
  averageScore?: number;
  questionIds: string[];
  questionsSnapshot?: QuizQuestionSnapshot[];
  isFeatured?: boolean;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface ModelTestLeaderboardEntry {
  id: string;
  modelTestId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  percentage: number;
  timeTakenSeconds: number;
  rank: number;
  percentile?: number;
  isPassed: boolean;
  submittedAt: Timestamp;
}

export interface UserLiveModelTestSubmission {
  id: string;
  modelTestId: string;
  userId: string;
  userName?: string;
  userPhoto?: string;
  answers: Record<string, QuizAnswerRecord>;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  percentage: number;
  timeTakenSeconds: number;
  rank?: number;
  percentile?: number;
  isPassed: boolean;
  status: 'in_progress' | 'completed' | 'timed-out';
  startedAt: Timestamp;
  completedAt?: Timestamp;
}

export interface CreateModelTestInput {
  title: string;
  category: ModelTestCategory;
  description: string;
  instructions?: string[];
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  negativeMarking: number;
  passMarks: number;
  startsAt: Date;
  endsAt: Date;
  resultPublishAt?: Date;
  questionIds: string[];
  questionsSnapshot?: QuizQuestionSnapshot[];
  isFeatured?: boolean;
}
