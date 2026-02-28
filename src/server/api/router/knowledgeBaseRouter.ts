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
        name: input,
        userId: ctx.session.user.id,
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
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(knowledgeBase)
        .set({ name: input.name })
        .where(
          and(
            eq(knowledgeBase.userId, ctx.session.user.id),
            eq(knowledgeBase.id, input.id),
          ),
        );
    }),
  getOrCreate: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.knowledgeBase.findFirst({
        where: and(
          eq(knowledgeBase.userId, ctx.session.user.id),
          eq(knowledgeBase.name, input.name),
        ),
      });
      if (existing) return { id: existing.id };

      const [created] = await db
        .insert(knowledgeBase)
        .values({ name: input.name, userId: ctx.session.user.id })
        .returning({ id: knowledgeBase.id });
      return { id: created!.id };
    }),
  getFileStatus: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const file = await db.query.knowledgeFiles.findFirst({
        where: eq(knowledgeFiles.id, input),
        columns: { id: true, name: true, ocrStatus: true },
      });
      return file ?? null;
    }),
  getExtractedTexts: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const kb = await db.query.knowledgeBase.findFirst({
        where: and(
          eq(knowledgeBase.id, input),
          eq(knowledgeBase.userId, ctx.session.user.id),
        ),
      });
      if (!kb) return [];

      const files = await db.query.knowledgeFiles.findMany({
        where: and(
          eq(knowledgeFiles.knowledgeBaseId, input),
          eq(knowledgeFiles.ocrStatus, "completed"),
        ),
        columns: { id: true, name: true, extractedText: true },
      });
      return files.map((f) => ({ id: f.id, name: f.name, text: f.extractedText ?? "" }));
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const knowledge = await db.query.knowledgeBase.findFirst({
        where: and(
          eq(knowledgeBase.userId, ctx.session.user.id),
          eq(knowledgeBase.id, input),
        ),
      });
      if (!knowledge) throw "Knowledge Base not found";

      await db.delete(knowledgeBase).where(
        and(
          eq(knowledgeBase.userId, ctx.session.user.id),
          eq(knowledgeBase.id, input),
        ),
      );
    }),
});

export type KnowledgeBaseRouter = typeof knowledgeBaseRouter;
