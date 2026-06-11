"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AuroraBg from "@/components/AuroraBg";
import ThemeToggle from "@/components/ThemeToggle";
import type { CategoryNode, Resource } from "@/lib/db";
import type { SiteConfig } from "@/lib/site";

interface Props {
  tree: CategoryNode[];
  stats: { categories: number; resources: number };
  site: SiteConfig;
}

const ACCENTS = [
  { bar: "from-violet-400 to-fuchsia-500", dot: "from-violet-400 to-fuchsia-500", glow: "text-violet-400" },
  { bar: "from-cyan-400 to-blue-500", dot: "from-cyan-400 to-blue-500", glow: "text-cyan-400" },
  { bar: "from-emerald-400 to-teal-500", dot: "from-emerald-400 to-teal-500", glow: "text-emerald-400" },
  { bar: "from-orange-400 to-amber-500", dot: "from-orange-400 to-amber-500", glow: "text-orange-400" },
  { bar: "from-rose-400 to-pink-500", dot: "from-rose-400 to-pink-500", glow: "text-rose-400" },
  { bar: "from-indigo-400 to-purple-500", dot: "from-indigo-400 to-purple-500", glow: "text-indigo-400" },
];

function matchResource(r: Resource, q: string) {
  const s = q.toLowerCase();
  return (
    r.title.toLowerCase().includes(s) ||
    r.description.toLowerCase().includes(s) ||
    r.url.toLowerCase().includes(s)
  );
}

function filterTree(tree: CategoryNode[], q: string): CategoryNode[] {
  if (!q.trim()) return tree;
  const walk = (nodes: CategoryNode[]): CategoryNode[] =>
    nodes
      .map((n) => ({
        ...n,
        resources: n.resources.filter((r) => matchResource(r, q)),
        children: walk(n.children),
      }))
      .filter((n) => n.resources.length > 0 || n.children.length > 0);
  return walk(tree);
}

function ResourceCard({ r, accent }: { r: Resource; accent: (typeof ACCENTS)[0] }) {
  let host = "";
  try {
    host = new URL(r.url).hostname;
  } catch {
    host = r.url;
  }
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card card-hover card-shine group relative flex flex-col gap-3 p-4"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent.dot} p-0.5 shadow-lg transition group-hover:scale-110`}
        >
          <div className="favicon-inner flex h-full w-full items-center justify-center rounded-[10px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://www.google.com/s2/favicons?domain=${host}&sz=32`}
              alt=""
              width={22}
              height={22}
              className="rounded"
              loading="lazy"
            />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="t-primary truncate font-semibold transition group-hover:text-indigo-500">
              {r.title}
            </span>
            <svg
              className="t-faint h-3.5 w-3.5 shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="t-muted mt-1 line-clamp-2 text-sm leading-relaxed">
            {r.description || host}
          </p>
        </div>
      </div>
    </a>
  );
}

