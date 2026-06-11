"use client";

import { useState } from "react";
import type { Category } from "@/lib/db";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "../actions";

interface Props {
  categories: Category[];
  resourceCount: Record<number, number>;
}

const inputCls = "input-field";

function CategoryForm({
  category,
  parents,
  onDone,
}: {
  category?: Category;
  parents: Category[];
  onDone?: () => void;
}) {
  const action = category ? updateCategoryAction : createCategoryAction;
  return (
    <form
      action={async (fd) => {
        await action(fd);
        onDone?.();
      }}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {category && <input type="hidden" name="id" value={category.id} />}
      <div>
        <label className="mb-1 block text-xs font-medium t-muted">名称</label>
        <input
          name="name"
          required
          defaultValue={category?.name}
          placeholder="如：常用工具"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium t-muted">
          Slug（唯一标识）
        </label>
        <input
          name="slug"
          required
          defaultValue={category?.slug}
          placeholder="如：listening"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium t-muted">
          上级分类
        </label>
        <select
          name="parentId"
          defaultValue={category?.parent_id ?? ""}
          className={inputCls}
        >
          <option value="">（无 · 作为一级分类）</option>
          {parents
            .filter((p) => p.id !== category?.id)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium t-muted">排序</label>
        <input
          type="number"
          name="sortOrder"
          defaultValue={category?.sort_order ?? 0}
          className={inputCls}
        />
      </div>
      <div className="flex items-end gap-2 sm:col-span-2">
        <button type="submit" className="btn-primary">
          {category ? "保存修改" : "添加分类"}
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

export default function CategoryManager({ categories, resourceCount }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const parents = categories.filter((c) => !c.parent_id);
  const childrenOf = (id: number) =>
    categories.filter((c) => c.parent_id === id);

  const renderRow = (c: Category, isChild: boolean) => (
    <div key={c.id}>
      <div
        className={`flex items-center gap-3 border-b px-4 py-3 transition hover:bg-[var(--table-hover)] ${
          isChild ? "pl-10" : ""
        }`}
        style={{ borderColor: "var(--table-divide)" }}
      >
        <div className="min-w-0 flex-1">
          <span className="font-medium t-secondary">{c.name}</span>
          <span className="ml-2 text-xs t-muted">/{c.slug}</span>
        </div>
        <span className="text-xs t-muted">
          {resourceCount[c.id] ?? 0} 个资源 · 排序 {c.sort_order}
        </span>
        <button
          onClick={() => setEditingId(editingId === c.id ? null : c.id)}
          className="link-accent rounded-md px-2 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/5"
        >
          编辑
        </button>
        <form
          action={deleteCategoryAction}
          onSubmit={(e) => {
            if (
              !confirm(
                `确认删除「${c.name}」？其下的子分类和资源会一并删除。`
              )
            )
              e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={c.id} />
          <button className="rounded-md px-2 py-1 text-sm text-red-500 hover:bg-red-50">
            删除
          </button>
        </form>
      </div>
      {editingId === c.id && (
        <div className="edit-panel px-4 py-4">
          <CategoryForm
            category={c}
            parents={parents}
            onDone={() => setEditingId(null)}
          />
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight t-primary">分类管理</h1>

      <div className="card mb-8 p-5">
        <h2 className="mb-4 font-semibold t-secondary">新增分类</h2>
        <CategoryForm parents={parents} />
      </div>

      <div className="card overflow-hidden">
        {parents.map((p) => (
          <div key={p.id}>
            {renderRow(p, false)}
            {childrenOf(p.id).map((c) => renderRow(c, true))}
          </div>
        ))}
      </div>
    </div>
  );
}
