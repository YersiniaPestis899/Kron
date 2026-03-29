import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../db/kron.db');

mkdirSync(join(__dirname, '../db'), { recursive: true });

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

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

db.close();
console.log('DB initialized at', DB_PATH);