function Section({
  node,
  level,
  accentIndex,
}: {
  node: CategoryNode;
  level: number;
  accentIndex: number;
}) {
  const hasContent =
    node.resources.length > 0 || node.children.some((c) => c.resources.length > 0);
  if (!hasContent) return null;

  const count =
    node.resources.length +
    node.children.reduce((acc, c) => acc + c.resources.length, 0);
  const accent = ACCENTS[accentIndex % ACCENTS.length];

  return (
    <section id={`cat-${node.id}`} className="scroll-mt-24">
      <div className="mb-5 flex items-center gap-3">
        {level === 0 && (
          <div
            className={`section-glow-bar h-9 w-1 rounded-full bg-gradient-to-b ${accent.bar} ${accent.glow}`}
          />
        )}
        <div className="flex flex-1 items-center gap-2.5">
          {level === 0 ? (
            <h2 className="t-primary text-xl font-bold tracking-tight">{node.name}</h2>
          ) : (
            <h3 className="t-secondary text-base font-semibold">{node.name}</h3>
          )}
          <span className="badge-count">
            {count}
          </span>
        </div>
      </div>

      {node.resources.length > 0 && (
        <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {node.resources.map((r) => (
            <ResourceCard key={r.id} r={r} accent={accent} />
          ))}
        </div>
      )}

      <div className="space-y-10">
        {node.children.map((c, i) => (
          <Section
            key={c.id}
            node={c}
            level={level + 1}
            accentIndex={accentIndex + i + 1}
          />
        ))}
      </div>
    </section>
  );
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function HomeClient({ tree, stats, site }: Props) {
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set());
  const [showBackToTop, setShowBackToTop] = useState(false);

  const filtered = useMemo(() => filterTree(tree, query), [tree, query]);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="page-bg min-h-screen">
      <AuroraBg />

      <div className="relative z-10">
        {/* 顶栏 */}
        <header className="glass sticky top-0 z-40">
          <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-4 px-4 sm:px-6">
            <button
              className="t-muted rounded-xl p-2 transition hover:bg-black/5 hover:text-[var(--text-primary)] dark:hover:bg-white/10 lg:hidden"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="切换侧边栏"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              </svg>
            </button>

            <Link
              href="/"
              className="relative z-10 flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  scrollToTop();
                }
              }}
            >
              <span className="logo-glow flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-xs font-bold text-white">
                {site.logo}
              </span>
              <h1 className="t-primary text-lg font-bold tracking-tight">{site.name}</h1>
            </Link>

            <div className="ml-auto flex min-w-0 flex-1 max-w-md items-center gap-3">
              <div className="relative w-full">
                <svg
                  className="t-faint pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" strokeLinecap="round" />
                </svg>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索资源…"
                  className="search-neon w-full rounded-full py-2.5 pl-10 pr-4 text-sm outline-none"
                />
              </div>
              <ThemeToggle />
              {site.showAdminLink && (
                <Link href="/admin" className="btn-neon hidden shrink-0 sm:block">
                  管理
                </Link>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto flex max-w-screen-2xl">
          {/* 侧边栏 */}
          <aside
            className={`glass-panel fixed inset-y-0 left-0 z-30 w-72 transform pt-20 transition-transform duration-300 ease-out lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:rounded-none lg:border-r lg:pt-5 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="px-4 pb-2">
              <p className="t-faint text-xs font-semibold uppercase tracking-widest">
                分类导航
              </p>
            </div>
            <nav className="h-full overflow-y-auto px-3 pb-8">
              {tree.map((g, i) => {
                const accent = ACCENTS[i % ACCENTS.length];
                return (
                  <div key={g.id} className="mb-0.5">
                    <div className="flex items-center">
                      <a
                        href={`#cat-${g.id}`}
                        onClick={() => setSidebarOpen(false)}
                        className="nav-item-glow group flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium"
                      >
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full bg-gradient-to-br ${accent.dot} shadow-[0_0_8px_currentColor]`}
                        />
                        {g.name}
                      </a>
                      {g.children.length > 0 && (
                        <button
                          onClick={() => toggleExpand(g.id)}
                          className="t-faint rounded-lg p-1.5 transition hover:bg-black/5 hover:text-[var(--text-secondary)] dark:hover:bg-white/10"
                          aria-label="展开子分类"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={`transition-transform duration-200 ${expanded.has(g.id) ? "rotate-90" : ""}`}
                          >
                            <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {expanded.has(g.id) && (
                      <div className="ml-5 border-l pl-2" style={{ borderColor: "var(--sidebar-child-border)" }}>
                        {g.children.map((c) => (
                          <a
                            key={c.id}
                            href={`#cat-${c.id}`}
                            onClick={() => setSidebarOpen(false)}
                            className="nav-item-glow block rounded-lg py-2 pl-3 pr-2 text-sm"
                          >
                            {c.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </aside>

          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 backdrop-blur-sm lg:hidden"
            style={{ background: "var(--overlay)" }}
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* 主内容 */}
          <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">
            {/* Hero */}
            <div className="hero-aurora relative mb-10 p-8 sm:p-10">
              <div className="relative z-10">
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-300 backdrop-blur">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                  ONLINE
                </p>
                <h2 className="text-shimmer text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  {site.heroTitle}
                </h2>
                <p className="hero-subtitle mt-4 max-w-2xl text-base leading-relaxed">
                  {site.heroSubtitle}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <span className="stat-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" />
                    </svg>
                    {stats.resources} 个链接
                  </span>
                  <span className="stat-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" />
                    </svg>
                    {stats.categories} 个分类
                  </span>
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="card flex flex-col items-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="t-secondary font-medium">没有找到相关资源</p>
                <p className="t-muted mt-1 text-sm">试试其他关键词</p>
              </div>
            ) : (
              <div className="space-y-14">
                {filtered.map((g, i) => (
                  <Section key={g.id} node={g} level={0} accentIndex={i} />
                ))}
              </div>
            )}

            <footer className="t-faint mt-20 border-t py-10 text-center text-sm" style={{ borderColor: "var(--footer-border)" }}>
              {site.footer}
            </footer>
          </main>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          aria-label="回到顶部"
          className={`glass-panel fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            showBackToTop
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="t-primary"
          >
            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
