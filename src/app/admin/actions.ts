"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  createResource,
  updateResource,
  deleteResource,
} from "@/lib/db";
import {
  verifyPassword,
  createSession,
  destroySession,
  isAuthenticated,
} from "@/lib/auth";

async function requireAuth() {
  if (!(await isAuthenticated())) redirect("/admin/login");
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/resources");
}

// ---------- 认证 ----------

export async function loginAction(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    return { error: "密码错误" };
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- 分类 ----------

export async function createCategoryAction(formData: FormData) {
  await requireAuth();
  const parentRaw = String(formData.get("parentId") ?? "");
  createCategory({
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    parentId: parentRaw ? Number(parentRaw) : null,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  });
  revalidateAll();
}

export async function updateCategoryAction(formData: FormData) {
  await requireAuth();
  const parentRaw = String(formData.get("parentId") ?? "");
  updateCategory(Number(formData.get("id")), {
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    parentId: parentRaw ? Number(parentRaw) : null,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  });
  revalidateAll();
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAuth();
  deleteCategory(Number(formData.get("id")));
  revalidateAll();
}

// ---------- 资源 ----------

export async function createResourceAction(formData: FormData) {
  await requireAuth();
  createResource({
    title: String(formData.get("title") ?? "").trim(),
    url: String(formData.get("url") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    categoryId: Number(formData.get("categoryId")),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  });
  revalidateAll();
}

export async function updateResourceAction(formData: FormData) {
  await requireAuth();
  updateResource(Number(formData.get("id")), {
    title: String(formData.get("title") ?? "").trim(),
    url: String(formData.get("url") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    categoryId: Number(formData.get("categoryId")),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  });
  revalidateAll();
}

export async function deleteResourceAction(formData: FormData) {
  await requireAuth();
  deleteResource(Number(formData.get("id")));
  revalidateAll();
}
