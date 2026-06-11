"use client";

import { useActionState } from "react";
import AuroraBg from "@/components/AuroraBg";
import ThemeToggle from "@/components/ThemeToggle";
import type { SiteConfig } from "@/lib/site";
import { loginAction } from "../actions";

export default function LoginForm({ site }: { site: SiteConfig }) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="page-bg min-h-screen">
      <AuroraBg />
      <div className="content-wrap relative flex min-h-screen items-center justify-center px-4">
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <div className="card w-full max-w-sm p-8 shadow-lg">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="logo-glow logo-mark mb-5 h-14 w-14 text-sm">{site.logo}</span>
          <h1 className="t-primary text-xl font-bold tracking-tight">管理后台</h1>
          <p className="t-muted mt-1.5 text-sm">{site.name}</p>
        </div>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="t-secondary mb-1.5 block text-sm font-medium">
              管理员密码
            </label>
            <input
              type="password"
              name="password"
              required
              autoFocus
              placeholder="请输入密码"
              className="input-field"
            />
          </div>
          {state?.error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
              {state.error}
            </p>
          )}
          <button type="submit" disabled={pending} className="btn-primary w-full py-2.5">
            {pending ? "登录中…" : "登录"}
          </button>
        </form>
        <p className="t-faint mt-5 text-center text-xs">
          默认密码 admin123
        </p>
      </div>
      </div>
    </div>
  );
}
