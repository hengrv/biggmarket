import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

export const postcodeInput = z
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
    getCurrentlyAuthenticatedUser: protectedProcedure.query(async ({ ctx }) => {
        return ctx.session.user.id;
    }),

    // * Get profile
    getProfile: protectedProcedure
        .input(
            z.object({
                userId: z.string().optional(),
            }).optional(),
        )
        .query(async ({ ctx, input }) => {
            const userId = input?.userId ?? ctx.session.user.id

            const profile = await ctx.db.user.findUnique({
                where: { id: userId },
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
    getProfileReviews: protectedProcedure
        .input(
            z.object({
                userId: z.string()
            }).optional())
        .query(async ({ ctx, input }) => {
            const userId = input?.userId ?? ctx.session.user.id;
            const reviews = await ctx.db.review.findMany({
                where: {
                    userId,
                },
                include: {
                    reviewerUser: true,
                },
            });
            return reviews;
        }),
    getAverageRating: protectedProcedure
        .input(
            z.object({
                userId: z.string()
            }).optional())
        .query(async ({ ctx, input }) => {
            const userId = input?.userId ?? ctx.session.user.id;

            const result = await ctx.db.review.aggregate({
                where: {
                    userId,
                },
                _avg: {
                    rating: true,
                },
                _count: {
                    rating: true,
                },
            })

            if (result._count.rating === 0) {
                return {
                    averageRating: 0,
                    reviewCount: 0,
                }
            }

            // Round to 1 decimal place if needed
            const averageRating = result._avg.rating ? Math.round(result._avg.rating * 10) / 10 : 0

            return {
                averageRating,
                reviewCount: result._count.rating,
            }
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

    followUser: protectedProcedure
        .input(
            z.object({
                followingId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const followerId = ctx.session.user.id;

            // Prevent self-following
            if (followerId === input.followingId) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "You cannot follow yourself",
                });
            }

            try {
                const follow = await ctx.db.follow.create({
                    data: {
                        follower: { connect: { id: followerId } },
                        following: { connect: { id: input.followingId } },
                    },
                });
                return follow;
            } catch (error) {
                // Handle unique constraint violation (already following)
                if (
                    error instanceof PrismaClientKnownRequestError &&
                    error.code === "P2002"
                ) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "You are already following this user",
                    });
                }
                if (
                    error instanceof PrismaClientKnownRequestError &&
                    error.code === "P2025"
                ) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "User not found",
                    });
                }
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to follow user",
                });
            }
        }),

    // Unfollow a user
    unfollowUser: protectedProcedure
        .input(
            z.object({
                followingId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const followerId = ctx.session.user.id;

            try {
                const result = await ctx.db.follow.deleteMany({
                    where: {
                        followerId,
                        followingId: input.followingId,
                    },
                });

                if (result.count === 0) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "You are not following this user",
                    });
                }

                return { success: true };
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error; // Re-throw TRPCError as is
                }

                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to unfollow user",
                });
            }
        }),
    // Get followers of a user
    getFollowers: publicProcedure
        .input(
            z.object({
                userId: z.string(),
                limit: z.number().min(1).max(100).default(10),
                cursor: z.string().optional(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const { userId, limit, cursor } = input;

            try {
                const followers = await ctx.db.follow.findMany({
                    where: {
                        followingId: userId,
                    },
                    select: {
                        id: true,
                        follower: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                        createdAt: true,
                    },
                    take: limit + 1,
                    cursor: cursor ? { id: cursor } : undefined,
                    orderBy: {
                        createdAt: "desc",
                    },
                });

                let nextCursor: string | undefined = undefined;
                if (followers.length > limit) {
                    const nextItem = followers.pop();
                    nextCursor = nextItem?.id;
                }

                return {
                    followers: followers.map((f) => ({
                        ...f.follower,
                        followedAt: f.createdAt,
                    })),
                    nextCursor,
                };
            } catch (error) {
                if (error instanceof PrismaClientKnownRequestError) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Database error occurred",
                    });
                }

                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to fetch followers",
                });
            }
        }),

    // Get users that a user is following
    getFollowing: publicProcedure
        .input(
            z.object({
                userId: z.string(),
                limit: z.number().min(1).max(100).default(10),
                cursor: z.string().optional(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const { userId, limit, cursor } = input;

            try {
                const following = await ctx.db.follow.findMany({
                    where: {
                        followerId: userId,
                    },
                    select: {
                        id: true,
                        following: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                        createdAt: true,
                    },
                    take: limit + 1,
                    cursor: cursor ? { id: cursor } : undefined,
                    orderBy: {
                        createdAt: "desc",
                    },
                });

                let nextCursor: string | undefined = undefined;
                if (following.length > limit) {
                    const nextItem = following.pop();
                    nextCursor = nextItem?.id;
                }

                return {
                    following: following.map((f) => ({
                        ...f.following,
                        followedAt: f.createdAt,
                    })),
                    nextCursor,
                };
            } catch (error) {
                if (error instanceof PrismaClientKnownRequestError) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Database error occurred",
                    });
                }

                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to fetch following users",
                });
            }
        }),

    // Check if user A follows user B
    checkIfFollowing: protectedProcedure
        .input(
            z.object({
                followingId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const followerId = ctx.session.user.id;

            try {
                const follow = await ctx.db.follow.findFirst({
                    where: {
                        followerId,
                        followingId: input.followingId,
                    },
                });

                return !!follow;
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to check follow status",
                });
            }
        }),

    // Get follower count
    getFollowerCount: publicProcedure
        .input(
            z.object({
                userId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            try {
                const count = await ctx.db.follow.count({
                    where: {
                        followingId: input.userId,
                    },
                });

                return count;
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to get follower count",
                });
            }
        }),

    // Get following count
    getFollowingCount: publicProcedure
        .input(
            z.object({
                userId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            try {
                const count = await ctx.db.follow.count({
                    where: {
                        followerId: input.userId,
                    },
                });

                return count;
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to get following count",
                });
            }
        }),
});
