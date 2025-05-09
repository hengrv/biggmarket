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
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [viewingAccount, setViewingAccount] = useState<FeedUser | null>(null)
  const [showPostCreator, setShowPostCreator] = useState(false)
  const [newPostText, setNewPostText] = useState("")
  const [newPostImage, setNewPostImage] = useState<string | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const [feedItems, setFeedItems] = useState<FeedItem[]>([
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        username: "@sarahj",
        image: "/placeholder.svg?height=48&width=48",
      },
      content: "Just listed a vintage record player! Anyone interested in swapping for some houseplants?",
      time: "2h ago",
      likes: 12,
      comments: 3,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 2,
      user: {
        name: "Mike Peters",
        username: "@mikeswaps",
        image: "/placeholder.svg?height=48&width=48",
      },
      content: "Successfully swapped my old camera for this amazing guitar! Love this community!",
      time: "5h ago",
      likes: 24,
      comments: 7,
      image: "/placeholder.svg?height=300&width=400",
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
      `/placeholder.svg?height=${300 + Math.floor(Math.random() * 100)}&width=${400 + Math.floor(Math.random() * 100)}`,
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
          image: "/placeholder.svg?height=48&width=48",
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            {activeTab === "feed" && (
              <button
                className="bg-secondary rounded-full p-2 hover:bg-[#2a2a2a] transition-colors"
                onClick={handleAddPost}
              >
                <Plus className="w-5 h-5 text-[#c1ff72]" />
              </button>
            )}
          </div>
        </div>

        <div className="flex mb-4 bg-secondary rounded-lg p-1 shadow-lg">
          <button
            className={`flex-1 py-2 text-sm rounded-md ${activeTab === "feed" ? "bg-[#c1ff72] text-black font-medium" : "text-muted"}`}
            onClick={() => setActiveTab("feed")}
          >
            Feed
          </button>
          <button
            className={`flex-1 py-2 text-sm rounded-md ${activeTab === "messages" ? "bg-[#c1ff72] text-black font-medium" : "text-muted"}`}
            onClick={() => setActiveTab("messages")}
          >
            Messages
          </button>
        </div>

        {showPostCreator && (
          <div className="bg-secondary rounded-lg overflow-hidden shadow-lg mb-4 animate-in fade-in duration-300">
            <div className="p-3 flex items-center justify-between border-b border-[#3a3a3a]">
              <h3 className="text-foreground font-semibold">Create Post</h3>
              <button className="rounded-full p-1 hover:bg-[#3a3a3a]" onClick={handleClosePostCreator}>
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>

            <div className="p-3">
              <div className="flex items-start mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Your profile"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <textarea
                  placeholder="What's on your mind?"
                  className="flex-1 bg-background text-foreground rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-[#c1ff72] resize-none h-24"
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                ></textarea>
              </div>

              {newPostImage && (
                <div className="relative mb-3">
                  <Image
                    src={newPostImage || "/placeholder.svg"}
                    alt="Post image"
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
                    onClick={() => setNewPostImage(null)}
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button className="bg-background rounded-full p-2 text-[#c1ff72]" onClick={handleAddImage}>
                  <Camera className="w-5 h-5" />
                </button>

                <button
                  className={`px-4 py-2 rounded-full font-medium flex items-center ${
                    newPostText.trim() ? "bg-[#c1ff72] text-black" : "bg-[#3a3a3a] text-muted"
                  }`}
                  onClick={handleSubmitPost}
                  disabled={!newPostText.trim() || isPosting}
                >
                  {isPosting ? (
                    <>
                      <span className="mr-2 h-4 w-4 rounded-full border-2 border-b-transparent border-white animate-spin"></span>
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
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
  feedItems: FeedItem[]
  setViewingAccount: (account: FeedUser) => void
}) {
  return (
    <div className="space-y-4">
      {feedItems.map((item) => (
        <div key={item.id} className="bg-secondary rounded-lg overflow-hidden shadow-lg">
          <div className="p-3 flex items-center">
            <div
              className="w-10 h-10 rounded-full overflow-hidden mr-3 cursor-pointer"
              onClick={() => setViewingAccount(item.user)}
            >
              <Image
                src={item.user.image || "/placeholder.svg"}
                alt={item.user.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div
                className="text-foreground font-semibold cursor-pointer"
                onClick={() => setViewingAccount(item.user)}
              >
                {item.user.name}
              </div>
              <div className="text-muted text-xs flex items-center">
                <span>{item.user.username}</span>
                <span className="mx-1">•</span>
                <span>{item.time}</span>
              </div>
            </div>
          </div>

          <div className="px-3 pb-2">
            <p className="text-foreground text-sm mb-3">{item.content}</p>
          </div>

          {item.image && (
            <Image
              src={item.image || "/placeholder.svg"}
              alt="Post image"
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />
          )}

          <div className="p-3 flex items-center justify-between border-t border-background">
            <button className="text-muted text-xs flex items-center">♥ {item.likes} Likes</button>
            <button className="text-muted text-xs flex items-center">
              <MessageSquare className="w-3 h-3 mr-1" /> {item.comments} Comments
            </button>
            <button className="text-muted text-xs flex items-center">Share</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function MessagesContent({ setActiveChat }: { setActiveChat: (chat: Chat) => void }) {
  const chats: Chat[] = [
    {
      id: 1,
      user: {
        name: "Emily Davis",
        image: "/placeholder.svg?height=48&width=48",
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
        image: "/placeholder.svg?height=48&width=48",
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
        image: "/placeholder.svg?height=48&width=48",
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
          className="flex items-center bg-secondary p-3 rounded-lg shadow-lg cursor-pointer"
          onClick={() => setActiveChat(chat)}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
              <Image
                src={chat.user.image || "/placeholder.svg"}
                alt={chat.user.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            {chat.user.online && (
              <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-secondary"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <div className="text-foreground font-semibold truncate">{chat.user.name}</div>
              <div className="text-muted text-xs">{chat.time}</div>
            </div>
            <div className="text-muted text-xs truncate">{chat.lastMessage}</div>
          </div>

          {chat.unread > 0 && (
            <div className="ml-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <span className="text-black text-xs font-bold">{chat.unread}</span>
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
  activeChat: Chat
  setActiveChat: (chat: Chat | null) => void
}) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
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
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={activeChat.user.image || "/placeholder.svg"}
              alt={activeChat.user.name}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          {activeChat.user.online && (
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-secondary"></div>
          )}
        </div>
      }
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === "me"
                    ? "bg-primary text-black rounded-tr-none"
                    : "bg-secondary text-foreground rounded-tl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <div className={`text-xs mt-1 ${msg.sender === "me" ? "text-black/70" : "text-muted"} text-right`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-secondary border-t border-background">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-background text-foreground rounded-full px-4 py-2 mx-2 outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className={`p-2 ${message.trim() ? "text-primary" : "text-muted"}`}
              onClick={handleSend}
              disabled={!message.trim()}
            >
              <Send className="w-5 h-5" />
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
  account: FeedUser
  setViewingAccount: (account: FeedUser | null) => void
}) {
  const [activeTab, setActiveTab] = useState<"items" | "about">("items")
  const [isFollowing, setIsFollowing] = useState(false)

  const items = [
    {
      id: 1,
      name: "Vintage Camera",
      image: "/placeholder.svg?height=150&width=150",
      condition: "Good",
    },
    {
      id: 2,
      name: "Leather Boots",
      image: "/placeholder.svg?height=150&width=150",
      condition: "Like New",
    },
    {
      id: 3,
      name: "Retro Lamp",
      image: "/placeholder.svg?height=150&width=150",
      condition: "Fair",
    },
    {
      id: 4,
      name: "Vinyl Records",
      image: "/placeholder.svg?height=150&width=150",
      condition: "Good",
    },
  ]

  return (
    <AppShell title="Profile" showBackButton={true} onBack={() => setViewingAccount(null)} activeScreen="feed">
      <div className="p-4">
        <div className="bg-secondary rounded-lg overflow-hidden mb-4 shadow-lg">
          <div className="h-24 bg-gradient-to-r from-background to-[#2a2a2a]"></div>

          <div className="px-4 pb-4 relative">
            <div className="absolute -top-10 left-4 w-20 h-20 rounded-full overflow-hidden border-4 border-secondary">
              <Image
                src={account.image || "/placeholder.svg"}
                alt={account.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex justify-end pt-2 mb-10">
              <button
                className="bg-background text-foreground rounded-full px-3 py-1 text-xs flex items-center mr-2"
                onClick={() => {}}
              >
                <MessageSquare className="w-3 h-3 mr-1" />
                Message
              </button>

              <button
                className={`${isFollowing ? "bg-background text-foreground border border-[#3a3a3a]" : "bg-primary text-black"} rounded-full px-3 py-1 text-xs flex items-center`}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? (
                  "Following"
                ) : (
                  <>
                    <UserPlus className="w-3 h-3 mr-1" /> Follow
                  </>
                )}
              </button>
            </div>

            <h3 className="text-foreground text-lg font-bold">{account.name}</h3>
            <div className="text-muted text-xs mb-2">{account.username}</div>

            <p className="text-foreground text-sm mb-3">
              Passionate about sustainable fashion and reducing waste. Love to swap and give items a second life!
            </p>

            <div className="flex space-x-4 text-muted text-xs">
              <div>
                <span className="text-foreground font-semibold">24</span> Following
              </div>
              <div>
                <span className="text-foreground font-semibold">118</span> Followers
              </div>
              <div>
                <span className="text-foreground font-semibold">42</span> Swaps
              </div>
            </div>
          </div>
        </div>

        <div className="flex mb-4 bg-secondary rounded-lg p-1 shadow-lg">
          <button
            className={`flex-1 py-2 text-sm rounded-md ${activeTab === "items" ? "bg-background text-primary" : "text-muted"}`}
            onClick={() => setActiveTab("items")}
          >
            Items
          </button>
          <button
            className={`flex-1 py-2 text-sm rounded-md ${activeTab === "about" ? "bg-background text-primary" : "text-muted"}`}
            onClick={() => setActiveTab("about")}
          >
            About
          </button>
        </div>

        {activeTab === "items" ? (
          <div className="grid grid-cols-2 gap-3">
            {items.map((item) => (
              <div key={item.id} className="bg-secondary rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={150}
                  height={150}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2">
                  <div className="text-foreground text-sm font-semibold">{item.name}</div>
                  <div className="text-muted text-xs">Condition: {item.condition}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-secondary rounded-lg p-4 shadow-lg">
            <div className="space-y-4">
              <div>
                <h4 className="text-muted text-xs mb-1">Bio</h4>
                <p className="text-foreground text-sm">
                  Passionate about sustainable fashion and reducing waste. Love to swap and give items a second life!
                </p>
              </div>

              <div>
                <h4 className="text-muted text-xs mb-1">Location</h4>
                <p className="text-foreground text-sm">London, UK</p>
              </div>

              <div>
                <h4 className="text-muted text-xs mb-1">Member Since</h4>
                <p className="text-foreground text-sm">March 2022</p>
              </div>

              <div>
                <h4 className="text-muted text-xs mb-1">Interests</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {["Vintage", "Books", "Fashion", "Vinyl", "Plants"].map((tag) => (
                    <span key={tag} className="bg-background text-muted rounded-full px-3 py-1 text-xs">
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

