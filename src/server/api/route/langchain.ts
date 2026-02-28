import { publicProcedure, createTRPCRouter } from "../trpc";
import z from "zod";

export const langchainRouter = createTRPCRouter({
  getSomethingBysomething: publicProcedure
    .input(z.string())
    .query(() => "Hello World"),
});
