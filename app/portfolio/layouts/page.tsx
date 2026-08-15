import { getAchievements, getLayouts } from "@/lib/mockApi";
import { LayoutsClient } from "./LayoutsClient";

export default async function LayoutsPage() {
  const layouts = await getLayouts();
  const achievements = await getAchievements();

  return <LayoutsClient achievements={achievements} layouts={layouts} />;
}
