import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

const userProfileInput = z.object({
    image: z.string().url("Must be a valid URL").optional(),
    email: z.string().email("Must be a valid email").optional(),
    name: z.string().optional(),
    location: z
        .object({
            postcode: z.string(),
            latitude: z.number(), // Decimal
            longitude: z.number(), // Decimal
        })
        .optional(),
});

const reviewInput = z.object({
    userId: z.string(),
    review: z.string(),
    rating: z.number(),
});

const postcodeInput = z
    .string()
    .regex(
        /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?(\s*)[0-9][A-Z]{2}$/i,
        "Invalid UK postcode",
    );

interface PostcodeResponse {
    status: number;
    result: {
        postcode: string;
        latitude: number;
        longitude: number;
    };
}

export const userRouter = createTRPCRouter({
    // * Get profile
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        const profile = await ctx.db.user.findUnique({
            where: { id: ctx.session.user.id },
            include: {
                location: true,
            },
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
                    location: location
                        ? {
                            upsert: {
                                create: {
                                    postcode: location.postcode,
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                },
                                update: {
                                    postcode: location.postcode,
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                },
                            },
                        }
                        : undefined,
                },
            });
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
            });

            return review;
        }),

    // * Get reviews
    getProfileReviews: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;
        const reviews = await ctx.db.review.findMany({
            where: {
                userId,
            },
        });
        return reviews;
    }),

    // * Postcode to long and lat
    postcodeToLongLat: protectedProcedure
        .input(postcodeInput)
        .query(async ({ input }) => {
            // Format postcode by removing any spaces for the API call
            const formattedPostcode = input.replace(/\s+/g, "");

            try {
                const response = await fetch(
                    `https://api.postcodes.io/postcodes/${formattedPostcode}`,
                );

                if (!response.ok) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Invalid postcode or API error: ${response.statusText}`,
                    });
                }

                const data = (await response.json()) as PostcodeResponse;

                if (data.status !== 200) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Invalid postcode",
                    });
                }

                return {
                    latitude: data.result.latitude,
                    longitude: data.result.longitude,
                };
            } catch (error) {
                // If it's already a TRPCError, rethrow it
                if (error instanceof TRPCError) {
                    throw error;
                }

                // Otherwise, wrap it in a TRPCError
                console.error("Error converting postcode:", error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to convert postcode to coordinates",
                    cause: error,
                });
            }
        }),
});
