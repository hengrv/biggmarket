import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import type { SwipeDirection, machedStatus } from "@prisma/client";

const itemInputSchema = z.object({
  image: z.string().url("Must be a valid URL"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["AVAILABLE", "SWAPPED", "HIDDEN"]).optional(),
});

export const itemRouter = createTRPCRouter({
  createItem: protectedProcedure
    .input(itemInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const item = await ctx.db.item.create({
        data: {
          ...input,
          userId,
          status: "AVAILABLE", // Default status for new items
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

      return item;
    }),

  updateItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: itemInputSchema.partial(), // Makes all fields optional for updates
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if item exists and belongs to user
      const existingItem = await ctx.db.item.findUnique({
        where: { id: input.id },
      });

      if (!existingItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });
      }

      if (existingItem.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update your own items",
        });
      }

      // Check if item is SWAPPED - prevent updates to swapped items
      if (existingItem.status === "SWAPPED") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot update an item that has been swapped",
        });
      }

      const updatedItem = await ctx.db.item.update({
        where: { id: input.id },
        data: {
          ...input.data,
          updatedAt: new Date(),
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

      return updatedItem;
    }),

  deleteItem: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if item exists and belongs to user
      const existingItem = await ctx.db.item.findUnique({
        where: { id: input.id },
      });

      if (!existingItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });
      }

      if (existingItem.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own items",
        });
      }

      // Prevent deletion of SWAPPED items
      if (existingItem.status === "SWAPPED") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot delete an item that has been swapped",
        });
      }

      // Delete the item
      await ctx.db.item.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  getUserItems: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(), // If not provided, gets current user's items
        status: z.enum(["AVAILABLE", "SWAPPED", "HIDDEN"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = input.userId ?? ctx.session.user.id;

      const items = await ctx.db.item.findMany({
        where: {
          userId,
          ...(input.status ? { status: input.status } : {}),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              swipes: true,
              matches: true,
              matches2: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return items;
    }),

  getItemById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.item.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              swipes: true,
              matches: true,
              matches2: true,
            },
          },
        },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });
      }

      return item;
    }),

  toggleItemVisibility: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existingItem = await ctx.db.item.findUnique({
        where: { id: input.id },
      });

      if (!existingItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });
      }

      if (existingItem.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only toggle visibility of your own items",
        });
      }

      if (existingItem.status === "SWAPPED") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot modify visibility of a swapped item",
        });
      }

      const newStatus =
        existingItem.status === "HIDDEN" ? "AVAILABLE" : "HIDDEN";

      const updatedItem = await ctx.db.item.update({
        where: { id: input.id },
        data: {
          status: newStatus,
          updatedAt: new Date(),
        },
      });

      return updatedItem;
    }),
  getNextItem: protectedProcedure
    .input(
      z.object({
        // Optional last seen item id to ensure we don't show the same item
        lastSeenItemId: z.string().optional(),
      }),
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
      }),
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
          await ctx.db.match.create({
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
    const matches = await ctx.db.match.findMany({
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Verify the match exists and the user is part of it
      const match = await ctx.db.match.findUnique({
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
        match.useritem1.userId === userId || match.useritem2.userId === userId;

      if (!isUserPartOfMatch) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not part of this match",
        });
      }

      // Update match status
      const updatedMatch = await ctx.db.match.update({
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
