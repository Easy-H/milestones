import { getAchievements, getCollectionMilestones, getGoals, getLayouts, getMyProfile, getPortfolioDetail } from "@/lib/mockApi";
import { PortfolioEditor } from "./PortfolioEditor";

export default async function PortfolioEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const portfolio = await getPortfolioDetail(id);
  const achievements = await getAchievements();
  const goals = await getGoals();
  const layouts = await getLayouts();
  const profile = await getMyProfile();
  const milestones = getCollectionMilestones(portfolio, goals, achievements);

  return <PortfolioEditor achievements={milestones} layouts={layouts} personas={profile.personas} portfolio={portfolio} />;
}
