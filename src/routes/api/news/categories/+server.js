import { json } from '@sveltejs/kit';
import { getCategoryStats } from '../../../../../server/db/database.js';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  try {
    const categories = getCategoryStats();
    return json({ categories });
  } catch (err) {
    console.error('[api/news/categories]', err);
    return json({ error: 'Database error' }, { status: 500 });
  }
}
