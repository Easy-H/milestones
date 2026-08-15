import { getAchievements, getLayouts, getMyProfile, getPortfolioDetail } from "@/lib/mockApi";
import { PortfolioEditor } from "./PortfolioEditor";

export default async function PortfolioEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const portfolio = await getPortfolioDetail(id);
  const achievements = await getAchievements();
  const layouts = await getLayouts();
  const profile = await getMyProfile();

  return <PortfolioEditor achievements={achievements} layouts={layouts} personas={profile.personas} portfolio={portfolio} />;
}
