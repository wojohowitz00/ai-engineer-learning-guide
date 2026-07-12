export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'tutorial' | 'course' | 'docs' | 'blog' | 'repo';
  platform: string;
  description: string;
  /** Requires paid membership/enrollment for the described content. Shown as a badge in the UI. */
  paywall?: boolean;
  /** The recommended entry point for its topic. Rendered first with a "Start here" badge; the topic's remaining resources collapse behind a "Go deeper" toggle. At most one per topic. */
  primary?: boolean;
}

export interface Topic {
  id: string;
  title: string;
  /** Pull motivation: a pain point from applied data science work the reader has likely already felt, shown above the resource list. */
  whenYouNeedThis?: string;
  resources: Resource[];
}

export interface Step {
  id: number;
  title: string;
  description: string;
  /** Capstone thread: what the learner's evolving project gains this step, ending on the weakness the next step fixes. Shown in the step header. */
  capstone?: string;
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
