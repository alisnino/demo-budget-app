import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@packages/prisma/prisma/client";

const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

const appRouter = router({
  test: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { message: `Hello ${input.name}!` };
    }),
  findById: publicProcedure.input(z.number()).query(async ({ input }) => {
    return await prisma.users.findUnique({
      where: {
        id: input,
      },
    });
  }),
});

export const expressMiddleware = createExpressMiddleware({
  router: appRouter,
});

export type AppRouter = typeof appRouter;
