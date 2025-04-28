import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const messageRouter = createTRPCRouter({
  sendMessage: protectedProcedure
    .input(
      z.object({
        senderId: z.string(),
        receiverId: z.string(),
        message: z.string().min(1, "Message cannot be empty"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const sender = await ctx.db.user.findUnique({
        where: { id: input.senderId },
      });
      const receiver = await ctx.db.user.findUnique({
        where: { id: input.receiverId },
      });

      if (!sender || !receiver) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sender or receiver not found",
        });
      }

      let chat = await ctx.db.chat.findFirst({
        where: {
          messages: {
            some: {
              senderId: input.senderId,
              receiverId: input.receiverId,
            },
          },
        },
      });

      if (!chat) {
        chat = await ctx.db.chat.create({
          data: {
            createdAt: new Date(),
          },
        });
      }

      const newMessage = await ctx.db.message.create({
        data: {
          senderId: input.senderId,
          receiverId: input.receiverId,
          message1: input.message,
          chatId: chat.id,
          createdAt: new Date(),
        },
      });

      return newMessage;
    }),

  getChatMessages: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.message.findMany({
        where: { chatId: input.chatId },
        orderBy: { createdAt: "asc" },
      });

      if (!messages.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No messages found in this chat",
        });
      }

      return messages;
    }),

  getUserChats: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const chats = await ctx.db.chat.findMany({
        where: {
          messages: {
            some: {
              OR: [{ senderId: input.userId }, { receiverId: input.userId }],
            },
          },
        },
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1, // Fetch only the latest message
          },
        },
      });

      if (!chats.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No chats found for this user",
        });
      }

      return chats;
    }),

  deleteMessage: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.message.findUnique({
        where: { id: input.messageId },
      });

      if (!message) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Message not found",
        });
      }

      await ctx.db.message.delete({ where: { id: input.messageId } });

      return { message: "Message deleted successfully" };
    }),
});
