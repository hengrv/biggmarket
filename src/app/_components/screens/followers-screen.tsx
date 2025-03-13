import AppShell from "@components/app-shell";
import Image from "next/image";
import { UserPlus } from "lucide-react";

function FollowersScreen({
  setActiveSubScreen,
}: {
  setActiveSubScreen: (screen: string | null) => void;
}) {
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
  ];

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
            <div
              key={user.id}
              className="bg-secondary flex items-center rounded-lg p-4 shadow-lg"
            >
              <div className="mr-4 h-14 w-14 overflow-hidden rounded-full">
                <Image
                  src={user.image || "/placeholder.svg"}
                  alt={user.name}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="text-foreground font-semibold">{user.name}</div>
                <div className="text-muted text-xs">{user.username}</div>
                <div className="text-muted mt-1 line-clamp-1 text-xs">
                  {user.bio}
                </div>
              </div>

              <button
                className={`${user.following ? "bg-secondary text-foreground border border-[#3a3a3a]" : "bg-[#c1ff72] text-black"} flex items-center rounded-full px-3 py-1 text-xs font-medium`}
              >
                {user.following ? (
                  "Following"
                ) : (
                  <>
                    <UserPlus className="mr-1 h-3 w-3" /> Follow
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export default FollowersScreen;
