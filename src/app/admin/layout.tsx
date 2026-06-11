import Link from "next/link";
import AuroraBg from "@/components/AuroraBg";
import ThemeToggle from "@/components/ThemeToggle";
import { isAuthenticated } from "@/lib/auth";
import { getSiteConfig } from "@/lib/site";
import { logoutAction } from "./actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();
  const site = getSiteConfig();

  if (!authed) {
    return <>{children}</>;
  }

  return (
    <div className="page-bg min-h-screen">
      <AuroraBg />
      <div className="content-wrap">
      <header className="glass sticky top-0 z-40">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="logo-glow logo-mark h-7 w-7 text-xs">{site.logo}</span>
            <span className="t-primary text-sm font-semibold">管理后台</span>
          </Link>
          <nav className="flex gap-1 text-sm">
            <Link href="/admin/categories" className="nav-link px-3 py-1.5">
              分类
            </Link>
            <Link href="/admin/resources" className="nav-link px-3 py-1.5">
              资源
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2 text-sm">
            <ThemeToggle />
            <Link href="/" target="_blank" className="btn-ghost">
              前台 ↗
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="btn-ghost text-red-500 hover:text-red-600">
                退出
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </div>
    </div>
  );
}
