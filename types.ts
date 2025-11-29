
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  source?: string;
}

export interface RecruitmentItem {
  id: string;
  title: string;
  organization: string;
  deadline: string;
  link: string;
  eligibility: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string; // The text of the correct option
  explanation: string;
  subject?: string;
}

export interface QuizResult {
  score: number;
  total: number;
  answers: { questionIndex: number; selected: string; correct: string; isMarkedForReview: boolean }[];
  timeTaken: number; // in seconds
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum FetchStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GroundingSource {
  uri: string;
  title: string;
  source_title?: string;
}

export interface StudyPlanDay {
  day: string;
  focus: string;
  topics: string[];
  activities: string[];
}

export interface StudyPlan {
  exam: string;
  duration: string;
  schedule: StudyPlanDay[];
}

export interface PYQItem {
  id: string;
  exam: string;
  year: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface NotificationItem {
  id: string;
  type: 'JOB' | 'NEWS' | 'ALERT';
  message: string;
  timestamp: string;
  link?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isPro: boolean;
}

export type TestType = 'MOCK' | 'SUBJECT' | 'CHAPTER';

export interface TestConfig {
  type: TestType;
  exam: string;
  subject?: string;
  topic?: string;
  questionCount: number;
  durationMinutes: number; // 0 for no timer
}
