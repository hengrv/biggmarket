import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  type SwipeDirection,
  matchedStatus,
  type Item,
  type User,
} from "@prisma/client";
import geolib from "geolib";

type ItemWithUserRating = (Item & { distance: number }) & {
  user: Omit<User, "username" | "email" | "emailVerified" | "bio" | "role"> & {
    rating: number;
  };
};

const itemInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  images: z
    .string()
    .url("Must be a valid URL")
    .array()
    .min(1, "At least one image is required"),
  description: z.string(),
  category: z.string().min(1, "Category is required"), // ! Change to enum
  status: z.enum(["AVAILABLE", "SWAPPED", "HIDDEN"]).optional(),
});

export const itemRouter = createTRPCRouter({
  createItem: protectedProcedure
    .input(itemInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if user has locaiton set
      const userLocation = await ctx.db.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          location: true,
        },
      });
      if (!userLocation?.location) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "User location not set",
        });
      }

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

      // Check if the user has already swiped this item
      const existingSwipe = await ctx.db.swipe.findFirst({
        where: {
          userId,
          itemId: input.itemId,
        },
      });

      if (existingSwipe) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You have already swiped this item`,
        });
      }

      // Create swipe record
      const swipe = await ctx.db.swipe.create({
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
              user1Id: userId, // Current user ID
              user2Id: item.userId, // Item owner's ID
              status: "PENDING",
            },
          });
        }
      }

      return { success: true };
    }),

  getMatches: protectedProcedure
    .input(
      z
        .object({
          userId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const userId = input?.userId ?? ctx.session.user.id;
      const matches = await ctx.db.match.findMany({
        where: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
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

  getSwipeStats: protectedProcedure
    .input(
      z
        .object({
          userId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const userId = input?.userId ?? ctx.session.user.id;

      const stats = await ctx.db.swipe.groupBy({
        by: ["direction"],
        where: {
          userId,
        },
        _count: true,
      });

      return stats;
    }),

  getItemsOnLocation: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const userLocation = await ctx.db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        location: true,
      },
    });

    // Get all user items and sort by lowest distance
    const items = await ctx.db.item.findMany({
      where: {
        userId: {
          not: userId,
        },
        status: "AVAILABLE",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            location: true,
            reviews: true,
          },
        },
      },
    });

    // Filter out items that the user has already swiped
    const swipedItems = await ctx.db.swipe.findMany({
      where: {
        userId,
      },
    });

    // Create a set of swiped item IDs
    const swipedItemIds = new Set(swipedItems.map((swipe) => swipe.itemId));

    // Filter out items that the user has already swiped
    const filteredItems = items.filter((item) => !swipedItemIds.has(item.id));

    // Filter items based on distance from user location and calculate ratings
    const result: ItemWithUserRating[] = [];

    for (const item of filteredItems) {
      if (!item.user.location || !userLocation?.location) {
        continue;
      }

      const distance = geolib.getDistance(
        {
          latitude: Number(userLocation.location.latitude),
          longitude: Number(userLocation.location.longitude),
        },
        {
          latitude: Number(item.user.location.latitude),
          longitude: Number(item.user.location.longitude),
        },
      );

      // Calculate average rating
      let rating = 0;
      if (item.user.reviews.length > 0) {
        const totalRating = item.user.reviews.reduce(
          (acc, review) => acc + review.rating,
          0,
        );
        rating = totalRating / item.user.reviews.length;
      }

      // Create a new object with the correct structure
      result.push({
        ...item,
        distance,
        user: {
          ...item.user,
          rating,
        },
      });
    }

    // Sort by distance
    result.sort((a, b) => a.distance - b.distance);

    return result;
  }),

  getUserLikedItems: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Get items the user has swiped right on
    const rightSwipes = await ctx.db.swipe.findMany({
      where: {
        userId,
        direction: "RIGHT",
      },
      include: {
        item: {
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

    // Filter out items that are already in a match
    const matches = await ctx.db.match.findMany({
      where: {
        OR: [
          { useritem1: { userId: userId } },
          { useritem2: { userId: userId } },
        ],
        status: {
          in: [matchedStatus.ACCEPTED, matchedStatus.REJECTED],
        },
      },
      select: {
        item1id: true,
        item2id: true,
      },
    });

    // Create a set of matched item IDs
    const matchedItemIds = new Set<string>();
    matches.forEach((match) => {
      matchedItemIds.add(match.item1id);
      matchedItemIds.add(match.item2id);
    });

    console.log("matched items", matches);

    // Filter out items that are already matched
    const likedItems = rightSwipes
      .filter((swipe) => !matchedItemIds.has(swipe.itemId))
      .map((swipe) => {
        const { item } = swipe;
        return {
          id: item.id,
          title: item.title,
          description: item.description,
          images: item.images,
          user: item.user,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          status: item.status,
        };
      });

    console.log("liked items", likedItems);

    return likedItems;
  }),

  unlikeItem: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Delete the swipe record
      await ctx.db.swipe.deleteMany({
        where: {
          userId: userId,
          itemId: input.itemId,
        },
      });

      // Delete any matches that were created from this swipe
      await ctx.db.match.deleteMany({
        where: {
          OR: [{ item1id: input.itemId }, { item2id: input.itemId }],
        },
      });

      return { success: true };
    }),

  // Add a new function to get an item's distance from the user
  getItemDistance: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Get user's location
      const userLocation = await ctx.db.user.findUnique({
        where: { id: userId },
        include: { location: true },
      });

      if (!userLocation?.location) {
        return null; // User has no location set
      }

      // Get the item and its owner's location
      const item = await ctx.db.item.findUnique({
        where: { id: input.itemId },
        include: {
          user: {
            include: { location: true },
          },
        },
      });

      if (!item || !item.user.location) {
        return null; // Item not found or owner has no location
      }

      // Calculate distance using geolib
      const distance = geolib.getDistance(
        {
          latitude: Number(userLocation.location.latitude),
          longitude: Number(userLocation.location.longitude),
        },
        {
          latitude: Number(item.user.location.latitude),
          longitude: Number(item.user.location.longitude),
        },
      );

      return distance; // Distance in meters
    }),
});
