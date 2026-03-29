import cron from 'node-cron';
import { fetchAllFeeds } from './fetcher.js';

export function startScheduler() {
  // Immediate fetch on startup
  fetchAllFeeds().catch(console.error);

  // Every 15 minutes
  cron.schedule('*/15 * * * *', () => {
    fetchAllFeeds().catch(console.error);
  });

  console.log('Scheduler started: fetching every 15 minutes');
}
