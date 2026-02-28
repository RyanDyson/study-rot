import z from "zod";
import { protectedProcedure, createTRPCRouter } from "../trpc";
import { db } from "@/server/db";
import { knowledgeBase, knowledgeFiles } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const knowledgeBaseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await db
        .insert(knowledgeBase)
        .values({
          title: input.title,
          description: input.description,
          userId: ctx.session.user.id,
        })
        .returning();

      return res[0];
    }),
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const kb = await db.query.knowledgeBase.findFirst({
        where: and(
          eq(knowledgeBase.id, input),
          eq(knowledgeBase.userId, ctx.session.user.id),
        ),
        with: {
          files: {
            columns: { id: true, name: true, createdAt: true, ocrStatus: true },
          },
        },
      });
      return kb ?? null;
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
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(knowledgeBase)
        .set({ title: input.title, description: input.description })
        .where(
          and(
            eq(knowledgeBase.userId, ctx.session.user.id),
            eq(knowledgeBase.id, input.id),
          ),
        )
        .returning();
    }),
  uploadFiles: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),

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
      const inserted = await db
        .insert(knowledgeFiles)
        .values(
          input.files.map((file) => ({
            name: file.name,
            knowledgeBaseId: input.id,
          })),
        )
        .returning({ id: knowledgeFiles.id });
      return inserted;
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
      return files.map((f) => ({
        id: f.id,
        name: f.name,
        text: f.extractedText ?? "",
      }));
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

      await db
        .delete(knowledgeBase)
        .where(
          and(
            eq(knowledgeBase.userId, ctx.session.user.id),
            eq(knowledgeBase.id, input),
          ),
        );
    }),
});

export type KnowledgeBaseRouter = typeof knowledgeBaseRouter;
