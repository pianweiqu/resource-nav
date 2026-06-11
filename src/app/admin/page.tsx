import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { countStats, getAllCategories, getAllResources } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const stats = countStats();
  const topCategories = getAllCategories().filter((c) => !c.parent_id).length;
  const latest = getAllResources()
    .sort((a, b) => b.id - a.id)
    .slice(0, 8);

  const statItems = [
    { label: "资源总数", value: stats.resources },
    { label: "分类总数", value: stats.categories },
    { label: "一级分类", value: topCategories },
  ];

  return (
    <div>
      <h1 className="t-primary mb-6 text-2xl font-semibold">概览</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statItems.map((s) => (
          <div key={s.label} className="admin-stat-card">
            <p className="t-muted text-sm">{s.label}</p>
            <p className="stat-value mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 flex gap-2">
        <Link href="/admin/resources" className="btn-primary">
          管理资源
        </Link>
        <Link href="/admin/categories" className="btn-secondary">
          管理分类
        </Link>
      </div>

      <h2 className="t-secondary mb-3 text-base font-medium">最近添加</h2>
      <div className="card overflow-hidden">
        <table className="table-themed w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left font-medium">名称</th>
              <th className="px-4 py-3 text-left font-medium">网址</th>
              <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">描述</th>
            </tr>
          </thead>
          <tbody>
            {latest.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid var(--table-divide)" }}>
                <td className="t-primary px-4 py-3 font-medium">{r.title}</td>
                <td className="max-w-[200px] truncate px-4 py-3">
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="link-accent">
                    {r.url}
                  </a>
                </td>
                <td className="t-muted hidden max-w-[280px] truncate px-4 py-3 sm:table-cell">
                  {r.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
