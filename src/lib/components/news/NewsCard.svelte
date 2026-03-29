<script>
  import { getCategoryInfo } from '$lib/utils/categoryMap.js';
  import { timeAgo } from '$lib/utils/dateFormat.js';

  export let article;
  export let index = 0;

  $: cat = getCategoryInfo(article.category);
  $: delay = `${index * 40}ms`;
</script>

<a
  href={article.url}
  target="_blank"
  rel="noopener noreferrer"
  class="card"
  style="--cat-color: {cat.color}; animation-delay: {delay}"
>
  <div class="card-top">
    <span class="badge" style="color: {cat.color}; border-color: {cat.color}40;">
      {cat.icon} {cat.label}
    </span>
    <span class="source mono">{article.source_name}</span>
  </div>

  <h2 class="title">{article.title}</h2>

  {#if article.summary}
    <p class="summary">{article.summary.slice(0, 120)}{article.summary.length > 120 ? '…' : ''}</p>
  {/if}

  <div class="card-bottom">
    <span class="time mono">{timeAgo(article.published_at || article.fetched_at)}</span>
    <span class="link-icon">→</span>
  </div>

  <div class="card-glow"></div>
</a>

<style>
  .card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 18px;
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    transition: transform var(--t-mid) var(--ease),
                border-color var(--t-mid) var(--ease),
                box-shadow var(--t-mid) var(--ease);
    animation: scan-enter var(--t-slow) var(--ease) both;
  }

  .card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: var(--cat-color);
    opacity: 0;
    transition: opacity var(--t-mid);
  }

  .card:hover {
    transform: translateY(-3px);
    border-color: rgba(var(--cat-color), 0.3);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px var(--border-card);
  }

  .card:hover::before {
    opacity: 1;
  }

  .card-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, var(--cyan-dim), transparent 70%);
    opacity: 0;
    transition: opacity var(--t-mid);
    pointer-events: none;
  }

  .card:hover .card-glow {
    opacity: 1;
  }

  .card-top {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .badge {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    letter-spacing: 0.06em;
    padding: 2px 7px;
    border: 1px solid;
    border-radius: 3px;
    white-space: nowrap;
  }

  .source {
    font-size: 0.7rem;
    color: var(--text-dim);
    letter-spacing: 0.04em;
    margin-left: auto;
  }

  .title {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 0.96rem;
    color: var(--text-bright);
    line-height: 1.45;
    transition: color var(--t-fast);
  }

  .card:hover .title {
    color: #fff;
  }

  .summary {
    font-size: 0.82rem;
    color: var(--text-muted);
    line-height: 1.6;
  }

  .card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
  }

  .time {
    font-size: 0.7rem;
    color: var(--text-dim);
    letter-spacing: 0.05em;
  }

  .link-icon {
    font-size: 0.85rem;
    color: var(--text-dim);
    transition: color var(--t-fast), transform var(--t-fast);
  }

  .card:hover .link-icon {
    color: var(--cyan-bright);
    transform: translateX(3px);
  }
</style>
