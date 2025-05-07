import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const adminRouter = createTRPCRouter({
  getRecentUsers: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      // Check if user is admin
      if (!(ctx.session.user.role === UserRole.ADMIN)) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return ctx.db.user.findMany({
        take: input.limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
        },
      });
    }),

  getRecentSwaps: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      if (!(ctx.session.user.role === UserRole.ADMIN)) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return ctx.db.swipe.findMany({
        take: input.limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          item: {
            include: {
              user: true,
            },
          },
        },
      });
    }),

  getReports: protectedProcedure.query(async ({ ctx }) => {
    if (!(ctx.session.user.role === UserRole.ADMIN)) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return ctx.db.report.findMany({
      where: {
        closed: false,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  getUserDetail: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { id: input.userId },
        include: {
          items: true,
          swipes: {
            include: {
              item: true,
            },
          },
        },
      });
    }),

  getSwipeDetail: protectedProcedure
    .input(z.object({ swapId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.swipe.findUnique({
        where: { id: input.swapId },
        include: {
          item: {
            include: {
              user: true,
            },
          },
        },
      });
    }),

  getReportDetail: protectedProcedure
    .input(z.object({ reportId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.report.findUnique({
        where: { id: input.reportId },
      });
    }),
});
