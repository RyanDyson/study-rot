import z from "zod";
import { protectedProcedure, createTRPCRouter } from "../trpc";
import { db } from "@/server/db";
import { knowledgeBase, knowledgeFiles } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const knowledgeBaseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await db.insert(knowledgeBase).values({
        title: input,
        userId: ctx.session.user.id,
        description: "",
        collection_id: crypto.randomUUID(),
      });
    }),
  getAll: protectedProcedure.query(
    async ({ ctx }) =>
      await db.query.knowledgeBase.findMany({
        where: eq(knowledgeBase.userId, ctx.session.user.id),
      }),
  ),
  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(knowledgeBase)
        .set({ title: input.title })
        .where(
          and(
            eq(knowledgeBase.userId, ctx.session.user.id),
            eq(knowledgeBase.id, input.id),
          ),
        );
    }),
  uploadFiles: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        files: z.array(z.instanceof(File)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // verify knowledge base exist
      const knowledge = await db.query.knowledgeBase.findFirst({
        where: and(
          eq(knowledgeBase.userId, ctx.session.user.id),
          eq(knowledgeBase.id, input.id),
        ),
      });
      if (!knowledge) throw "Knowledge Base not found";

      // Insert files into DB
      await db.insert(knowledgeFiles).values(
        input.files.map((file) => ({
          name: file.name,
          knowledgeBaseId: knowledge.id,
        })),
      );

      // TODO: insert to knowledge base ID
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // verify knowledge base exist
      const knowledge = await db.query.knowledgeBase.findFirst({
        where: and(
          eq(knowledgeBase.userId, ctx.session.user.id),
          eq(knowledgeBase.id, input),
        ),
      });
      if (!knowledge) throw "Knowledge Base not found";

      // Delete db cascade
      await db
        .delete(knowledgeBase)
        .where(
          and(
            eq(knowledgeBase.userId, ctx.session.user.id),
            eq(knowledgeBase.id, input),
          ),
        );

      // TODO: delete from RAG knowledge base
    }),
});

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type KnowledgeBaseRouter = typeof knowledgeBaseRouter;
