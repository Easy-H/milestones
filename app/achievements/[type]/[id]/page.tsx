import { getAchievementDetail } from "@/lib/mockApi";
import { AchievementDetailClient } from "./AchievementDetailClient";

export default async function AchievementDetailPage({ params }: { params: Promise<{ id: string; type: string }> }) {
  const { id } = await params;
  const achievement = await getAchievementDetail(id);

  return <AchievementDetailClient achievement={achievement} />;
}
