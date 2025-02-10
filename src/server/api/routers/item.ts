import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const productRouter = createTRPCRouter({
  getNextProduct: protectedProcedure
    .input(
      z.object({
        // Optional last seen product id to ensure we don't show the same product
        lastSeenProductId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Get an item that:
      // 1. User hasn't interacted with (no swipes)
      // 2. Isn't their own product
      // 3. Is still available
      // 4. Isn't the last seen product
      const nextProduct = await ctx.db.item.findFirst({
        where: {
          AND: [
            // Exclude products user has already swiped on
            {
              NOT: {
                swipes: {
                  some: {
                    userId,
                  },
                },
              },
            },
            // Exclude user's own products
            {
              NOT: {
                userId,
              },
            },
            // Only available products
            {
              status: "AVAILABLE",
            },
            // Exclude last seen product if provided
            input.lastSeenProductId
              ? {
                NOT: {
                  id: input.lastSeenProductId,
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

      if (!nextProduct) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No more products available",
        });
      }

      return nextProduct;
    }),

  swipeProduct: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        direction: z.enum(["LEFT", "RIGHT"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Verify product exists and is available
      const product = await ctx.db.item.findUnique({
        where: { id: input.itemId },
      });

      if (!product || product.status !== "AVAILABLE") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found or no longer available",
        });
      }

      // Create swipe record
      await ctx.db.swipe.create({
        data: {
          userId,
          itemId: input.itemId,
          direction: input.direction,
          // If it's a RIGHT swipe, create an offer
          ...(input.direction === "RIGHT"
            ? {
              offer: {
                create: {
                  amount: input.offerAmount,
                  status: "PENDING",
                  userId,
                  productId: input.productId,
                },
              },
            }
            : {}),
        },
      });

      return { success: true };
    }),

  // Optional: Get swipe statistics
  getSwipeStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const stats = await ctx.db.swipe.groupBy({
      by: ["direction"],
      where: {
        userId,
      },
      _count: true,
    });

    return stats;
  }),
});
