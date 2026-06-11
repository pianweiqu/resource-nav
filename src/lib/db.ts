import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { seedData } from "./seed";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "app.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  fs.mkdirSync(DB_DIR, { recursive: true });
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  init(_db);
  return _db;
}

function init(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      parent_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
      sort_order INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const count = db.prepare("SELECT COUNT(*) AS c FROM categories").get() as {
    c: number;
  };
  if (count.c === 0) seed(db);
}

function seed(db: Database.Database) {
  const insertCat = db.prepare(
    "INSERT INTO categories (name, slug, parent_id, sort_order) VALUES (?, ?, ?, ?)"
  );
  const insertRes = db.prepare(
    "INSERT INTO resources (title, url, description, category_id, sort_order) VALUES (?, ?, ?, ?, ?)"
  );

  const tx = db.transaction(() => {
    let groupOrder = 0;
    for (const group of seedData) {
      const groupId = insertCat.run(
        group.name,
        group.slug,
        null,
        groupOrder++
      ).lastInsertRowid as number;

      let childOrder = 0;
      for (const child of group.children ?? []) {
        const childId = insertCat.run(
          child.name,
          child.slug,
          groupId,
          childOrder++
        ).lastInsertRowid as number;
        let resOrder = 0;
        for (const r of child.resources ?? []) {
          insertRes.run(r.title, r.url, r.description ?? "", childId, resOrder++);
        }
      }

      let resOrder = 0;
      for (const r of group.resources ?? []) {
        insertRes.run(r.title, r.url, r.description ?? "", groupId, resOrder++);
      }
    }
  });
  tx();
}

// ---------- Types ----------

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  sort_order: number;
}

export interface Resource {
  id: number;
  title: string;
  url: string;
  description: string;
  category_id: number;
  sort_order: number;
  created_at: string;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
  resources: Resource[];
}

// ---------- Queries ----------

export function getAllCategories(): Category[] {
  return getDb()
    .prepare("SELECT * FROM categories ORDER BY sort_order, id")
    .all() as Category[];
}

export function getAllResources(): Resource[] {
  return getDb()
    .prepare("SELECT * FROM resources ORDER BY sort_order, id")
    .all() as Resource[];
}

export function getCategoryTree(): CategoryNode[] {
  const cats = getAllCategories();
  const resources = getAllResources();

  const nodeMap = new Map<number, CategoryNode>();
  for (const c of cats) {
    nodeMap.set(c.id, { ...c, children: [], resources: [] });
  }
  for (const r of resources) {
    nodeMap.get(r.category_id)?.resources.push(r);
  }
  const roots: CategoryNode[] = [];
  for (const node of nodeMap.values()) {
    if (node.parent_id && nodeMap.has(node.parent_id)) {
      nodeMap.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export function countStats() {
  const db = getDb();
  const cats = (db.prepare("SELECT COUNT(*) c FROM categories").get() as { c: number }).c;
  const res = (db.prepare("SELECT COUNT(*) c FROM resources").get() as { c: number }).c;
  return { categories: cats, resources: res };
}

// ---------- Mutations ----------

export function createCategory(data: {
  name: string;
  slug: string;
  parentId: number | null;
  sortOrder: number;
}) {
  getDb()
    .prepare(
      "INSERT INTO categories (name, slug, parent_id, sort_order) VALUES (?, ?, ?, ?)"
    )
    .run(data.name, data.slug, data.parentId, data.sortOrder);
}

export function updateCategory(
  id: number,
  data: { name: string; slug: string; parentId: number | null; sortOrder: number }
) {
  getDb()
    .prepare(
      "UPDATE categories SET name = ?, slug = ?, parent_id = ?, sort_order = ? WHERE id = ?"
    )
    .run(data.name, data.slug, data.parentId, data.sortOrder, id);
}

export function deleteCategory(id: number) {
  getDb().prepare("DELETE FROM categories WHERE id = ?").run(id);
}

export function createResource(data: {
  title: string;
  url: string;
  description: string;
  categoryId: number;
  sortOrder: number;
}) {
  getDb()
    .prepare(
      "INSERT INTO resources (title, url, description, category_id, sort_order) VALUES (?, ?, ?, ?, ?)"
    )
    .run(data.title, data.url, data.description, data.categoryId, data.sortOrder);
}

export function updateResource(
  id: number,
  data: {
    title: string;
    url: string;
    description: string;
    categoryId: number;
    sortOrder: number;
  }
) {
  getDb()
    .prepare(
      "UPDATE resources SET title = ?, url = ?, description = ?, category_id = ?, sort_order = ? WHERE id = ?"
    )
    .run(data.title, data.url, data.description, data.categoryId, data.sortOrder, id);
}

export function deleteResource(id: number) {
  getDb().prepare("DELETE FROM resources WHERE id = ?").run(id);
}

export function getResourceById(id: number): Resource | undefined {
  return getDb().prepare("SELECT * FROM resources WHERE id = ?").get(id) as
    | Resource
    | undefined;
}

export function getCategoryById(id: number): Category | undefined {
  return getDb().prepare("SELECT * FROM categories WHERE id = ?").get(id) as
    | Category
    | undefined;
}
