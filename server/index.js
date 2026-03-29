import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { readFileSync } from 'fs';
import newsRoutes from './routes/news.js';
import snapshotRoutes from './routes/snapshots.js';
import { startScheduler } from './feeds/scheduler.js';

const IS_PROD = process.env.NODE_ENV === 'production';
const PORT    = parseInt(process.env.PORT || '3001', 10);

const app = new Hono();

// ── Security headers ──────────────────────────────────────
app.use('*', secureHeaders({
  xFrameOptions: 'DENY',
  xXssProtection: '1; mode=block',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'no-referrer',
  permissionsPolicy: { camera: [], microphone: [], geolocation: [] },
}));

// ── CORS ──────────────────────────────────────────────────
// Dev: frontend Vite server talks to this API server cross-origin.
// Prod: same origin (Hono serves both), no cross-origin needed.
if (!IS_PROD) {
  app.use('*', cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    allowMethods: ['GET'],
    allowHeaders: [],
    maxAge: 600,
  }));
}

// ── Localhost-only guard (dev only) ───────────────────────
if (!IS_PROD) {
  app.use('/api/*', (c, next) => {
    const host = c.req.header('host') || '';
    if (!host.startsWith('localhost') && !host.startsWith('127.0.0.1')) {
      return c.json({ error: 'Forbidden' }, 403);
    }
    return next();
  });
}

// ── API routes ────────────────────────────────────────────
app.route('/api/news', newsRoutes);
app.route('/api/snapshots', snapshotRoutes);
app.get('/api/health', (c) => c.json({ status: 'ok', time: new Date().toISOString() }));

// ── Static files (production only) ───────────────────────
// Hono serves the SvelteKit build output and falls back to index.html
// for all non-file routes (SPA client-side routing).
if (IS_PROD) {
  app.use('/*', serveStatic({ root: './build' }));

  app.get('*', (c) => {
    try {
      return c.html(readFileSync('./build/index.html', 'utf-8'));
    } catch {
      return c.text('App not built. Run: npm run build', 503);
    }
  });
}

// ── Start ─────────────────────────────────────────────────
serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`KRON server running on http://localhost:${PORT} [${IS_PROD ? 'production' : 'development'}]`);
  startScheduler();
});
