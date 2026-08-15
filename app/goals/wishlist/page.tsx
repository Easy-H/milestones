import { AppShell } from "../../components/AppShell";
import { getGoals } from "@/lib/mockApi";
import { GoalsClient } from "../GoalsClient";

export default async function WishlistGoalsPage() {
  const goals = await getGoals();

  return (
    <AppShell active="하고싶은일">
      <section className="page-section">
        <GoalsClient goals={goals} status="하고싶은일" title="하고싶은일" />
      </section>
    </AppShell>
  );
}
