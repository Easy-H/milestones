import { getAchievements, getMyProfile, getPortfolios, getPublicProfiles } from "@/lib/mockApi";
import { PortfolioClient } from "./PortfolioClient";

export default async function PortfolioPage() {
  const achievements = await getAchievements();
  const portfolios = await getPortfolios();
  const publicProfiles = await getPublicProfiles();
  const profile = await getMyProfile();

  return <PortfolioClient achievements={achievements} personas={profile.personas} portfolios={portfolios} publicProfiles={publicProfiles} />;
}
