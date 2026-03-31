<script>
  import { onMount } from 'svelte';
  import NewsGrid from '$lib/components/news/NewsGrid.svelte';
  import {
    articles, loading, error,
    currentCategory, categoryCounts, totalCount, lastUpdated
  } from '$lib/stores/news.js';
  import { isArchiveMode, selectedTimestamp } from '$lib/stores/timeMachine.js';
  import { fetchNews, fetchCategories } from '$lib/api.js';
  import { getCategoryInfo } from '$lib/utils/categoryMap.js';

  let initialized = false;

  async function loadNews() {
    loading.set(true);
    error.set(null);
    try {
      const at = $isArchiveMode ? $selectedTimestamp : null;
      const data = await fetchNews({ category: $currentCategory, at });
      articles.set(data.articles || []);
      totalCount.set(data.total || 0);
      if (!$isArchiveMode) lastUpdated.set(new Date().toISOString());
    } catch(e) {
      error.set(e.message);
      articles.set([]);
    } finally {
      loading.set(false);
    }
  }

  async function loadCounts() {
    try {
      const data = await fetchCategories();
      const counts = {};
      for (const row of (data.categories || [])) {
        counts[row.category] = row.count;
      }
      counts['all'] = Object.values(counts).reduce((a, b) => a + b, 0);
      categoryCounts.set(counts);
    } catch(e) {
      console.warn('Failed to load category counts:', e.message);
    }
  }

  $: if (initialized) {
    $currentCategory;
    $isArchiveMode;
    $selectedTimestamp;
    loadNews();
  }

  onMount(async () => {
    loadCounts();
    initialized = true;
    const interval = setInterval(loadCounts, 60000);
    return () => clearInterval(interval);
  });

  $: catInfo = getCategoryInfo($currentCategory);
</script>

<div class="page-header">
  <div class="page-title">
    <span class="cat-icon" style="color: {catInfo.color}">{catInfo.icon}</span>
    <h1>{catInfo.label}</h1>
    {#if $totalCount > 0}
      <span class="count mono">{$totalCount.toLocaleString()} 件</span>
    {/if}
  </div>
  <div class="page-status mono">
    {#if $loading}
      <span class="status-dot loading"></span>
      <span class="status-text">取得中</span>
    {:else}
      <span class="status-dot ready"></span>
      <span class="status-text">最新</span>
    {/if}
  </div>
</div>

{#if $error}
  <div class="error-banner">
    <span class="mono error-label">⚠ API接続エラー</span>
    <span class="error-msg">{$error}</span>
    <button class="retry-btn mono" on:click={loadNews}>再試行</button>
  </div>
{/if}

<NewsGrid />

<style>
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 12px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }

  .page-title {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cat-icon {
    font-size: 0.95rem;
    line-height: 1;
  }

  h1 {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 1.15rem;
    color: var(--text-bright);
    letter-spacing: -0.01em;
  }

  .count {
    font-size: 0.68rem;
    color: var(--text-dim);
    letter-spacing: 0.08em;
    padding: 2px 8px;
    border: 1px solid var(--border);
    border-radius: 3px;
    background: var(--bg-card);
  }

  .page-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.62rem;
    letter-spacing: 0.10em;
    color: var(--text-dim);
    text-transform: uppercase;
  }

  .status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .status-dot.ready {
    background: var(--green);
    box-shadow: 0 0 5px rgba(40, 200, 128, 0.4);
  }

  .status-dot.loading {
    background: var(--amber);
    box-shadow: 0 0 5px rgba(192, 144, 64, 0.4);
    animation: status-blink 0.8s ease-in-out infinite;
  }

  @keyframes status-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }

  .status-text {
    color: var(--text-dim);
  }

  /* ── Error banner ── */
  .error-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 16px;
    background: rgba(204, 61, 108, 0.08);
    border: 1px solid rgba(204, 61, 108, 0.25);
    border-radius: 6px;
    margin-bottom: 20px;
    font-size: 0.84rem;
  }

  .error-label {
    color: var(--magenta);
    letter-spacing: 0.06em;
    font-size: 0.72rem;
    flex-shrink: 0;
  }

  .error-msg {
    color: var(--text-body);
    font-size: 0.82rem;
    flex: 1;
  }

  .retry-btn {
    font-size: 0.70rem;
    letter-spacing: 0.06em;
    color: var(--magenta);
    padding: 4px 10px;
    border: 1px solid rgba(204, 61, 108, 0.35);
    border-radius: 3px;
    transition: all var(--t-fast);
    flex-shrink: 0;
  }

  .retry-btn:hover {
    background: rgba(204, 61, 108, 0.12);
  }
</style>
