import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { itemRouter } from "~/server/api/routers/item";
import { algoRouter } from "~/server/api/routers/algorithm";
import { messageRouter } from "~/server/api/routers/message";

/**
 * This is the primary router for the server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  item: itemRouter,
  algorithm: algoRouter,
  message: messageRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
