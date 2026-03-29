import { json } from '@sveltejs/kit';
import { getArticles } from '../../../../server/db/database.js';

const VALID_CATEGORIES = new Set([
  'all', 'japan', 'world', 'tech', 'business', 'science', 'entertainment', 'sports'
]);
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const rawCategory = url.searchParams.get('category') || 'all';
  const category = VALID_CATEGORIES.has(rawCategory) ? rawCategory : 'all';

  const rawAt = url.searchParams.get('at');
  const at = rawAt && ISO_DATE_RE.test(rawAt) ? rawAt.slice(0, 30) : null;

  const rawLimit = parseInt(url.searchParams.get('limit') || '50', 10);
  const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(rawLimit, 200)) : 50;

  const rawOffset = parseInt(url.searchParams.get('offset') || '0', 10);
  const offset = Number.isFinite(rawOffset) ? Math.max(0, rawOffset) : 0;

  try {
    const result = getArticles({ category, at, limit, offset });
    return json({ ...result, category, at, limit, offset });
  } catch (err) {
    console.error('[api/news]', err);
    return json({ error: 'Database error' }, { status: 500 });
  }
}
