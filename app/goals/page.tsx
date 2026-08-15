import { AppShell } from "../components/AppShell";
import { getAchievements, getGoals, getPortfolios } from "@/lib/mockApi";
import { GoalsClient } from "./GoalsClient";

export default async function GoalsPage() {
  const achievements = await getAchievements();
  const goals = await getGoals();
  const portfolios = await getPortfolios();

  return (
    <AppShell active="대시보드">
      <section className="page-section">
        <GoalsClient achievements={achievements} goals={goals} portfolios={portfolios} />
      </section>
    </AppShell>
  );
}
