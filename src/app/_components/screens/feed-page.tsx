"use client"

import { useState } from "react"
import { MessageSquare, Plus, Send, UserPlus, X, Camera } from "lucide-react"
import Image from "next/image"
import AppShell from "@/components/app-shell"


interface FeedUser {
  name: string
  username: string
  image: string
}

interface FeedItem {
  id: number
  user: FeedUser
  content: string
  time: string
  likes: number
  comments: number
  image?: string
}

interface ChatUser {
  name: string
  image: string
  online: boolean
}

interface Chat {
  id: number
  user: ChatUser
  lastMessage: string
  time: string
  unread: number
}

interface Message {
  id: number
  sender: "me" | "them"
  text: string
  time: string
}

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<"feed" | "messages">("feed")
  const [activeChat, setActiveChat] = useState<any | null>(null)
  const [viewingAccount, setViewingAccount] = useState<any | null>(null)
  const [showPostCreator, setShowPostCreator] = useState(false)
  const [newPostText, setNewPostText] = useState("")
  const [newPostImage, setNewPostImage] = useState<string | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const [feedItems, setFeedItems] = useState<any[]>([
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        username: "@sarahj",
        image: "/profile-placeholder.svg?height=48&width=48",
      },
      content: "Just listed a vintage record player! Anyone interested in swapping for some houseplants?",
      time: "2h ago",
      likes: 12,
      comments: 3,
      image: "/generic-placeholder.svg?height=300&width=400",
    },
    {
      id: 2,
      user: {
        name: "Mike Peters",
        username: "@mikeswaps",
        image: "/profile-placeholder.svg?height=48&width=48",
      },
      content: "Successfully swapped my old camera for this amazing guitar! Love this community!",
      time: "5h ago",
      likes: 24,
      comments: 7,
      image: "/generic-placeholder.svg?height=300&width=400",
    },
  ])

  const handleAddPost = () => {
    setShowPostCreator(true)
  }

  const handleClosePostCreator = () => {
    setShowPostCreator(false)
    setNewPostText("")
    setNewPostImage(null)
  }

  const handleAddImage = () => {
    setNewPostImage(
      `/item-placeholder.svg?height=${300 + Math.floor(Math.random() * 100)}&width=${400 + Math.floor(Math.random() * 100)}`,
    )
  }

  const handleSubmitPost = () => {
    if (!newPostText.trim()) return

    setIsPosting(true)

    setTimeout(() => {
      const newPost: FeedItem = {
        id: Date.now(),
        user: {
          name: "John",
          username: "@johnswapper",
          image: "/profile-placeholder.svg?height=48&width=48",
        },
        content: newPostText,
        time: "Just now",
        likes: 0,
        comments: 0,
      }

      if (newPostImage) {
        newPost.image = newPostImage
      }

      setFeedItems([newPost, ...feedItems])
      setIsPosting(false)
      handleClosePostCreator()
    }, 1000)
  }

  if (activeChat) {
    return <ChatScreen activeChat={activeChat} setActiveChat={setActiveChat} />
  }

  if (viewingAccount) {
    return <ViewAccountScreen account={viewingAccount} setViewingAccount={setViewingAccount} />
  }

  return (
    <AppShell activeScreen="feed" title="Feed">
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex space-x-2">
            {activeTab === "feed" && (
              <button
                className="rounded-full bg-secondary p-2 transition-colors hover:bg-[#2a2a2a]"
                onClick={handleAddPost}
              >
                <Plus className="h-5 w-5 text-[#c1ff72]" />
              </button>
            )}
          </div>
        </div>

        <div className="mb-4 flex rounded-lg bg-secondary p-1 shadow-lg">
          <button
            className={`flex-1 rounded-md py-2 text-sm ${activeTab === "feed" ? "bg-[#c1ff72] font-medium text-black" : "text-muted"}`}
            onClick={() => setActiveTab("feed")}
          >
            Feed
          </button>
          <button
            className={`flex-1 rounded-md py-2 text-sm ${activeTab === "messages" ? "bg-[#c1ff72] font-medium text-black" : "text-muted"}`}
            onClick={() => setActiveTab("messages")}
          >
            Messages
          </button>
        </div>

        {showPostCreator && (
          <div className="mb-4 overflow-hidden rounded-lg bg-secondary shadow-lg duration-300 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#3a3a3a] p-3">
              <h3 className="font-semibold text-foreground">Create Post</h3>
              <button className="rounded-full p-1 hover:bg-[#3a3a3a]" onClick={handleClosePostCreator}>
                <X className="h-5 w-5 text-muted" />
              </button>
            </div>

            <div className="p-3">
              <div className="mb-3 flex items-start">
                <div className="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src="/profile-placeholder.svg?height=40&width=40"
                    alt="Your profile"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
                <textarea
                  placeholder="What's on your mind?"
                  className="h-24 flex-1 resize-none rounded-lg border border-[#3a3a3a] bg-background p-3 text-foreground outline-none focus:border-[#c1ff72]"
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                ></textarea>
              </div>

              {newPostImage && (
                <div className="relative mb-3">
                  <Image
                    src={newPostImage || "/generic-placeholder.svg"}
                    alt="Post image"
                    width={400}
                    height={300}
                    className="h-48 w-full rounded-lg object-cover"
                    draggable={false}
                  />
                  <button
                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1"
                    onClick={() => setNewPostImage(null)}
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button className="rounded-full bg-background p-2 text-[#c1ff72]" onClick={handleAddImage}>
                  <Camera className="h-5 w-5" />
                </button>

                <button
                  className={`flex items-center rounded-full px-4 py-2 font-medium ${newPostText.trim() ? "bg-[#c1ff72] text-black" : "bg-[#3a3a3a] text-muted"
                    }`}
                  onClick={handleSubmitPost}
                  disabled={!newPostText.trim() || isPosting}
                >
                  {isPosting ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent"></span>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "feed" ? (
          <FeedContent feedItems={feedItems} setViewingAccount={setViewingAccount} />
        ) : (
          <MessagesContent setActiveChat={setActiveChat} />
        )}
      </div>
    </AppShell>
  )
}

function FeedContent({
  feedItems,
  setViewingAccount,
}: {
  feedItems: any[]
  setViewingAccount: (account: any) => void
}) {
  return (
    <div className="space-y-4">
      {feedItems.map((item) => (
        <div key={item.id} className="overflow-hidden rounded-lg bg-secondary shadow-lg">
          <div className="flex items-center p-3">
            <div
              className="mr-3 h-10 w-10 cursor-pointer overflow-hidden rounded-full"
              onClick={() => setViewingAccount(item.user)}
            >
              <Image
                src={item.user.image || "/profile-placeholder.svg"}
                alt={item.user.name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
            <div className="flex-1">
              <div
                className="cursor-pointer font-semibold text-foreground"
                onClick={() => setViewingAccount(item.user)}
              >
                {item.user.name}
              </div>
              <div className="flex items-center text-xs text-muted">
                <span>{item.user.username}</span>
                <span className="mx-1">•</span>
                <span>{item.time}</span>
              </div>
            </div>
          </div>

          <div className="px-3 pb-2">
            <p className="mb-3 text-sm text-foreground">{item.content}</p>
          </div>

          {item.image && (
            <Image
              src={item.image || "/item-placeholder.svg"}
              alt="Post image"
              width={400}
              height={300}
              className="h-48 w-full object-cover"
              draggable={false}
            />
          )}

          <div className="flex items-center justify-between border-t border-background p-3">
            <button className="flex items-center text-xs text-muted">♥ {item.likes} Likes</button>
            <button className="flex items-center text-xs text-muted">
              <MessageSquare className="mr-1 h-3 w-3" /> {item.comments} Comments
            </button>
            <button className="flex items-center text-xs text-muted">Share</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function MessagesContent({
  setActiveChat,
}: {
  setActiveChat: (chat: any) => void
}) {
  const chats = [
    {
      id: 1,
      user: {
        name: "Emily Davis",
        image: "/profile-placeholder.svg?height=48&width=48",
        online: true,
      },
      lastMessage: "Is the vintage lamp still available?",
      time: "12:45 PM",
      unread: 2,
    },
    {
      id: 2,
      user: {
        name: "David Kim",
        image: "/profile-placeholder.svg?height=48&width=48",
        online: false,
      },
      lastMessage: "Thanks for the swap! The book is perfect.",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: 3,
      user: {
        name: "Sophia Lee",
        image: "/profile-placeholder.svg?height=48&width=48",
        online: true,
      },
      lastMessage: "Would you be interested in trading for a plant?",
      time: "2 days ago",
      unread: 0,
    },
  ]

  return (
    <div className="space-y-3">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="flex cursor-pointer items-center rounded-lg bg-secondary p-3 shadow-lg"
          onClick={() => setActiveChat(chat)}
        >
          <div className="relative">
            <div className="mr-3 h-12 w-12 overflow-hidden rounded-full">
              <Image
                src={chat.user.image || "/profile-placeholder.svg"}
                alt={chat.user.name}
                width={48}
                height={48}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
            {chat.user.online && (
              <div className="absolute bottom-0 right-3 h-3 w-3 rounded-full border-2 border-secondary bg-green-500"></div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <div className="truncate font-semibold text-foreground">{chat.user.name}</div>
              <div className="text-xs text-muted">{chat.time}</div>
            </div>
            <div className="truncate text-xs text-muted">{chat.lastMessage}</div>
          </div>

          {chat.unread > 0 && (
            <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
              <span className="text-xs font-bold text-black">{chat.unread}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ChatScreen({
  activeChat,
  setActiveChat,
}: {
  activeChat: any
  setActiveChat: (chat: any | null) => void
}) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "them",
      text: "Hi there! I'm interested in your vintage lamp.",
      time: "12:30 PM",
    },
    {
      id: 2,
      sender: "them",
      text: "Is it still available?",
      time: "12:31 PM",
    },
    {
      id: 3,
      sender: "me",
      text: "Hey! Yes, it's still available. It's in great condition.",
      time: "12:40 PM",
    },
    {
      id: 4,
      sender: "them",
      text: "Great! Would you be interested in swapping for a set of vintage books?",
      time: "12:42 PM",
    },
    {
      id: 5,
      sender: "them",
      text: "I have a collection of classics from the 1960s.",
      time: "12:43 PM",
    },
  ])

  const handleSend = () => {
    if (!message.trim()) return

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "me",
        text: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ])
    setMessage("")

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "them",
          text: "That sounds great! When can we meet for the swap?",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ])
    }, 2000)
  }

  return (
    <AppShell
      title={activeChat.user.name}
      showBackButton={true}
      onBack={() => setActiveChat(null)}
      activeScreen="feed"
      rightContent={
        <div className="relative">
          <div className="h-8 w-8 overflow-hidden rounded-full">
            <Image
              src={activeChat.user.image || "/profile-placeholder.svg"}
              alt={activeChat.user.name}
              width={32}
              height={32}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
          {activeChat.user.online && (
            <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-secondary bg-green-500"></div>
          )}
        </div>
      }
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-3 overflow-auto p-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${msg.sender === "me"
                  ? "rounded-tr-none bg-primary text-black"
                  : "rounded-tl-none bg-secondary text-foreground"
                  }`}
              >
                <p className="text-sm">{msg.text}</p>
                <div className={`mt-1 text-xs ${msg.sender === "me" ? "text-black/70" : "text-muted"} text-right`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-background bg-secondary p-3">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="mx-2 flex-1 rounded-full bg-background px-4 py-2 text-foreground outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className={`p-2 ${message.trim() ? "text-primary" : "text-muted"}`}
              onClick={handleSend}
              disabled={!message.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function ViewAccountScreen({
  account,
  setViewingAccount,
}: {
  account: any
  setViewingAccount: (account: any | null) => void
}) {
  const [activeTab, setActiveTab] = useState("items")
  const [isFollowing, setIsFollowing] = useState(false)

  const items = [
    {
      id: 1,
      name: "Vintage Camera",
      image: "/item-placeholder.svg?height=150&width=150",
      condition: "Good",
    },
    {
      id: 2,
      name: "Leather Boots",
      image: "/item-placeholder.svg?height=150&width=150",
      condition: "Like New",
    },
    {
      id: 3,
      name: "Retro Lamp",
      image: "/item-placeholder.svg?height=150&width=150",
      condition: "Fair",
    },
    {
      id: 4,
      name: "Vinyl Records",
      image: "/item-placeholder.svg?height=150&width=150",
      condition: "Good",
    },
  ]

  return (
    <AppShell title="Profile" showBackButton={true} onBack={() => setViewingAccount(null)} activeScreen="feed">
      <div className="p-4">
        <div className="mb-4 overflow-hidden rounded-lg bg-secondary shadow-lg">
          <div className="h-24 bg-gradient-to-r from-background to-[#2a2a2a]"></div>

          <div className="relative px-4 pb-4">
            <div className="absolute -top-10 left-4 h-20 w-20 overflow-hidden rounded-full border-4 border-secondary">
              <Image
                src={account.image || "/profile-placeholder.svg"}
                alt={account.name}
                width={80}
                height={80}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>

            <div className="mb-10 flex justify-end pt-2">
              <button className="mr-2 flex items-center rounded-full bg-background px-3 py-1 text-xs text-foreground">
                <MessageSquare className="mr-1 h-3 w-3" />
                Message
              </button>

              <button
                className={`${isFollowing ? "border border-[#3a3a3a] bg-background text-foreground" : "bg-primary text-black"} flex items-center rounded-full px-3 py-1 text-xs`}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? (
                  "Following"
                ) : (
                  <>
                    <UserPlus className="mr-1 h-3 w-3" /> Follow
                  </>
                )}
              </button>
            </div>

            <h3 className="text-lg font-bold text-foreground">{account.name}</h3>
            <div className="mb-2 text-xs text-muted">{account.username}</div>

            <p className="mb-3 text-sm text-foreground">
              Passionate about sustainable fashion and reducing waste. Love to swap and give items a second life!
            </p>

            <div className="flex space-x-4 text-xs text-muted">
              <div>
                <span className="font-semibold text-foreground">24</span> Following
              </div>
              <div>
                <span className="font-semibold text-foreground">118</span> Followers
              </div>
              <div>
                <span className="font-semibold text-foreground">42</span> Swaps
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex rounded-lg bg-secondary p-1 shadow-lg">
          <button
            className={`flex-1 rounded-md py-2 text-sm ${activeTab === "items" ? "bg-background text-primary" : "text-muted"}`}
            onClick={() => setActiveTab("items")}
          >
            Items
          </button>
          <button
            className={`flex-1 rounded-md py-2 text-sm ${activeTab === "about" ? "bg-background text-primary" : "text-muted"}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </div>

        {activeTab === "items" ? (
          <div className="grid grid-cols-2 gap-3">
            {items.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-lg bg-secondary shadow-lg">
                <Image
                  src={item.image || "/item-placeholder.svg"}
                  alt={item.name}
                  width={150}
                  height={150}
                  className="h-32 w-full object-cover"
                  draggable={false}
                />
                <div className="p-2">
                  <div className="text-sm font-semibold text-foreground">{item.name}</div>
                  <div className="text-xs text-muted">Condition: {item.condition}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-secondary p-4 shadow-lg">
            <div className="space-y-4">
              <div>
                <h4 className="mb-1 text-xs text-muted">Bio</h4>
                <p className="text-sm text-foreground">
                  Passionate about sustainable fashion and reducing waste. Love to swap and give items a second life!
                </p>
              </div>

              <div>
                <h4 className="mb-1 text-xs text-muted">Location</h4>
                <p className="text-sm text-foreground">London, UK</p>
              </div>

              <div>
                <h4 className="mb-1 text-xs text-muted">Member Since</h4>
                <p className="text-sm text-foreground">March 2022</p>
              </div>

              <div>
                <h4 className="mb-1 text-xs text-muted">Interests</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {["Vintage", "Books", "Fashion", "Vinyl", "Plants"].map((tag) => (
                    <span key={tag} className="rounded-full bg-background px-3 py-1 text-xs text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

