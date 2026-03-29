import { Hono } from 'hono';
import { getSnapshots } from '../db/database.js';

const snapshots = new Hono();

snapshots.get('/', (c) => {
  try {
    const data = getSnapshots(200);
    return c.json({ snapshots: data });
  } catch (err) {
    return c.json({ error: 'Database error' }, 500);
  }
});

export default snapshots;
