import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { knowledgeBase, knowledgeFiles } from "@/server/db/schema";
import { converseWithChatBedrock } from "@/server/rag/chatBedrock";
import { ContentBlock } from "@langchain/core/messages";

export type Thread = {
    id: string,
    author: string,
    handle: string,
    content: string,
    likes: number,
    replies?: Thread[]
}

const sampleChats = [{
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
                }]
            }] satisfies Thread[]

const systemQuery = `Generate a twitter thread like conversation in JSON, follow the following structure ${sampleChats}`

export const threadRouter = createTRPCRouter({
    getAllThreads: protectedProcedure
        .input(z.string())
        .query(async ({ctx, input}) => {
            const course = await db.query.knowledgeBase.findFirst({where: eq(knowledgeBase.id, input)})
            if (!course) throw new Error("Knowledge Base Not Found");

            return sampleChats

            const documents = await db.query.knowledgeFiles.findMany({where: eq(knowledgeFiles.knowledgeBaseId, course.id)})

            const chats = [] as Thread[]

            for (const doc of documents) {
                const newChat = await converseWithChatBedrock(
                    doc.name,
                    systemQuery,
                    10
                )

                chats.push(JSON.parse(newChat))
            }

            return chats       
        })
})

export type ThreadRouter = typeof threadRouter