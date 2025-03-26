import AppShell from "../app-shell";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

function SwapsHistoryScreen({
  setActiveSubScreen,
  userId,
}: {
  setActiveSubScreen: (screen: string | null) => void;
  userId?: string;
}) {
  // You can use the userId to fetch swaps specific to that user
  // For now, we'll keep the existing mock data

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
              image: "/item-placeholder.svg?height=60&width=60",
              with: "Katie",
            },
            {
              id: 2,
              name: "Blue T-Shirt",
              status: "Completed",
              date: "Apr 22, 2023",
              image: "/item-placeholder.svg?height=60&width=60",
              with: "Jacob",
            },
            {
              id: 3,
              name: "Leather Boots",
              status: "Cancelled",
              date: "Mar 10, 2023",
              image: "/item-placeholder.svg?height=60&width=60",
              with: "Sam",
            },
            {
              id: 4,
              name: "Desk Lamp",
              status: "Completed",
              date: "Feb 5, 2023",
              image: "/item-placeholder.svg?height=60&width=60",
              with: "Emily",
            },
          ].map((order) => (
            <div
              key={order.id}
              className="flex items-center rounded-lg bg-secondary p-4 shadow-lg"
            >
              <div className="mr-4 h-16 w-16 overflow-hidden rounded-lg">
                <Image
                  src={order.image || "/item-placeholder.svg"}
                  alt={order.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>

              <div className="flex-1">
                <div className="font-semibold text-foreground">
                  {order.name}
                </div>
                <div className="text-xs text-muted">
                  Swapped with {order.with}
                </div>
                <div className="text-xs text-muted">{order.date}</div>
                <div
                  className={`mt-1 text-xs ${order.status === "Completed" ? "text-[#c1ff72]" : "text-red-400"} font-medium`}
                >
                  {order.status}
                </div>
              </div>

              <button className="rounded-full bg-background p-2">
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
