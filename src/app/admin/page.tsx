import AdminDashboard from "@/components/admin-dashboard";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export default function AdminPage() {
  const session = await auth();

  // If user is not authenticated, redirect to login page
  if (!session?.user) {
    redirect("/login");
  }

  return <AdminDashboard />;
}
