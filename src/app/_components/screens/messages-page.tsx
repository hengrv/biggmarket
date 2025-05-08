"use client";

import { useState } from "react";
import { Loader2, Send, User } from "lucide-react";
import Image from "next/image";
import AppShell from "@/components/app-shell";
import { api } from "~/trpc/react";
import { formatDistanceToNow } from "date-fns";
import { Message } from "@prisma/client";

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const { data: currentUserId } =
    api.user.getCurrentlyAuthenticatedUser.useQuery();

  // If we have an active chat, show the chat detail view
  if (activeChat) {
    return (
      <ChatDetailView chatId={activeChat} onBack={() => setActiveChat(null)} />
    );
  }

  // Otherwise, show the chat list
  return <ChatListView onSelectChat={setActiveChat} />;
}

function ChatListView({
  onSelectChat,
}: {
  onSelectChat: (chatId: string) => void;
}) {
  const { data: currentUserId } =
    api.user.getCurrentlyAuthenticatedUser.useQuery();
  const { data: chats, isLoading } = api.message.getUserChats.useQuery(
    { userId: currentUserId ?? "" },
    { enabled: !!currentUserId, retry: false },
  );

  if (isLoading) {
    return (
      <AppShell activeScreen="feed" title="Messages">
        <div className="flex h-full items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <AppShell activeScreen="feed" title="Messages">
        <div className="p-4 text-center">
          <div className="mt-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <User className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="mt-4 text-lg font-semibold">No messages yet</h3>
          <p className="mt-2 text-sm text-muted">
            When you start conversations with other users, they&apos;ll appear here.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activeScreen="feed" title="Messages">
      <div className="p-4">
        <div className="space-y-3">
          {chats.map((chat) => {
            // Get the latest message
            const latestMessage = chat.messages[0];
            if (!latestMessage) return null;

            // Determine if the current user is the sender or receiver
            const isCurrentUserSender =
              latestMessage.senderId === currentUserId;
            const otherUserId = isCurrentUserSender
              ? latestMessage.receiverId
              : latestMessage.senderId;

            return (
              <ChatPreview
                key={chat.id}
                chatId={chat.id}
                otherUserId={otherUserId}
                latestMessage={latestMessage}
                onSelect={onSelectChat}
              />
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

function ChatPreview({
  chatId,
  otherUserId,
  latestMessage,
  onSelect,
}: {
  chatId: string;
  otherUserId: string;
  latestMessage: Message;
  onSelect: (chatId: string) => void;
}) {
  const { data: otherUser } = api.user.getProfile.useQuery(
    { userId: otherUserId },
    { enabled: !!otherUserId },
  );

  const { data: currentUserId } =
    api.user.getCurrentlyAuthenticatedUser.useQuery();
  const isCurrentUserSender = latestMessage.senderId === currentUserId;

  return (
    <div
      className="flex cursor-pointer items-center rounded-lg bg-secondary p-3 shadow-lg transition-colors hover:bg-[#2a2a2a]"
      onClick={() => onSelect(chatId)}
    >
      <div className="mr-3 h-12 w-12 overflow-hidden rounded-full">
        <Image
          src={
            otherUser?.image ?? "/profile-placeholder.svg?height=48&width=48"
          }
          alt={otherUser?.name ?? "User"}
          width={48}
          height={48}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="truncate font-semibold text-foreground">
            {otherUser?.name ?? "User"}
          </div>
          <div className="text-xs text-muted">
            {formatDistanceToNow(new Date(latestMessage.createdAt), {
              addSuffix: true,
            })}
          </div>
        </div>
        <div className="truncate text-xs text-muted">
          {isCurrentUserSender ? "You: " : ""}
          {latestMessage.message1 ?? ""}
        </div>
      </div>
    </div>
  );
}

function ChatDetailView({
  chatId,
  onBack,
}: {
  chatId: string;
  onBack: () => void;
}) {
  const { data: messages, isLoading: loadingMessages } =
    api.message.getChatMessages.useQuery(
      { chatId },
      { enabled: !!chatId, refetchInterval: 5000 }, // Refresh every 5 seconds
    );

  const utils = api.useUtils();

  const { data: currentUserId } =
    api.user.getCurrentlyAuthenticatedUser.useQuery();
  const [newMessage, setNewMessage] = useState("");
  const [otherUserId, setOtherUserId] = useState<string | null>(null);

  // Get the other user's ID from the first message
  if (messages && messages.length > 0 && !otherUserId) {
    const firstMessage = messages[0];
    setOtherUserId(
      firstMessage
        ? firstMessage?.senderId === currentUserId
          ? firstMessage.receiverId
          : firstMessage.senderId
        : "",
    );
  }

  const { data: otherUser } = api.user.getProfile.useQuery(
    { userId: otherUserId ?? "" },
    { enabled: !!otherUserId },
  );

  const sendMessageMutation = api.message.sendMessage.useMutation({
    onSuccess: async () => {
      setNewMessage("");

      await utils.message.getChatMessages.invalidate({ chatId });
      await utils.message.getUserChats.invalidate({
        userId: currentUserId ?? "",
      });
    },
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUserId || !otherUserId) return;

    sendMessageMutation.mutate({
      senderId: currentUserId,
      receiverId: otherUserId,
      message: newMessage,
    });
  };

  return (
    <AppShell
      title={otherUser?.name ?? "Chat"}
      showBackButton={true}
      onBack={onBack}
      activeScreen="feed"
      rightContent={
        <div className="h-8 w-8 overflow-hidden rounded-full">
          <Image
            src={
              otherUser?.image ?? "/profile-placeholder.svg?height=32&width=32"
            }
            alt={otherUser?.name ?? "User"}
            width={32}
            height={32}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      }
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-3 overflow-auto p-4">
          {loadingMessages ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : messages && messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${msg.senderId === currentUserId
                      ? "bg-bm-green text-bm-black"
                      : "bg-bm-white/60 text-bm-black"
                    }`}
                >
                  <p className="text-sm">{msg.message1}</p>
                  <div
                    className={`mt-1 text-xs ${msg.senderId === currentUserId
                        ? "text-bm-black/70"
                        : "text-muted"
                      } text-right`}
                  >
                    {formatDistanceToNow(new Date(msg.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-sm text-muted">No messages yet</p>
              <p className="text-xs text-muted">
                Start the conversation by sending a message below
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-background bg-secondary p-3">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="mx-2 flex-1 rounded-full bg-background px-4 py-2 text-foreground outline-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              className={`p-2 ${newMessage.trim() ? "text-primary" : "text-muted"}`}
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
