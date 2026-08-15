import { AppShell } from "../../components/AppShell";
import { getAchievements, getMyProfile, getPortfolioDetail } from "@/lib/mockApi";
import { PortfolioView } from "./PortfolioView";

export default async function PortfolioPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const portfolio = await getPortfolioDetail(id);
  const achievements = await getAchievements();
  const profile = await getMyProfile();
  const persona = profile.personas.find((item) => item.id === portfolio.personaId) ?? profile.personas[0];
  const visibleAchievements = portfolio.id === "portfolio-default"
    ? achievements
    : achievements.filter((achievement) => portfolio.tags.some((tag) => achievement.tags.includes(tag)));

  return (
    <AppShell active="포트폴리오" contextTitle={portfolio.name}>
      <section className="page-section public-portfolio">
        <PortfolioView achievements={visibleAchievements} persona={persona} portfolioId={portfolio.id} title={portfolio.name} />
      </section>
    </AppShell>
  );
}
