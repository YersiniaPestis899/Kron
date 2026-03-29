import Parser from 'rss-parser';
import { FEEDS } from './feedConfig.js';
import { insertArticle, startSession, completeSession } from '../db/database.js';

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'KRON/1.0 news-aggregator' },
  customFields: {
    item: [['media:thumbnail', 'mediaThumbnail'], ['enclosure', 'enclosure']]
  }
});

function cleanText(str) {
  if (!str) return null;
  return str
    .replace(/<script[\s\S]*?<\/script>/gi, '') // strip script blocks with content
    .replace(/<style[\s\S]*?<\/style>/gi, '')   // strip style blocks
    .replace(/<[^>]*>/g, '')                     // strip remaining HTML tags
    .replace(/javascript:/gi, '')                // strip JS protocol references
    .replace(/data:/gi, '')                      // strip data URI references
    .replace(/\x00/g, '')                        // strip null bytes
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')                        // normalize whitespace
    .trim()
    .slice(0, 500) || null;
}

function isValidHttpUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d.toISOString();
  } catch {
    return null;
  }
}

async function fetchFeed(feed) {
  try {
    const result = await parser.parseURL(feed.url);
    const items = result.items || [];
    let inserted = 0;

    for (const item of items) {
      const guid = item.guid || item.link || item.id;
      if (!guid || !item.title || !item.link) continue;
      if (!isValidHttpUrl(item.link)) continue; // reject non-http(s) URLs

      const r = insertArticle({
        guid:         guid.slice(0, 1000),
        title:        cleanText(item.title),
        url:          (item.link || '').slice(0, 1000),
        summary:      cleanText(item.contentSnippet || item.summary || item.content),
        category:     feed.category,
        source_name:  feed.name,
        published_at: parseDate(item.pubDate || item.isoDate),
        fetched_at:   new Date().toISOString(),
      });

      if (r.changes > 0) inserted++;
    }

    console.log(`[${feed.name}] fetched ${items.length} items, ${inserted} new`);
    return inserted;
  } catch (err) {
    console.warn(`[${feed.name}] failed: ${err.message}`);
    return 0;
  }
}

export async function fetchAllFeeds() {
  const sessionId = startSession();
  console.log(`\n=== fetch session #${sessionId} started ===`);

  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  const totalNew = results.reduce((sum, r) => sum + (r.status === 'fulfilled' ? r.value : 0), 0);
  const failed = results.filter(r => r.status === 'rejected').length;

  const status = failed === 0 ? 'success' : totalNew > 0 ? 'partial' : 'failed';
  completeSession(sessionId, totalNew, status);
  console.log(`=== session #${sessionId} complete: ${totalNew} new articles, status=${status} ===\n`);

  return { totalNew, status };
}
