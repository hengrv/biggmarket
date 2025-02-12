import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const userProfileInput = z.object({
    image: z.string().url("Must be a valid URL").optional()
  });

  const reviewInput = z.object({
    userId: z.string(),
    review: z.string(),
    rating: z.number(),
  })

  
export const userRouter = createTRPCRouter({
    // * Get profile
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        const profile = await ctx.db.user.findUnique({
            where: { id: ctx.session.user.id },
        });

        return profile ?? null;
    }),

    // * Delete profile
    // ! TODO

    // * Update profile
    updateProfile: protectedProcedure
    .input(userProfileInput)
    .mutation(async ({ ctx, input }) => {
        const profile = await ctx.db.user.update({
            where: { id: ctx.session.user.id },
            data: {
                ...input,
            }
        })

        return profile ?? null;
    }),

    // * Add review
    addProfileReview: protectedProcedure
    .input(reviewInput)
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;

        const review = await ctx.db.review.create({
            data: {
              userId: input.userId, // This should be the user being reviewed
              reviewer: userId, // Current user
              review: input.review,
              rating: input.rating,
            },
        })
  
      return review;
    }),
    
    // * Get reviews
    getProfileReviews: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        const reviews = await ctx.db.review.findMany({
            where: {
              userId,
            },
        })

        return reviews;
    }),
});



