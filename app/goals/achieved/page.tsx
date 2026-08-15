import { AppShell } from "../../components/AppShell";
import { getAchievements, getGoals } from "@/lib/mockApi";
import { GoalsClient } from "../GoalsClient";

export default async function AchievedGoalsPage() {
  const goals = await getGoals();
  const achievements = await getAchievements();

  return (
    <AppShell active="성취">
      <section className="page-section">
        <GoalsClient achievements={achievements} goals={goals} status="성취" title="성취" />
      </section>
    </AppShell>
  );
}
