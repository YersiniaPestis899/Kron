<script>
  import { getCategoryInfo } from '$lib/utils/categoryMap.js';
  import { timeAgo } from '$lib/utils/dateFormat.js';

  export let article;

  $: cat = getCategoryInfo(article.category);
</script>

<a
  href={article.url}
  target="_blank"
  rel="noopener noreferrer"
  class="featured"
  style="--cat-color: {cat.color}"
>
  <div class="featured-inner">
    <div class="featured-meta">
      <span class="badge" style="color: {cat.color}; background: {cat.color}18; border-color: {cat.color}40;">
        {cat.icon} {cat.label}
      </span>
      <span class="source mono">{article.source_name}</span>
      <span class="divider">·</span>
      <span class="time mono">{timeAgo(article.published_at || article.fetched_at)}</span>
    </div>

    <h1 class="featured-title">{article.title}</h1>

    {#if article.summary}
      <p class="featured-summary">{article.summary.slice(0, 220)}{article.summary.length > 220 ? '…' : ''}</p>
    {/if}

    <div class="featured-cta">
      <span>記事を読む</span>
      <span class="arrow">→</span>
    </div>
  </div>

  <div class="featured-bg"></div>
  <div class="featured-border-glow"></div>
</a>

<style>
  .featured {
    display: block;
    position: relative;
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 10px;
    overflow: hidden;
    transition: transform var(--t-mid) var(--ease),
                box-shadow var(--t-mid) var(--ease);
    animation: scan-enter var(--t-slow) var(--ease) both;
  }

  .featured:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px var(--border-active);
  }

  .featured-inner {
    position: relative;
    z-index: 1;
    padding: 32px 36px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .featured-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .badge {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    padding: 3px 10px;
    border: 1px solid;
    border-radius: 3px;
  }

  .source {
    font-size: 0.78rem;
    color: var(--text-muted);
    letter-spacing: 0.04em;
  }

  .divider { color: var(--text-dim); }

  .time {
    font-size: 0.75rem;
    color: var(--text-dim);
    letter-spacing: 0.04em;
  }

  .featured-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(1.2rem, 2.5vw, 1.8rem);
    color: var(--text-bright);
    line-height: 1.3;
    letter-spacing: -0.01em;
    transition: color var(--t-fast);
  }

  .featured:hover .featured-title { color: #fff; }

  .featured-summary {
    font-size: 0.9rem;
    color: var(--text-body);
    line-height: 1.7;
    max-width: 72ch;
  }

  .featured-cta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--cyan);
    letter-spacing: 0.06em;
    margin-top: 4px;
    transition: gap var(--t-fast);
  }

  .featured:hover .featured-cta { gap: 14px; }

  .arrow { transition: transform var(--t-fast); }
  .featured:hover .arrow { transform: translateX(4px); }

  .featured-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 80% 50%, var(--cat-color, var(--cyan))0a, transparent 60%),
      radial-gradient(ellipse at 20% -20%, var(--cyan-dim), transparent 50%);
    pointer-events: none;
  }

  .featured-border-glow {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--cat-color, var(--cyan)), transparent);
    opacity: 0;
    transition: opacity var(--t-mid);
  }

  .featured:hover .featured-border-glow { opacity: 0.7; }

  @media (max-width: 640px) {
    .featured-inner {
      padding: 20px 18px;
      gap: 12px;
    }

    .featured-title {
      font-size: 1.15rem;
    }

    .featured-summary {
      font-size: 0.85rem;
      line-height: 1.6;
    }
  }
</style>
