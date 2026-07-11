export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'tutorial' | 'course' | 'docs' | 'blog' | 'repo';
  platform: string;
  description: string;
}

export interface Topic {
  id: string;
  title: string;
  resources: Resource[];
}

export interface Step {
  id: number;
  title: string;
  description: string;
  topics: Topic[];
}

export interface UserProgress {
  completedTopicIds: string[];
  bookmarkedUrls: string[];
  quizScores: Record<string, { score: number; total: number; date: string }>;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  topicId: string;
  topicTitle: string;
  questions: QuizQuestion[];
}
