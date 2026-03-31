<script>
  import { articles } from '$lib/stores/news.js';
  import { derived } from 'svelte/store';

  const tickerItems = derived(articles, $a =>
    $a.slice(0, 20).map(a => a.title)
  );
</script>

{#if $tickerItems.length > 0}
<div class="ticker">
  <div class="ticker-label mono">
    <span class="live-dot"></span>
    LIVE
  </div>
  <div class="ticker-track">
    <div class="ticker-content">
      {#each $tickerItems as title}
        <span class="ticker-item">{title}</span>
        <span class="ticker-sep" aria-hidden="true">▸</span>
      {/each}
      {#each $tickerItems as title}
        <span class="ticker-item">{title}</span>
        <span class="ticker-sep" aria-hidden="true">▸</span>
      {/each}
    </div>
  </div>
</div>
{/if}

<style>
  .ticker {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: var(--ticker-h);
    background: var(--bg-sidebar);
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    overflow: hidden;
    z-index: 100;
  }

  .ticker-label {
    flex-shrink: 0;
    padding: 0 14px;
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    color: var(--cyan);
    border-right: 1px solid var(--border);
    height: 100%;
    display: flex;
    align-items: center;
    gap: 7px;
    background: var(--cyan-dim);
    min-width: 64px;
  }

  .live-dot {
    width: 5px;
    height: 5px;
    background: var(--cyan);
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 6px var(--cyan);
    animation: live-pulse 2s ease-in-out infinite;
  }

  @keyframes live-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }

  .ticker-track {
    flex: 1;
    overflow: hidden;
  }

  .ticker-content {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    animation: ticker-scroll 90s linear infinite;
  }

  .ticker-content:hover {
    animation-play-state: paused;
  }

  .ticker-item {
    font-family: var(--font-display);
    font-size: 0.78rem;
    color: var(--text-muted);
    padding: 0 6px;
    transition: color var(--t-fast);
  }

  .ticker-item:hover {
    color: var(--text-body);
  }

  .ticker-sep {
    font-size: 0.50rem;
    color: var(--text-dim);
    padding: 0 10px;
    opacity: 0.5;
  }

  @keyframes ticker-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
</style>
