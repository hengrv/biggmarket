import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const userProfileInput = z.object({
    image: z.string().url("Must be a valid URL").optional()
  });

  
export const userRouter = createTRPCRouter({
    // * Get profile
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        const profile = await ctx.db.user.findUnique({
            where: { id: ctx.session.user.id },
        });

        return profile ?? null;
    }),

    // * Delete profile
    deleteProfile: protectedProcedure.mutation(async ({ ctx }) => {
        const profile = await ctx.db.user.delete({
            where: { id: ctx.session.user.id },
        });
    
        return profile ?? null;
    }),

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
    })

    // ! TODO
    
});



