import { getCategoryTree, countStats } from "@/lib/db";
import { getSiteConfig } from "@/lib/site";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default function Home() {
  const tree = getCategoryTree();
  const stats = countStats();
  const site = getSiteConfig();
  return <HomeClient tree={tree} stats={stats} site={site} />;
}
