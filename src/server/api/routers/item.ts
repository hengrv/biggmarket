import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import type { SwipeDirection, machedStatus } from "@prisma/client";

export const productRouter = createTRPCRouter({
  getNextItem: protectedProcedure
    .input(
      z.object({
        // Optional last seen item id to ensure we don't show the same item
        lastSeenItemId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Get an item that:
      // 1. User hasn't swiped on
      // 2. Isn't their own item
      // 3. Is still available
      // 4. Isn't the last seen item
      const nextItem = await ctx.db.item.findFirst({
        where: {
          AND: [
            // Exclude items user has already swiped on
            {
              NOT: {
                swipes: {
                  some: {
                    userId,
                  },
                },
              },
            },
            // Exclude user's own items
            {
              NOT: {
                userId,
              },
            },
            // Only available items
            {
              status: "AVAILABLE",
            },
            // Exclude last seen item if provided
            input.lastSeenItemId
              ? {
                NOT: {
                  id: input.lastSeenItemId,
                },
              }
              : {},
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!nextItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No more items available",
        });
      }

      return nextItem;
    }),
  swipeItem: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        direction: z.enum(["LEFT", "RIGHT"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Verify item exists and is available
      const item = await ctx.db.item.findUnique({
        where: { id: input.itemId },
      });

      if (!item || item.status !== "AVAILABLE") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found or no longer available",
        });
      }

      // Create swipe record
      const swipe = await ctx.db.swipes.create({
        data: {
          userId,
          itemId: input.itemId,
          direction: input.direction as SwipeDirection,
        },
      });

      // Check for a potential match
      if (input.direction === "RIGHT") {
        // Find if the user owns an item that has been right-swiped by the owner of the current item
        const potentialMatch = await ctx.db.item.findFirst({
          where: {
            userId,
            swipes: {
              some: {
                direction: "RIGHT",
                user: {
                  id: item.userId,
                },
              },
            },
          },
        });

        // If a potential match is found, create a match
        if (potentialMatch) {
          await ctx.db.matches.create({
            data: {
              item1id: potentialMatch.id,
              item2id: input.itemId,
              status: "PENDING",
            },
          });
        }
      }

      return { success: true };
    }),

  getMatches: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Fetch matches for the user, including item and user details
    const matches = await ctx.db.matches.findMany({
      where: {
        OR: [
          {
            useritem1: {
              userId,
            },
          },
          {
            useritem2: {
              userId,
            },
          },
        ],
      },
      include: {
        useritem1: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        useritem2: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return matches;
  }),

  /**
   * updateMatchStatus - take in a matchId and set the status
   *
   * @param matchId
   * @param status
  *
  * */
  updateMatchStatus: protectedProcedure
    .input(
      z.object({
        matchId: z.string(),
        status: z.enum(["ACCEPTED", "REJECTED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Verify the match exists and the user is part of it
      const match = await ctx.db.matches.findUnique({
        where: { id: input.matchId },
        include: {
          useritem1: true,
          useritem2: true,
        },
      });

      if (!match) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Match not found",
        });
      }

      // Ensure only match participants can update the status
      const isUserPartOfMatch =
        match.useritem1.userId === userId ||
        match.useritem2.userId === userId;

      if (!isUserPartOfMatch) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not part of this match",
        });
      }

      // Update match status
      const updatedMatch = await ctx.db.matches.update({
        where: { id: input.matchId },
        data: {
          status: input.status as machedStatus,
        },
      });

      return updatedMatch;
    }),

  /**
  *  getSwipeStats - returns the statitics about how many swipes a user has made
  * */
  getSwipeStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const stats = await ctx.db.swipes.groupBy({
      by: ["direction"],
      where: {
        userId,
      },
      _count: true,
    });

    return stats;
  }),
});
