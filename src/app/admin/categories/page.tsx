import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getAllCategories, getAllResources } from "@/lib/db";
import CategoryManager from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const categories = getAllCategories();
  const resources = getAllResources();
  const resourceCount = new Map<number, number>();
  for (const r of resources) {
    resourceCount.set(r.category_id, (resourceCount.get(r.category_id) ?? 0) + 1);
  }

  return (
    <CategoryManager
      categories={categories}
      resourceCount={Object.fromEntries(resourceCount)}
    />
  );
}
