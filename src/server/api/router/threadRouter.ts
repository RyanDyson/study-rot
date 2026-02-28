import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { knowledgeBase, knowledgeFiles } from "@/server/db/schema";

export type Thread = {
  id: string;
  author: string;
  handle: string;
  content: string;
  likes: number;
  replies?: Thread[];
};

const sampleChats = [
  {
    id: "r1",
    author: "ReactTips",
    handle: "@ReactTips",
    content:
      "useState isn't just \"a variable that triggers re-renders.\" It's the gateway to making your component stateful. Every time the setter runs, React schedules a re-render with the new value.",
    likes: 25,
    replies: [
      {
        id: "r1-r1",
        author: "FrontendDev",
        handle: "@FrontendDev",
        content: "This is why React is so powerful for building UIs",
        likes: 8,
      },
      {
        id: "r1-r2",
        author: "WebWizard",
        handle: "@WebWizard",
        content: "Can you explain batch updates?",
        likes: 12,
      },
    ],
  },
] satisfies Thread[];

const systemQuery = `You are a chronically-online Gen Z tutor who explains academic concepts through unhinged brainrot Twitter threads. Your tweets must sound like they were written by someone who has been on the internet too long — using phrases like "no cap", "fr fr", "ate and left no crumbs", "slay", "understood the assignment", "it's giving", "lowkey", "not me crying at", "based", "💀", "😭", "🔥", "🚨", "‼️", and other gen-z / meme language. Each tweet should teach a real concept from the provided material but wrapped in absurd, chaotic, extremely online energy.

RULES:
- Return ONLY a single valid JSON object. No markdown, no code fences, no explanation, no text before or after the JSON.
- The root key must be "result" and its value must be an array.
- Every item in the array must strictly match this shape: ${JSON.stringify({ result: sampleChats })}.
- Do not add any extra keys beyond what the schema shows.
- replies is optional but if included must follow the same shape recursively.
- ids must be unique strings.
- likes must be a non-negative integer.
- Make the content educational but deeply unhinged and meme-brained. Think "explaining overfitting using rizz lore" energy.`;

export const threadRouter = createTRPCRouter({
  getAllThreads: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const course = await db.query.knowledgeBase.findFirst({
        where: eq(knowledgeBase.id, input),
      });
      if (!course) throw new Error("Knowledge Base Not Found");

      const documents = await db.query.knowledgeFiles.findMany({
        where: eq(knowledgeFiles.knowledgeBaseId, course.id),
      });

      const chats = [] as Thread[];

      for (const doc of documents) {
        const obj = {
          query: systemQuery,
          collection_name: "collection",
          user_id: ctx.session.user.id,
          document_string: doc.name,
        };
        const newChat = await fetch(process.env.AI_ENDPOINT + "/chat_model", {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        })
          .then((res) => res.json())
          .then((obj) => {
            const res = obj.response;
            console.log(res);
            const parsed = JSON.parse(res);
            // Handle both raw array responses and wrapped { result: [...] } objects
            return Array.isArray(parsed) ? parsed : parsed.result;
          });

        chats.push(...newChat);
      }

      return chats;
    }),
});

export type ThreadRouter = typeof threadRouter;
