import ProfilePage from "./profile-page-component";
import AppShell from "@components/app-shell";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AppShell activeScreen="profile" title="Profile">
      <div className="p-4">
        <ProfilePage />
      </div>
    </AppShell>
  );
}
