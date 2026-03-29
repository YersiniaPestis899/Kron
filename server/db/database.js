import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
// In production (Fly.io), DB_PATH points to the persistent volume (/data/kron.db)
const DB_PATH = process.env.DB_PATH || join(__dirname, '../../db/kron.db');
const DB_DIR  = dirname(DB_PATH);

mkdirSync(DB_DIR, { recursive: true });

let _db = null;

export function getDb() {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    ensureSchema(_db);
  }
  return _db;
}

function ensureSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      guid         TEXT NOT NULL,
      title        TEXT NOT NULL,
      url          TEXT NOT NULL,
      summary      TEXT,
      category     TEXT NOT NULL,
      source_name  TEXT NOT NULL,
      published_at DATETIME,
      fetched_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(guid)
    );
    CREATE TABLE IF NOT EXISTS fetch_sessions (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      started_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at  DATETIME,
      article_count INTEGER DEFAULT 0,
      status        TEXT DEFAULT 'running'
    );
    CREATE INDEX IF NOT EXISTS idx_articles_fetched_at ON articles(fetched_at);
    CREATE INDEX IF NOT EXISTS idx_articles_category   ON articles(category);
    CREATE INDEX IF NOT EXISTS idx_articles_published  ON articles(published_at);
  `);
}

export function getArticles({ category = 'all', at = null, limit = 50, offset = 0 } = {}) {
  const db = getDb();
  const params = [];
  let where = '';

  if (at) {
    where += ' AND fetched_at <= ?';
    params.push(at);
  }

  if (category !== 'all') {
    where += ' AND category = ?';
    params.push(category);
  }

  const rows = db.prepare(`
    SELECT id, guid, title, url, summary, category, source_name, published_at, fetched_at
    FROM articles
    WHERE 1=1 ${where}
    ORDER BY COALESCE(published_at, fetched_at) DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  const total = db.prepare(`
    SELECT COUNT(*) as n FROM articles WHERE 1=1 ${where}
  `).get(...params).n;

  return { articles: rows, total };
}

export function insertArticle(article) {
  const db = getDb();
  return db.prepare(`
    INSERT OR IGNORE INTO articles (guid, title, url, summary, category, source_name, published_at, fetched_at)
    VALUES (@guid, @title, @url, @summary, @category, @source_name, @published_at, @fetched_at)
  `).run(article);
}

export function startSession() {
  const db = getDb();
  const result = db.prepare(`INSERT INTO fetch_sessions (started_at, status) VALUES (CURRENT_TIMESTAMP, 'running')`).run();
  return result.lastInsertRowid;
}

export function completeSession(id, count, status = 'success') {
  const db = getDb();
  db.prepare(`
    UPDATE fetch_sessions SET completed_at = CURRENT_TIMESTAMP, article_count = ?, status = ? WHERE id = ?
  `).run(count, status, id);
}

export function getSnapshots(limit = 100) {
  const db = getDb();
  return db.prepare(`
    SELECT id, started_at, completed_at, article_count, status
    FROM fetch_sessions
    WHERE status IN ('success', 'partial')
    ORDER BY started_at DESC
    LIMIT ?
  `).all(limit);
}

export function getCategoryStats() {
  const db = getDb();
  return db.prepare(`
    SELECT category, COUNT(*) as count
    FROM articles
    GROUP BY category
    ORDER BY count DESC
  `).all();
}
