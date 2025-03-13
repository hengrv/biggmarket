import AppShell from "@components/app-shell";
import Image from "next/image";

function FollowingScreen({
  setActiveSubScreen,
}: {
  setActiveSubScreen: (screen: string | null) => void;
}) {
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
  ];

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

              <button className="rounded-full bg-[#c1ff72] px-3 py-1 text-xs font-medium text-black">
                Following
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export default FollowingScreen;
