export interface ThreadTweet {
  id: string;
  author: string;
  handle: string;
  avatarColor: string;
  content: string;
  order: number;
  type?: "take" | "correction" | "misconception" | "explanation" | "example";
  timestamp: string;
  likes: number;
  replies?: ThreadTweet[];
  replyCount?: number;
}

export interface Thread {
  id: string;
  courseId: string;
  title: string;
  topic: string;
  tweets: ThreadTweet[];
  generatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  threadId: string | null;
  uploadedAt: string | null;
}

export const mockCourses: Course[] = [
  {
    id: "course-1",
    title: "Intro to Machine Learning",
    description: "Overfitting, regularization, and validation",
    threadId: "thread-ml",
    uploadedAt: "2026-02-27T10:00:00Z",
  },
  {
    id: "course-2",
    title: "React Hooks Deep Dive",
    description: "useState, useEffect, and custom hooks",
    threadId: "thread-react",
    uploadedAt: "2026-02-26T14:30:00Z",
  },
  // {
  //   id: "course-3",
  //   title: "Untitled course",
  //   description: "Upload slides or PDF to generate threads",
  //   threadId: null,
  //   uploadedAt: null,
  // },
];

export const mockThreads: Record<string, Thread> = {
  "thread-ml": {
    id: "thread-ml",
    courseId: "course-1",
    title: "Intro to Machine Learning",
    topic: "Overfitting & Regularization",
    generatedAt: "2026-02-27T10:05:00Z",
    tweets: [
      {
        id: "t1",
        author: "ConceptBot",
        handle: "@ConceptBot",
        avatarColor: "bg-primary",
        content:
          'Hot take: "Overfitting is just your model trying really hard." 🔥',
        order: 1,
        type: "misconception",
        timestamp: "49m",
        likes: 12,
        replyCount: 3,
        replies: [
          {
            id: "t1-r1",
            author: "DataScience101",
            handle: "@DataScience101",
            avatarColor: "bg-chart-1",
            content: "This is a common mistake many beginners make!",
            order: 1,
            timestamp: "45m",
            likes: 5,
            replyCount: 1,
            replies: [
              {
                id: "t1-r1-r1",
                author: "MLExpert",
                handle: "@MLExpert",
                avatarColor: "bg-chart-5",
                content:
                  "Exactly! Understanding the difference is crucial for model evaluation.",
                order: 1,
                timestamp: "42m",
                likes: 3,
              },
            ],
          },
          {
            id: "t1-r2",
            author: "AIEnthusiast",
            handle: "@AIEnthusiast",
            avatarColor: "bg-chart-2",
            content: "Wait, so is dropout a form of regularization?",
            order: 2,
            timestamp: "40m",
            likes: 8,
          },
        ],
      },
      {
        id: "t2",
        author: "ExplainAI",
        handle: "@ExplainAI",
        avatarColor: "bg-chart-3",
        content:
          "Not quite. Overfitting means your model memorizes the training data and fails on new data. High training accuracy, poor test accuracy. Let's walk through an example 👇",
        order: 2,
        type: "correction",
        timestamp: "44m",
        likes: 24,
        replyCount: 2,
        replies: [
          {
            id: "t2-r1",
            author: "StudentDev",
            handle: "@StudentDev",
            avatarColor: "bg-chart-4",
            content: "This explanation is super clear, thanks!",
            order: 1,
            timestamp: "42m",
            likes: 7,
          },
          {
            id: "t2-r2",
            author: "CodeNewbie",
            handle: "@CodeNewbie",
            avatarColor: "bg-chart-1",
            content: "Can you give a real-world example?",
            order: 2,
            timestamp: "38m",
            likes: 15,
          },
        ],
      },
      {
        id: "t3",
        author: "ExplainAI",
        handle: "@ExplainAI",
        avatarColor: "bg-chart-3",
        content:
          "Think of it like memorizing exam answers word-for-word vs understanding the concepts. One works only for that exact test. The other generalizes.",
        order: 3,
        type: "explanation",
        timestamp: "35m",
        likes: 31,
        replyCount: 1,
        replies: [
          {
            id: "t3-r1",
            author: "ConceptBot",
            handle: "@ConceptBot",
            avatarColor: "bg-primary",
            content: "Ah, that analogy makes so much sense now!",
            order: 1,
            timestamp: "33m",
            likes: 4,
          },
        ],
      },
      {
        id: "t4",
        author: "MythBuster",
        handle: "@MythBuster",
        avatarColor: "bg-destructive",
        content:
          'Misconception: "More parameters always = better model." Nope. More params = more capacity to overfit. This is where regularization and validation sets come in…',
        order: 4,
        type: "misconception",
        timestamp: "30m",
        likes: 19,
      },
      {
        id: "t5",
        author: "ExplainAI",
        handle: "@ExplainAI",
        avatarColor: "bg-chart-3",
        content:
          "L1 (Lasso) and L2 (Ridge) regularization penalize large weights. Early stopping uses a validation set. Dropout randomly turns off neurons. All nudge the model to generalize.",
        order: 5,
        type: "explanation",
        timestamp: "25m",
        likes: 28,
        replyCount: 4,
        replies: [
          {
            id: "t5-r1",
            author: "TechLearner",
            handle: "@TechLearner",
            avatarColor: "bg-chart-2",
            content: "What's the difference between L1 and L2 in practice?",
            order: 1,
            timestamp: "22m",
            likes: 11,
          },
          {
            id: "t5-r2",
            author: "AIEnthusiast",
            handle: "@AIEnthusiast",
            avatarColor: "bg-chart-2",
            content:
              "Yes! Dropout was mentioned earlier. It's definitely a regularization technique.",
            order: 2,
            timestamp: "20m",
            likes: 6,
          },
        ],
      },
      {
        id: "t6",
        author: "ConceptBot",
        handle: "@ConceptBot",
        avatarColor: "bg-primary",
        content:
          "TL;DR: Overfitting = model too tied to training data. Fix it with less complexity, more data, or regularization. Always use a holdout set to measure real performance. 🧵",
        order: 6,
        type: "take",
        timestamp: "18m",
        likes: 45,
        replyCount: 1,
        replies: [
          {
            id: "t6-r1",
            author: "DataScience101",
            handle: "@DataScience101",
            avatarColor: "bg-chart-1",
            content: "Great summary! Saving this thread for later.",
            order: 1,
            timestamp: "15m",
            likes: 9,
          },
        ],
      },
    ],
  },
  "thread-react": {
    id: "thread-react",
    courseId: "course-2",
    title: "React Hooks Deep Dive",
    topic: "useState & useEffect",
    generatedAt: "2026-02-26T14:35:00Z",
    tweets: [
      {
        id: "r1",
        author: "ReactTips",
        handle: "@ReactTips",
        avatarColor: "bg-chart-4",
        content:
          "useState isn't just \"a variable that triggers re-renders.\" It's the gateway to making your component stateful. Every time the setter runs, React schedules a re-render with the new value.",
        order: 1,
        type: "explanation",
        timestamp: "6m",
        likes: 32,
        replyCount: 2,
        replies: [
          {
            id: "r1-r1",
            author: "FrontendDev",
            handle: "@FrontendDev",
            avatarColor: "bg-chart-1",
            content: "This is why React is so powerful for building UIs",
            order: 1,
            timestamp: "5m",
            likes: 8,
          },
          {
            id: "r1-r2",
            author: "WebWizard",
            handle: "@WebWizard",
            avatarColor: "bg-chart-5",
            content: "Can you explain batch updates?",
            order: 2,
            timestamp: "4m",
            likes: 12,
          },
        ],
      },
      {
        id: "r2",
        author: "CodeSkeptic",
        handle: "@CodeSkeptic",
        avatarColor: "bg-chart-2",
        content:
          'Ragebait: "You should put everything in one big useState object." Please don\'t. Split state by what changes together. One object = unnecessary re-renders and confusing updates.',
        order: 2,
        type: "misconception",
        timestamp: "50m",
        likes: 21,
      },
      {
        id: "r3",
        author: "ReactTips",
        handle: "@ReactTips",
        avatarColor: "bg-chart-4",
        content:
          "useEffect runs after paint. Dependency array = when to re-run. Empty [] = mount only. No array = every render (usually a bug). [a, b] = when a or b change.",
        order: 3,
        type: "explanation",
        timestamp: "50m",
        likes: 44,
        replyCount: 3,
        replies: [
          {
            id: "r3-r1",
            author: "JuniorDev",
            handle: "@JuniorDev",
            avatarColor: "bg-chart-3",
            content: "Wait, what about cleanup functions?",
            order: 1,
            timestamp: "48m",
            likes: 15,
          },
        ],
      },
      {
        id: "r4",
        author: "ExplainAI",
        handle: "@ExplainAI",
        avatarColor: "bg-chart-3",
        content:
          "Custom hooks = reuse stateful logic. Same rules: only call hooks at top level, only from React code. Name them useSomething. Now you can share logic across components without prop drilling.",
        order: 4,
        type: "take",
        timestamp: "50m",
        likes: 38,
      },
    ],
  },
};

export function getThread(threadId: string): Thread | undefined {
  return mockThreads[threadId];
}

export function getCourse(courseId: string): Course | undefined {
  return mockCourses.find((c) => c.id === courseId);
}
