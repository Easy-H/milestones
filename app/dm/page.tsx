import { AppShell } from "../components/AppShell";
import { getDmThreads } from "@/lib/mockApi";
import { DmClient } from "./DmClient";

export default async function DmPage() {
  const threads = await getDmThreads();

  return (
    <AppShell active="DM">
      <section className="page-section">
        <DmClient threads={threads} />
      </section>
    </AppShell>
  );
}
