"use client"

import { useState } from "react"
import { UserPlus, Heart, Package, User, ChevronRight, Camera, Star, Pencil } from "lucide-react"
import Image from "next/image"
import AppShell from "@/components/app-shell"
import { useRouter } from "next/navigation"
export default function ProfilePage() {
  const router = useRouter()
  const [profileTab, setProfileTab] = useState("gear")
  const [activeSubScreen, setActiveSubScreen] = useState<string | null>(null)

  if (activeSubScreen === "edit-profile") {
    return <EditProfileScreen setActiveSubScreen={setActiveSubScreen} />
  }

  if (activeSubScreen === "following") {
    return <FollowingScreen setActiveSubScreen={setActiveSubScreen} />
  }

  if (activeSubScreen === "followers") {
    return <FollowersScreen setActiveSubScreen={setActiveSubScreen} />
  }

  if (activeSubScreen === "swaps") {
    return <SwapsHistoryScreen setActiveSubScreen={setActiveSubScreen} />
  }

  const userItems = [
    {
      id: 1,
      name: "Vintage Record Player",
      image: "/placeholder.svg?height=150&width=150",
      likes: 12,
    },
    {
      id: 2,
      name: "Leather Jacket",
      image: "/placeholder.svg?height=150&width=150",
      likes: 8,
    },
    {
      id: 3,
      name: "Polaroid Camera",
      image: "/placeholder.svg?height=150&width=150",
      likes: 15,
    },
  ]

  const userReviews = [
    {
      id: 1,
      reviewer: {
        name: "Sarah Johnson",
        image: "/placeholder.svg?height=48&width=48",
      },
      rating: 5,
      text: "Great experience swapping with John! The item was exactly as described and the exchange was smooth.",
      date: "2 weeks ago",
      item: "Vintage Record Player",
    },
    {
      id: 2,
      reviewer: {
        name: "Mike Peters",
        image: "/placeholder.svg?height=48&width=48",
      },
      rating: 4,
      text: "Good communication and fair trade. Would swap with again!",
      date: "1 month ago",
      item: "Leather Jacket",
    },
    {
      id: 3,
      reviewer: {
        name: "Emily Davis",
        image: "/placeholder.svg?height=48&width=48",
      },
      rating: 5,
      text: "John is a reliable swapper. Item was in perfect condition and he was very responsive.",
      date: "2 months ago",
      item: "Polaroid Camera",
    },
  ]

  return (
    <AppShell activeScreen="profile" title="Profile">
      <div className="p-4">
        <div className="bg-secondary rounded-lg p-4 mb-6 shadow-lg">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#c1ff72] mr-4">
              <Image
                src="/placeholder.svg?height=64&width=64"
                alt="Profile"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-foreground text-lg font-bold">John</h3>
              <div className="text-muted text-xs">@johnswapper</div>
              <div className="text-muted text-xs mt-1">The Toon</div>
            </div>

            <button
              className="bg-[#c1ff72] text-black rounded-full px-3 py-1 text-xs font-medium flex items-center"
              onClick={() => setActiveSubScreen("edit-profile")}
            >
              <Pencil className="w-3 h-3 mr-1" />
              Edit Profile
            </button>
          </div>

          <div className="flex justify-around mt-4 pt-4 border-t border-background">
            <button className="flex flex-col items-center" onClick={() => setActiveSubScreen("swaps")}>
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center mb-1">
                <Package className="w-4 h-4 text-[#c1ff72]" />
              </div>
              <span className="text-foreground text-xs font-medium">12 Swaps</span>
            </button>

            <button className="flex flex-col items-center" onClick={() => setActiveSubScreen("following")}>
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center mb-1">
                <User className="w-4 h-4 text-[#c1ff72]" />
              </div>
              <span className="text-foreground text-xs font-medium">24 Following</span>
            </button>

            <button className="flex flex-col items-center" onClick={() => setActiveSubScreen("followers")}>
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center mb-1">
                <UserPlus className="w-4 h-4 text-[#c1ff72]" />
              </div>
              <span className="text-foreground text-xs font-medium">18 Followers</span>
            </button>
          </div>
        </div>

        <div className="flex mb-4 bg-secondary rounded-lg p-1 shadow-lg">
          <button
            className={`flex-1 py-2 text-sm rounded-md ${profileTab === "gear" ? "bg-[#c1ff72] text-black font-medium" : "text-muted"}`}
            onClick={() => setProfileTab("gear")}
          >
            My Gear
          </button>
          <button
            className={`flex-1 py-2 text-sm rounded-md ${profileTab === "reviews" ? "bg-[#c1ff72] text-black font-medium" : "text-muted"}`}
            onClick={() => setProfileTab("reviews")}
          >
            Reviews
          </button>
        </div>

        {profileTab === "gear" ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-foreground font-semibold">Your Items</h3>
              <button className="text-[#c1ff72] text-xs flex items-center" onClick={() => router.push("/swap")}>
                Add New
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {userItems.map((item) => (
                <div key={item.id} className="bg-secondary rounded-lg overflow-hidden shadow-lg">
                  <div className="relative">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={150}
                      height={150}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-0.5 flex items-center">
                      <Heart className="w-3 h-3 text-[#c1ff72] mr-1" />
                      <span className="text-white text-xs">{item.likes}</span>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="text-foreground text-sm font-semibold">{item.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-foreground font-semibold">Your Reviews</h3>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-[#c1ff72] mr-1" />
                <span className="text-foreground font-semibold">4.7</span>
                <span className="text-muted text-xs ml-1">({userReviews.length})</span>
              </div>
            </div>

            <div className="space-y-3">
              {userReviews.map((review) => (
                <div key={review.id} className="bg-secondary rounded-lg p-4 shadow-lg">
                  <div className="flex items-center mb-2">
                    <div
                      className="w-10 h-10 rounded-full overflow-hidden mr-3 cursor-pointer"
                      onClick={() => {
                        alert(`Viewing ${review.reviewer.name}'s profile`)
                      }}
                    >
                      <Image
                        src={review.reviewer.image || "/placeholder.svg"}
                        alt={review.reviewer.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div
                        className="text-foreground font-semibold cursor-pointer"
                        onClick={() => {

                          alert(`Viewing ${review.reviewer.name}'s profile`)
                        }}
                      >
                        {review.reviewer.name}
                      </div>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <span key={i} className="text-lg">
                                {i < review.rating ? (
                                  <span className="text-[#c1ff72]">★</span>
                                ) : (
                                  <span className="text-[#3a3a3a]">☆</span>
                                )}
                              </span>
                            ))}
                        </div>
                        <span className="text-foreground text-xs font-medium">{review.rating}/5</span>
                        <span className="text-muted text-xs mx-2">•</span>
                        <span className="text-muted text-xs">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-foreground text-sm mb-2">{review.text}</p>
                  <div className="text-muted text-xs">
                    Item: <span className="text-[#c1ff72]">{review.item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

function EditProfileScreen({ setActiveSubScreen }: { setActiveSubScreen: (screen: string | null) => void }) {
  const [name, setName] = useState("John")
  const [username, setUsername] = useState("@johnswapper")
  const [bio, setBio] = useState(
    "Passionate about sustainable living and reducing waste through swapping unwanted items.",
  )
  const [location, setLocation] = useState("The Toon")
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=96&width=96")
  const [isLoading, setIsLoading] = useState(false)

 
  const handleProfileImageChange = (newImage: string) => {
    setProfileImage(newImage)
    
  }

  const handleSave = () => {
    setIsLoading(true)

    // Simulate saving profile
    setTimeout(() => {
      setIsLoading(false)
      setActiveSubScreen(null)
    }, 1000)
  }

  return (
    <AppShell title="Edit Profile" showBackButton={true} onBack={() => setActiveSubScreen(null)} activeScreen="profile">
      <div className="p-4">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24 mb-2">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#c1ff72]">
              <Image
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#c1ff72] rounded-full flex items-center justify-center shadow-md"
              onClick={() => {
                
                const randomId = Math.floor(Math.random() * 1000)
                handleProfileImageChange(`/placeholder.svg?height=96&width=96&id=${randomId}`)
              }}
            >
              <Camera className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        <form className="space-y-4">
          <div>
            <label className="text-muted text-xs block mb-1">Full Name</label>
            <input
              type="text"
              className="w-full bg-secondary text-foreground rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-[#c1ff72]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-muted text-xs block mb-1">Username</label>
            <input
              type="text"
              className="w-full bg-secondary text-foreground rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-[#c1ff72]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-muted text-xs block mb-1">Bio</label>
            <textarea
              className="w-full bg-secondary text-foreground rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-[#c1ff72] resize-none h-24"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="text-muted text-xs block mb-1">Location</label>
            <input
              type="text"
              className="w-full bg-secondary text-foreground rounded-lg p-3 outline-none border border-[#3a3a3a] focus:border-[#c1ff72]"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleSave}
              className="w-full bg-[#c1ff72] text-black font-semibold rounded-lg py-3 flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 rounded-full border-2 border-b-transparent border-black animate-spin"></span>
                  Saving...
                </span>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}

function FollowingScreen({ setActiveSubScreen }: { setActiveSubScreen: (screen: string | null) => void }) {
  const following = [
    {
      id: 1,
      name: "James Wilson",
      username: "@jameswilson",
      image: "/placeholder.svg?height=48&width=48",
      bio: "Outdoor gear enthusiast",
    },
    {
      id: 2,
      name: "Emma Thompson",
      username: "@emma_t",
      image: "/placeholder.svg?height=48&width=48",
      bio: "Vintage clothing lover",
    },
    {
      id: 3,
      name: "Michael Scott",
      username: "@michaelscott",
      image: "/placeholder.svg?height=48&width=48",
      bio: "Office supplies collector",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      username: "@sarahj",
      image: "/placeholder.svg?height=48&width=48",
      bio: "Sustainable fashion advocate",
    },
    {
      id: 5,
      name: "David Kim",
      username: "@davidkim",
      image: "/placeholder.svg?height=48&width=48",
      bio: "Tech gadget trader",
    },
  ]

  return (
    <AppShell
      title="People You Follow"
      showBackButton={true}
      onBack={() => setActiveSubScreen(null)}
      activeScreen="profile"
    >
      <div className="p-4">
        <div className="space-y-3">
          {following.map((user) => (
            <div key={user.id} className="flex items-center bg-secondary p-4 rounded-lg shadow-lg">
              <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
                <Image
                  src={user.image || "/placeholder.svg"}
                  alt={user.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="text-foreground font-semibold">{user.name}</div>
                <div className="text-muted text-xs">{user.username}</div>
                <div className="text-muted text-xs mt-1 line-clamp-1">{user.bio}</div>
              </div>

              <button className="bg-[#c1ff72] text-black text-xs font-medium rounded-full px-3 py-1">Following</button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

function FollowersScreen({ setActiveSubScreen }: { setActiveSubScreen: (screen: string | null) => void }) {
  const followers = [
    {
      id: 1,
      name: "Sarah Johnson",
      username: "@sarahj",
      image: "/placeholder.svg?height=48&width=48",
      bio: "Fashion enthusiast and vintage collector",
      following: true,
    },
    {
      id: 2,
      name: "Mike Peters",
      username: "@mikeswaps",
      image: "/placeholder.svg?height=48&width=48",
      bio: "Avid reader and book swapper",
      following: false,
    },
    {
      id: 3,
      name: "Emily Davis",
      username: "@emilyd",
      image: "/placeholder.svg?height=48&width=48",
      bio: "Plant lover looking to trade cuttings",
      following: true,
    },
    {
      id: 4,
      name: "Ryan Taylor",
      username: "@ryantaylor",
      image: "/placeholder.svg?height=48&width=48",
      bio: "Sports equipment collector",
      following: false,
    },
    {
      id: 5,
      name: "Sophia Lee",
      username: "@sophialee",
      image: "/placeholder.svg?height=48&width=48",
      bio: "Artist trading handmade crafts",
      following: true,
    },
  ]

  return (
    <AppShell
      title="Your Followers"
      showBackButton={true}
      onBack={() => setActiveSubScreen(null)}
      activeScreen="profile"
    >
      <div className="p-4">
        <div className="space-y-3">
          {followers.map((user) => (
            <div key={user.id} className="flex items-center bg-secondary p-4 rounded-lg shadow-lg">
              <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
                <Image
                  src={user.image || "/placeholder.svg"}
                  alt={user.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="text-foreground font-semibold">{user.name}</div>
                <div className="text-muted text-xs">{user.username}</div>
                <div className="text-muted text-xs mt-1 line-clamp-1">{user.bio}</div>
              </div>

              <button
                className={`${user.following ? "bg-secondary text-foreground border border-[#3a3a3a]" : "bg-[#c1ff72] text-black"} text-xs font-medium rounded-full px-3 py-1 flex items-center`}
              >
                {user.following ? (
                  "Following"
                ) : (
                  <>
                    <UserPlus className="w-3 h-3 mr-1" /> Follow
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

function SwapsHistoryScreen({ setActiveSubScreen }: { setActiveSubScreen: (screen: string | null) => void }) {
  return (
    <AppShell
      title="Swaps History"
      showBackButton={true}
      onBack={() => setActiveSubScreen(null)}
      activeScreen="profile"
    >
      <div className="p-4">
        <div className="space-y-4">
          {[
            {
              id: 1,
              name: "Vintage Chair",
              status: "Completed",
              date: "May 15, 2023",
              image: "/placeholder.svg?height=60&width=60",
              with: "Katie",
            },
            {
              id: 2,
              name: "Blue T-Shirt",
              status: "Completed",
              date: "Apr 22, 2023",
              image: "/placeholder.svg?height=60&width=60",
              with: "Jacob",
            },
            {
              id: 3,
              name: "Leather Boots",
              status: "Cancelled",
              date: "Mar 10, 2023",
              image: "/placeholder.svg?height=60&width=60",
              with: "Sam",
            },
            {
              id: 4,
              name: "Desk Lamp",
              status: "Completed",
              date: "Feb 5, 2023",
              image: "/placeholder.svg?height=60&width=60",
              with: "Emily",
            },
          ].map((order) => (
            <div key={order.id} className="flex items-center bg-secondary p-4 rounded-lg shadow-lg">
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                <Image
                  src={order.image || "/placeholder.svg"}
                  alt={order.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="text-foreground font-semibold">{order.name}</div>
                <div className="text-muted text-xs">Swapped with {order.with}</div>
                <div className="text-muted text-xs">{order.date}</div>
                <div
                  className={`text-xs mt-1 ${order.status === "Completed" ? "text-[#c1ff72]" : "text-red-400"} font-medium`}
                >
                  {order.status}
                </div>
              </div>

              <button className="bg-background rounded-full p-2">
                <ChevronRight className="w-5 h-5 text-[#c1ff72]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
