import { getAchievements, getGoals, getMyProfile, getPortfolios, getPublicProfiles } from "@/lib/mockApi";
import { PortfolioClient } from "../PortfolioClient";

export default async function ExplorePage() {
  const achievements = await getAchievements();
  const goals = await getGoals();
  const portfolios = await getPortfolios();
  const publicProfiles = await getPublicProfiles();
  const profile = await getMyProfile();

  return (
    <PortfolioClient
      achievements={achievements}
      goals={goals}
      initialTab="둘러보기"
      personas={profile.personas}
      portfolios={portfolios}
      publicProfiles={publicProfiles}
    />
  );
}
