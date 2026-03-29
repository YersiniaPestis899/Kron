import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // adapter-node: builds a Node.js HTTP server at build/index.js
    // Handles pages, API routes, and static assets in one process.
    adapter: adapter({
      out: 'build',
      precompress: true  // pre-compress assets with gzip/brotli
    })
  }
};

export default config;
