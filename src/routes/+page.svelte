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
      // Add 'all' total
      counts['all'] = Object.values(counts).reduce((a, b) => a + b, 0);
      categoryCounts.set(counts);
    } catch(e) {
      console.warn('Failed to load category counts:', e.message);
    }
  }

  // Single reactive block that tracks all fetch triggers.
  // Svelte only re-runs $: blocks when values explicitly READ inside them change.
  // All three stores must be read here, otherwise Svelte won't detect their changes.
  $: if (initialized) {
    $currentCategory;    // category switch in Sidebar
    $isArchiveMode;      // time machine toggle
    $selectedTimestamp;  // snapshot selection
    loadNews();
  }

  onMount(async () => {
    loadCounts(); // load in background, no need to await
    initialized = true; // triggers the $: block above → initial loadNews()
    const interval = setInterval(loadCounts, 60000);
    return () => clearInterval(interval);
  });

  $: catInfo = getCategoryInfo($currentCategory);
</script>

<div class="page-header">
  <div class="page-title">
    <span class="cat-icon" style="color: {catInfo.color}">{catInfo.icon}</span>
    <h1>{catInfo.label}</h1>
  </div>
  {#if $totalCount > 0}
    <span class="count mono">{$totalCount.toLocaleString()} 件</span>
  {/if}
</div>

{#if $error}
  <div class="error-banner">
    <span class="mono">⚠ API接続エラー</span>
    <span>{$error}</span>
    <button on:click={loadNews}>再試行</button>
  </div>
{/if}

<NewsGrid />

<style>
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;
    gap: 12px;
  }

  .page-title {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cat-icon {
    font-size: 1rem;
  }

  h1 {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 1.2rem;
    color: var(--text-bright);
    letter-spacing: -0.01em;
  }

  .count {
    font-size: 0.72rem;
    color: var(--text-dim);
    letter-spacing: 0.08em;
  }

  .error-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(196, 72, 120, 0.1);
    border: 1px solid rgba(196, 72, 120, 0.3);
    border-radius: 6px;
    margin-bottom: 20px;
    font-size: 0.85rem;
    color: var(--text-body);
  }

  .error-banner .mono {
    color: var(--magenta);
    letter-spacing: 0.06em;
    font-size: 0.75rem;
  }

  .error-banner button {
    margin-left: auto;
    color: var(--magenta);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 4px 10px;
    border: 1px solid rgba(196, 72, 120, 0.4);
    border-radius: 4px;
    transition: all var(--t-fast);
  }

  .error-banner button:hover { background: rgba(196, 72, 120, 0.15); }
</style>
