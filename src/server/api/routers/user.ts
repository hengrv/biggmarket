import { z, number } from 'zod';
import axios from 'axios';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const userProfileInput = z.object({
    image: z.string().url("Must be a valid URL").optional(),
    email: z.string().email("Must be a valid email").optional(),
    name: z.string().optional(),
    location: z.object({
        latitude: z.number(), // Decimal
        longitude: z.number(), // Decimal
    }).optional(),
});

const reviewInput = z.object({
    userId: z.string(),
    review: z.string(),
    rating: z.number(),
})

const postcodeInput = z.string().regex(
    /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i,
    "Invalid UK postcode"
);

export const userRouter = createTRPCRouter({
    // * Get profile
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        const profile = await ctx.db.user.findUnique({
            where: { id: ctx.session.user.id },
            include: {
                location: true
            }
        });

        return profile ?? null;
    }),

    // * Update profile
    updateProfile: protectedProcedure
    .input(userProfileInput)
    .mutation(async ({ ctx, input }) => {
        const { location, ...userData } = input;

        const profile = await ctx.db.user.update({
            where: { id: ctx.session.user.id },
            data: {
                ...userData,
                location: location ? {
                    upsert: {
                        create: {
                            latitude: location.latitude,
                            longitude: location.longitude,
                        },
                        update: {
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }
                    }
                }
                : undefined
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

    // * Postcode to long and lat
    postcodeToLongLat: protectedProcedure
    .input(postcodeInput)
    .query(async ({ input }) => {
        const retVal = {
            longitude: 0.0,
            latitude: 0.0,
        };

        try {
            const response = await axios.get<{ status: number; result: { latitude: number; longitude: number } }>(`https://api.postcodes.io/postcodes/${input}`) as { data: { status: number; result: { latitude: number; longitude: number } } };

            const data = response.data;

            if (data.status !== 200) {
                throw new Error('Invalid postcode');
            }

            // Assigning the latitude and longitude from the API response
            retVal.latitude = data.result.latitude;
            retVal.longitude = data.result.longitude;

        } catch (error: unknown) {
            console.error('Error converting postcode:', error);
        }

        return retVal;
    }),

});



