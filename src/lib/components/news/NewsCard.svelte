<script>
  import { getCategoryInfo } from '$lib/utils/categoryMap.js';
  import { timeAgo } from '$lib/utils/dateFormat.js';

  export let article;
  export let index = 0;

  $: cat   = getCategoryInfo(article.category);
  $: delay = `${index * 40}ms`;
</script>

<a
  href={article.url}
  target="_blank"
  rel="noopener noreferrer"
  class="card"
  style="--cat-color: {cat.color}; animation-delay: {delay}"
>
  <!-- Category-colored top accent line (appears on hover) -->
  <div class="card-accent"></div>

  <div class="card-top">
    <span class="badge mono" style="color: {cat.color}; border-color: {cat.color}30;">
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
    <span class="link-icon mono">↗</span>
  </div>
</a>

<style>
  .card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 18px 18px 16px;
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 8px;
    position: relative;
    overflow: hidden;
    transition:
      transform var(--t-mid) var(--ease),
      border-color var(--t-mid) var(--ease),
      box-shadow var(--t-mid) var(--ease);
    animation: scan-enter var(--t-slow) var(--ease) both;
  }

  /* Subtle inner gradient for depth */
  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at 50% -20%,
      rgba(0, 200, 216, 0.03),
      transparent 70%
    );
    pointer-events: none;
  }

  .card:hover {
    transform: translateY(-3px);
    border-color: rgba(0, 200, 216, 0.14);
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.45),
      0 0 0 1px rgba(0, 200, 216, 0.08),
      0 4px 16px rgba(0, 0, 0, 0.3);
  }

  /* Category-colored top accent line */
  .card-accent {
    position: absolute;
    left: 0; top: 0; right: 0;
    height: 2px;
    background: var(--cat-color);
    opacity: 0;
    transition: opacity var(--t-mid);
  }

  .card:hover .card-accent {
    opacity: 0.85;
  }

  /* ── Header row ── */
  .card-top {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .badge {
    font-size: 0.62rem;
    letter-spacing: 0.06em;
    padding: 2px 6px;
    border: 1px solid;
    border-radius: 3px;
    white-space: nowrap;
    line-height: 1.5;
  }

  .source {
    font-size: 0.66rem;
    color: var(--text-dim);
    letter-spacing: 0.04em;
    margin-left: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }

  /* ── Title ── */
  .title {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text-bright);
    line-height: 1.45;
    transition: color var(--t-fast);
  }

  .card:hover .title {
    color: #fff;
  }

  /* ── Summary ── */
  .summary {
    font-size: 0.81rem;
    color: var(--text-muted);
    line-height: 1.62;
    flex: 1;
  }

  /* ── Bottom row ── */
  .card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 4px;
    border-top: 1px solid var(--border-card);
  }

  .time {
    font-size: 0.68rem;
    color: var(--text-dim);
    letter-spacing: 0.05em;
  }

  .link-icon {
    font-size: 0.78rem;
    color: var(--text-dim);
    transition: color var(--t-fast), transform var(--t-fast);
    line-height: 1;
  }

  .card:hover .link-icon {
    color: var(--cyan-bright);
    transform: translate(2px, -2px);
  }
</style>
