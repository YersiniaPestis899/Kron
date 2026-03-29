import { Hono } from 'hono';
import { getArticles, getCategoryStats } from '../db/database.js';

const VALID_CATEGORIES = new Set(['all', 'japan', 'world', 'tech', 'business', 'science', 'entertainment', 'sports']);
// ISO 8601 partial match: YYYY-MM-DDTHH:MM:SS
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

const news = new Hono();

news.get('/', (c) => {
  // Validate and sanitize all query parameters
  const rawCategory = c.req.query('category') || 'all';
  const category = VALID_CATEGORIES.has(rawCategory) ? rawCategory : 'all';

  const rawAt = c.req.query('at') || null;
  const at = rawAt && ISO_DATE_RE.test(rawAt) ? rawAt.slice(0, 30) : null;

  const rawLimit = parseInt(c.req.query('limit') || '50', 10);
  const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(rawLimit, 200)) : 50;

  const rawOffset = parseInt(c.req.query('offset') || '0', 10);
  const offset = Number.isFinite(rawOffset) ? Math.max(0, rawOffset) : 0;

  try {
    const result = getArticles({ category, at, limit, offset });
    return c.json({ ...result, category, at, limit, offset });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Database error' }, 500);
  }
});

news.get('/categories', (c) => {
  try {
    const stats = getCategoryStats();
    return c.json({ categories: stats });
  } catch (err) {
    return c.json({ error: 'Database error' }, 500);
  }
});

export default news;
