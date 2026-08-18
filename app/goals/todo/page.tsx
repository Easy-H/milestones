import { AppShell } from "../../components/AppShell";
import { getGoals } from "@/lib/mockApi";
import { GoalsClient } from "../GoalsClient";

export default async function TodoGoalsPage() {
  const goals = await getGoals();

  return (
    <AppShell active="진행 중">
      <section className="page-section">
        <GoalsClient goals={goals} status="진행중" title="진행 중" />
      </section>
    </AppShell>
  );
}
