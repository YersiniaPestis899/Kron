import { json } from '@sveltejs/kit';
import { getSnapshots } from '../../../../server/db/database.js';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  try {
    const snapshots = getSnapshots(200);
    return json({ snapshots });
  } catch (err) {
    console.error('[api/snapshots]', err);
    return json({ error: 'Database error' }, { status: 500 });
  }
}
