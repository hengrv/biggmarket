import AppShell from "../app-shell";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

function SwapsHistoryScreen({
  setActiveSubScreen,
}: {
  setActiveSubScreen: (screen: string | null) => void;
}) {
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
            <div
              key={order.id}
              className="bg-secondary flex items-center rounded-lg p-4 shadow-lg"
            >
              <div className="mr-4 h-16 w-16 overflow-hidden rounded-lg">
                <Image
                  src={order.image || "/placeholder.svg"}
                  alt={order.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="text-foreground font-semibold">
                  {order.name}
                </div>
                <div className="text-muted text-xs">
                  Swapped with {order.with}
                </div>
                <div className="text-muted text-xs">{order.date}</div>
                <div
                  className={`mt-1 text-xs ${order.status === "Completed" ? "text-[#c1ff72]" : "text-red-400"} font-medium`}
                >
                  {order.status}
                </div>
              </div>

              <button className="bg-background rounded-full p-2">
                <ChevronRight className="h-5 w-5 text-[#c1ff72]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export default SwapsHistoryScreen;
