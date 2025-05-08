"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import AppShell from "@/components/app-shell";
import { Loader2, AlertTriangle, Users, RefreshCcw, Flag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UserRole } from "@prisma/client";

export default function AdminDashboard() {
  const router = useRouter();

  // Check if user is admin
  const { data: userId, isLoading: userLoading } =
    api.user.getCurrentlyAuthenticatedUser.useQuery();

  const [user] = api.user.getProfile.useSuspenseQuery({ userId });

  const isAdmin = user?.role === UserRole.ADMIN;

  // Fetch last 10 users
  const { data: recentUsers, isLoading: usersLoading } =
    api.admin.getRecentUsers.useQuery({ limit: 10 }, { enabled: !!isAdmin });

  // Fetch last 10 swaps
  const { data: recentSwipes, isLoading: swipesLoading } =
    api.admin.getRecentSwaps.useQuery({ limit: 10 }, { enabled: !!isAdmin });

  // Fetch reports
  const { data: reports, isLoading: reportsLoading } =
    api.admin.getReports.useQuery(undefined, { enabled: !!isAdmin });

  useEffect(() => {
    if (!userLoading && !isAdmin) {
      router.push("/");
    }
  }, [user, userLoading, router, isAdmin]);

  if (userLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <AppShell title="Admin Dashboard" activeScreen="admin">
      <div className="p-4">
        {/* Reports Section */}
        <div className="mb-6 rounded-lg bg-secondary p-4">
          <h2 className="mb-4 flex items-center text-lg font-bold">
            <Flag className="mr-2 h-5 w-5 text-red-500" />
            Active Reports
          </h2>
          {reportsLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : reports && reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="rounded-lg bg-background p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                      <Link
                        href={`/admin/report/${report.id}`}
                        className="font-medium hover:underline"
                      >
                        Report #{report.id}
                      </Link>
                    </div>
                    <span className="text-sm text-muted">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">{report.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No active reports</p>
          )}
        </div>

        {/* Recent Users Section */}
        <div className="mb-6 rounded-lg bg-secondary p-4">
          <h2 className="mb-4 flex items-center text-lg font-bold">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Recent Users
          </h2>
          {usersLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : recentUsers && recentUsers.length > 0 ? (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center rounded-lg bg-background p-2"
                >
                  <Link
                    href={`/admin/user/${user.id}`}
                    className="flex items-center hover:underline"
                  >
                    <Image
                      src={user.image ?? "/profile-placeholder.svg"}
                      alt={user.name ?? "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="ml-3">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted">{user.email}</div>
                    </div>
                  </Link>
                  <div className="ml-auto text-xs text-muted">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No users found</p>
          )}
        </div>

        {/* Recent Swaps Section */}
        <div className="rounded-lg bg-secondary p-4">
          <h2 className="mb-4 flex items-center text-lg font-bold">
            <RefreshCcw className="mr-2 h-5 w-5 text-primary" />
            Recent Swipes
          </h2>
          {swipesLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : recentSwipes && recentSwipes.length > 0 ? (
            <div className="space-y-3">
              {recentSwipes.map((swipe) => (
                <div key={swipe.id} className="rounded-lg bg-background p-3">
                  <Link
                    href={`/admin/swipe/${swipe.id}`}
                    className="block hover:underline"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={swipe.item.images[0] ?? "/item-placeholder.svg"}
                          alt={swipe.item.title ?? "Item"}
                          width={48}
                          height={48}
                          className="rounded"
                        />
                        <div>
                          <div className="font-medium">{swipe.item.title}</div>
                          <div className="text-sm text-muted">
                            {swipe.user.name} → {swipe.item.user.name}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-muted">
                        {new Date(swipe.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No recent swaps</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
