import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllCategories, getAllResources } from "@/lib/db";
import ResourceManager from "./ResourceManager";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <ResourceManager
      categories={getAllCategories()}
      resources={getAllResources()}
    />
  );
}
