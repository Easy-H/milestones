import { AppShell } from "../components/AppShell";
import { getMyProfile } from "@/lib/mockApi";
import { ProfileClient } from "./ProfileClient";

export default async function ProfilePage() {
  const profile = await getMyProfile();

  return (
    <AppShell active="프로필">
      <section className="page-section">
        <ProfileClient profile={profile} />
      </section>
    </AppShell>
  );
}
