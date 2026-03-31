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
  <!-- Top scan line — always slightly visible, brighter on hover -->
  <div class="featured-scanline"></div>

  <div class="featured-inner">
    <!-- Eyebrow row -->
    <div class="featured-eyebrow">
      <span class="eyebrow-tag mono">TOP STORY</span>
      <span class="eyebrow-sep">·</span>
      <span class="badge mono" style="color: {cat.color}; border-color: {cat.color}35; background: {cat.color}10;">
        {cat.icon} {cat.label}
      </span>
      <div class="eyebrow-meta">
        <span class="source mono">{article.source_name}</span>
        <span class="meta-sep">·</span>
        <span class="time mono">{timeAgo(article.published_at || article.fetched_at)}</span>
      </div>
    </div>

    <h1 class="featured-title">{article.title}</h1>

    {#if article.summary}
      <p class="featured-summary">{article.summary.slice(0, 220)}{article.summary.length > 220 ? '…' : ''}</p>
    {/if}

    <div class="featured-cta mono">
      <span>記事を読む</span>
      <span class="cta-arrow">↗</span>
    </div>
  </div>

  <!-- Background layers -->
  <div class="featured-bg"></div>
</a>

<style>
  .featured {
    display: block;
    position: relative;
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 10px;
    overflow: hidden;
    transition:
      transform var(--t-mid) var(--ease),
      box-shadow var(--t-mid) var(--ease),
      border-color var(--t-mid) var(--ease);
    animation: scan-enter var(--t-slow) var(--ease) both;
  }

  .featured:hover {
    transform: translateY(-4px);
    border-color: rgba(0, 200, 216, 0.20);
    box-shadow:
      0 24px 64px rgba(0, 0, 0, 0.55),
      0 0 0 1px rgba(0, 200, 216, 0.12),
      0 8px 24px rgba(0, 0, 0, 0.35);
  }

  /* Top scan line — low opacity always, full on hover */
  .featured-scanline {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--cat-color) 30%,
      var(--cat-color) 70%,
      transparent 100%
    );
    opacity: 0.25;
    transition: opacity var(--t-mid);
    z-index: 2;
  }

  .featured:hover .featured-scanline {
    opacity: 0.90;
  }

  .featured-inner {
    position: relative;
    z-index: 1;
    padding: 30px 34px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* ── Eyebrow ── */
  .featured-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .eyebrow-tag {
    font-size: 0.60rem;
    letter-spacing: 0.20em;
    color: var(--cyan);
    text-transform: uppercase;
    padding: 2px 8px;
    border: 1px solid rgba(0, 200, 216, 0.30);
    border-radius: 3px;
    background: rgba(0, 200, 216, 0.06);
  }

  .eyebrow-sep {
    color: var(--text-dim);
    font-size: 0.8rem;
  }

  .badge {
    font-family: var(--font-mono);
    font-size: 0.66rem;
    letter-spacing: 0.06em;
    padding: 2px 8px;
    border: 1px solid;
    border-radius: 3px;
  }

  .eyebrow-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }

  .source {
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.04em;
  }

  .meta-sep { color: var(--text-dim); }

  .time {
    font-size: 0.70rem;
    color: var(--text-dim);
    letter-spacing: 0.04em;
  }

  /* ── Title ── */
  .featured-title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(1.2rem, 2.8vw, 1.9rem);
    color: var(--text-bright);
    line-height: 1.28;
    letter-spacing: -0.02em;
    transition: color var(--t-fast);
  }

  .featured:hover .featured-title { color: #fff; }

  /* ── Summary ── */
  .featured-summary {
    font-size: 0.90rem;
    color: var(--text-body);
    line-height: 1.72;
    max-width: 72ch;
  }

  /* ── CTA ── */
  .featured-cta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.76rem;
    color: var(--cyan);
    letter-spacing: 0.06em;
    transition: gap var(--t-fast), color var(--t-fast);
  }

  .featured:hover .featured-cta {
    gap: 12px;
    color: var(--cyan-bright);
  }

  .cta-arrow {
    font-size: 0.90rem;
    transition: transform var(--t-fast);
    line-height: 1;
  }

  .featured:hover .cta-arrow {
    transform: translate(2px, -2px);
  }

  /* ── Background gradient ── */
  .featured-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 90% 60%, var(--cat-color, var(--cyan)) 0%, transparent 55%),
      radial-gradient(ellipse at 10% -10%, rgba(0, 200, 216, 0.06), transparent 60%);
    opacity: 0.06;
    pointer-events: none;
    transition: opacity var(--t-mid);
  }

  .featured:hover .featured-bg {
    opacity: 0.10;
  }

  @media (max-width: 640px) {
    .featured-inner {
      padding: 20px 18px;
      gap: 12px;
    }

    .featured-title {
      font-size: 1.12rem;
    }

    .featured-summary {
      font-size: 0.84rem;
      line-height: 1.62;
    }

    .eyebrow-meta { display: none; }
  }
</style>
