import { z } from "zod";
import { TRPCError } from "@trpc/server";
import geolib from "geolib";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const distanceInput = z.object({
  latitude: z.number().nullish(), // user's latitude
  longitude: z.number().nullish(), // user's longitude
});

export const algoRouter = createTRPCRouter({
  getItemsByDistance: protectedProcedure
    .input(distanceInput)
    .query(async ({ ctx, input }) => {
      let { latitude: userLatitude, longitude: userLongitude } = input;

      userLatitude = userLatitude !== null ? userLatitude : undefined;
      userLongitude = userLongitude !== null ? userLongitude : undefined;

      if (!userLatitude && !userLongitude) {
        return [];
      }

      const userId = ctx.session.user.id;

      // Get items from DB (each item's owner has a location)
      const items = await ctx.db.item.findMany({
        where: {
          userId: { not: userId },
          status: "AVAILABLE",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              location: true,
            },
          },
        },
      });
      // Map each item to include a distance field computed from user's location
      const itemsWithDistance = items.map((item) => {
        const itemLocation = item.user?.location;
        if (itemLocation?.latitude && itemLocation?.longitude) {
          const distance = geolib.getDistance(
            {
              latitude: userLatitude!,
              longitude: userLongitude!,
            },
            {
              latitude: Number(itemLocation.latitude),
              longitude: Number(itemLocation.longitude),
            },
          );
          return { ...item, distance };
        }
        return { ...item, distance: Number.MAX_SAFE_INTEGER };
      });

      // Order the items by distance (lowest first)
      itemsWithDistance.sort((a, b) => a.distance - b.distance);

      return itemsWithDistance;
    }),
});
