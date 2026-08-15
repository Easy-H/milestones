import { getAchievementDetail, getPortfolioDetail } from "@/lib/mockApi";
import { AchievementDetailClient } from "../../../../../achievements/[type]/[id]/AchievementDetailClient";

export default async function PortfolioAchievementDetailPage({
  params,
}: {
  params: Promise<{ achievementId: string; id: string; type: string }>;
}) {
  const { achievementId, id } = await params;
  const achievement = await getAchievementDetail(achievementId);
  const portfolio = await getPortfolioDetail(id);
  const portfolioTags = portfolio.id === "portfolio-default"
    ? achievement.tags
    : achievement.tags.filter((tag) => portfolio.tags.includes(tag));
  const availableTags = portfolioTags.length ? portfolioTags : achievement.tags;

  return <AchievementDetailClient achievement={achievement} availableTags={availableTags} />;
}
