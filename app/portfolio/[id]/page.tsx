import { AppShell } from "../../components/AppShell";
import { getAchievements, getCollectionMilestones, getGoals, getMyProfile, getPortfolioDetail } from "@/lib/mockApi";
import { PortfolioView } from "./PortfolioView";

export default async function PortfolioPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const portfolio = await getPortfolioDetail(id);
  const achievements = await getAchievements();
  const goals = await getGoals();
  const profile = await getMyProfile();
  const persona = profile.personas.find((item) => item.id === portfolio.personaId) ?? profile.personas[0];
  const visibleMilestones = getCollectionMilestones(portfolio, goals, achievements);

  return (
    <AppShell active="모음" contextTitle={portfolio.name}>
      <section className="page-section public-portfolio">
        <PortfolioView achievements={visibleMilestones} persona={persona} portfolioId={portfolio.id} title={portfolio.name} />
      </section>
    </AppShell>
  );
}
