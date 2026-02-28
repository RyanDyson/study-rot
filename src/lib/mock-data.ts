export interface ThreadTweet {
  id: string;
  author: string;
  handle: string;
  avatarColor: string;
  content: string;
  order: number;
  type?: "take" | "correction" | "misconception" | "explanation" | "example";
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
          "Hot take: \"Overfitting is just your model trying really hard.\" 🔥",
        order: 1,
        type: "misconception",
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
      },
      {
        id: "t4",
        author: "MythBuster",
        handle: "@MythBuster",
        avatarColor: "bg-destructive",
        content:
          "Misconception: \"More parameters always = better model.\" Nope. More params = more capacity to overfit. This is where regularization and validation sets come in…",
        order: 4,
        type: "misconception",
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
      },
      {
        id: "r2",
        author: "CodeSkeptic",
        handle: "@CodeSkeptic",
        avatarColor: "bg-chart-2",
        content:
          "Ragebait: \"You should put everything in one big useState object.\" Please don't. Split state by what changes together. One object = unnecessary re-renders and confusing updates.",
        order: 2,
        type: "misconception",
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
