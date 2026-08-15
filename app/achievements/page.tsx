import { getAchievements } from "@/lib/mockApi";
import { AchievementLibraryClient } from "./AchievementLibraryClient";

export default async function AchievementsPage() {
  const achievements = await getAchievements();

  return <AchievementLibraryClient achievements={achievements} />;
}
