"use client";

import { useMemo, useState } from "react";
import type { Category, Resource } from "@/lib/db";
import {
  createResourceAction,
  updateResourceAction,
  deleteResourceAction,
} from "../actions";

interface Props {
  categories: Category[];
  resources: Resource[];
}

const inputCls = "input-field";

function categoryLabel(c: Category, categories: Category[]) {
  if (!c.parent_id) return c.name;
  const parent = categories.find((p) => p.id === c.parent_id);
  return parent ? `${parent.name} / ${c.name}` : c.name;
}

function ResourceForm({
  resource,
  categories,
  onDone,
}: {
  resource?: Resource;
  categories: Category[];
  onDone?: () => void;
}) {
  const action = resource ? updateResourceAction : createResourceAction;
  return (
    <form
      action={async (fd) => {
        await action(fd);
        onDone?.();
      }}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {resource && <input type="hidden" name="id" value={resource.id} />}
      <div>
        <label className="mb-1 block text-xs font-medium t-muted">名称</label>
        <input
          name="title"
          required
          defaultValue={resource?.title}
          placeholder="如：GitHub"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium t-muted">网址</label>
        <input
          name="url"
          type="url"
          required
          defaultValue={resource?.url}
          placeholder="https://…"
          className={inputCls}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-xs font-medium t-muted">描述</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={resource?.description}
          placeholder="一句话介绍这个资源"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium t-muted">
          所属分类
        </label>
        <select
          name="categoryId"
          required
          defaultValue={resource?.category_id ?? ""}
          className={inputCls}
        >
          <option value="" disabled>
            请选择分类
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {categoryLabel(c, categories)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium t-muted">排序</label>
        <input
          type="number"
          name="sortOrder"
          defaultValue={resource?.sort_order ?? 0}
          className={inputCls}
        />
      </div>
      <div className="flex items-end gap-2 sm:col-span-2">
        <button type="submit" className="btn-primary">
          {resource ? "保存修改" : "添加资源"}
        </button>
        {onDone && (
          <button type="button" onClick={onDone} className="btn-secondary">
            取消
          </button>
        )}
      </div>
    </form>
  );
}

export default function ResourceManager({ categories, resources }: Props) {
  const [filterCat, setFilterCat] = useState<string>("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(() => {
    let list = resources;
    if (filterCat) {
      const catId = Number(filterCat);
      const childIds = categories
        .filter((c) => c.parent_id === catId)
        .map((c) => c.id);
      const ids = new Set([catId, ...childIds]);
      list = list.filter((r) => ids.has(r.category_id));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.url.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [resources, categories, filterCat, search]);

  const catName = (id: number) => {
    const c = categories.find((x) => x.id === id);
    return c ? categoryLabel(c, categories) : "未知分类";
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight t-primary">资源管理</h1>
        <span className="text-sm t-faint">共 {filtered.length} 条</span>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="btn-primary ml-auto"
        >
          {showCreate ? "收起" : "+ 新增资源"}
        </button>
      </div>

      {showCreate && (
        <div className="card mb-6 p-5">
          <h2 className="mb-4 font-semibold t-secondary">新增资源</h2>
          <ResourceForm
            categories={categories}
            onDone={() => setShowCreate(false)}
          />
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="input-field !w-auto"
        >
          <option value="">全部分类</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {categoryLabel(c, categories)}
            </option>
          ))}
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索名称 / 网址 / 描述…"
          className="input-field w-64"
        />
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm t-muted">暂无资源</p>
        ) : (
          filtered.map((r) => (
            <div key={r.id}>
              <div className="flex items-center gap-3 border-b px-4 py-3 transition" style={{ borderColor: "var(--table-divide)" }}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium t-secondary">{r.title}</span>
                    <span className="badge-count shrink-0">
                      {catName(r.category_id)}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs t-muted">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-accent"
                    >
                      {r.url}
                    </a>
                    {r.description && <span className="ml-2">{r.description}</span>}
                  </p>
                </div>
                <button
                  onClick={() => setEditingId(editingId === r.id ? null : r.id)}
                  className="link-accent rounded-md px-2 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/5"
                >
                  编辑
                </button>
                <form
                  action={deleteResourceAction}
                  onSubmit={(e) => {
                    if (!confirm(`确认删除「${r.title}」？`)) e.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={r.id} />
                  <button className="rounded-md px-2 py-1 text-sm text-red-500 hover:bg-red-50">
                    删除
                  </button>
                </form>
              </div>
              {editingId === r.id && (
                <div className="edit-panel px-4 py-4">
                  <ResourceForm
                    resource={r}
                    categories={categories}
                    onDone={() => setEditingId(null)}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
