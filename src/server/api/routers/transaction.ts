import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const transactionRouter = createTRPCRouter({
    ping: publicProcedure
    .query(() => {
      return {
        greeting: `Pong`,
      };
    }),
});
