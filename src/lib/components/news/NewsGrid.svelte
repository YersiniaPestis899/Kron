<script>
  import { articles, loading } from '$lib/stores/news.js';
  import NewsCard from './NewsCard.svelte';
  import FeaturedCard from './FeaturedCard.svelte';

  $: featured  = $articles[0] || null;
  $: rest      = $articles.slice(1);
</script>

<div class="grid-wrap">
  {#if $loading}
    <div class="skeletons">
      <div class="skeleton sk-featured"></div>
      <div class="sk-grid">
        {#each Array(6) as _}
          <div class="skeleton sk-card"></div>
        {/each}
      </div>
    </div>
  {:else if $articles.length === 0}
    <div class="empty">
      <div class="empty-icon mono">◈</div>
      <p>記事を取得中です…</p>
      <p class="dim">サーバーが起動していることを確認してください</p>
    </div>
  {:else}
    {#if featured}
      <div class="featured-wrap">
        <FeaturedCard article={featured} />
      </div>
    {/if}

    {#if rest.length > 0}
      <div class="cards-grid">
        {#each rest as article, i}
          <NewsCard {article} index={i} />
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .grid-wrap {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .featured-wrap {
    width: 100%;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
  }

  /* Skeletons */
  .skeletons {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .sk-featured {
    height: 220px;
    border-radius: 10px;
  }

  .sk-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
  }

  .sk-card {
    height: 160px;
    border-radius: 8px;
  }

  /* Empty state */
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    gap: 10px;
    color: var(--text-muted);
    text-align: center;
  }

  .empty-icon {
    font-size: 2.5rem;
    color: var(--text-dim);
    margin-bottom: 8px;
    animation: skeleton-pulse 2s ease-in-out infinite;
  }

  .empty p { font-size: 0.9rem; }
  .empty .dim { color: var(--text-dim); font-size: 0.8rem; }

  @media (max-width: 640px) {
    .grid-wrap { gap: 16px; }
    .cards-grid { grid-template-columns: 1fr; gap: 10px; }
    .sk-grid { grid-template-columns: 1fr; gap: 10px; }
    .sk-featured { height: 160px; }
    .sk-card { height: 120px; }
  }
</style>
