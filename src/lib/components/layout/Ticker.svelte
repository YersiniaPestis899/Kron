<script>
  import { articles } from '$lib/stores/news.js';
  import { derived } from 'svelte/store';

  // 最新20件のタイトルをティッカー用に
  const tickerItems = derived(articles, $a =>
    $a.slice(0, 20).map(a => a.title)
  );
</script>

{#if $tickerItems.length > 0}
<div class="ticker">
  <div class="ticker-label mono">LIVE</div>
  <div class="ticker-track">
    <div class="ticker-content">
      {#each $tickerItems as title}
        <span class="ticker-item">{title}</span>
        <span class="ticker-sep" aria-hidden="true">◆</span>
      {/each}
      <!-- Duplicate for seamless loop -->
      {#each $tickerItems as title}
        <span class="ticker-item">{title}</span>
        <span class="ticker-sep" aria-hidden="true">◆</span>
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
    font-size: 0.65rem;
    letter-spacing: 0.14em;
    color: var(--cyan);
    border-right: 1px solid var(--border);
    height: 100%;
    display: flex;
    align-items: center;
    background: var(--cyan-dim);
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
    padding: 0 4px;
    transition: color var(--t-fast);
  }

  .ticker-item:hover {
    color: var(--text-body);
  }

  .ticker-sep {
    font-size: 0.45rem;
    color: var(--text-dim);
    padding: 0 12px;
  }

  @keyframes ticker-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
</style>
