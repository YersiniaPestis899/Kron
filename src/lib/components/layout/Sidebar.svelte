<script>
  import { currentCategory, categoryCounts } from '$lib/stores/news.js';
  import { CATEGORIES } from '$lib/utils/categoryMap.js';
  import { sidebarOpen } from '$lib/stores/ui.js';

  function selectCat(id) {
    currentCategory.set(id);
    sidebarOpen.set(false);
  }
</script>

<aside class="sidebar" class:mobile-open={$sidebarOpen}>
  <nav class="nav">
    <div class="nav-section-label mono">CHANNELS</div>
    {#each CATEGORIES as cat}
      <button
        class="nav-item"
        class:active={$currentCategory === cat.id}
        style="--item-color: {cat.color}"
        on:click={() => selectCat(cat.id)}
      >
        <span class="nav-dot" style="background: {cat.color}"></span>
        <span class="nav-label-text">{cat.label}</span>
        {#if $categoryCounts[cat.id]}
          <span class="nav-count mono">{$categoryCounts[cat.id]}</span>
        {/if}
      </button>
    {/each}
  </nav>

  <div class="sidebar-footer">
    <span class="footer-brand mono">KRON</span>
    <span class="footer-sub mono">v1.0 · RSS</span>
  </div>
</aside>

<style>
  .sidebar {
    position: fixed;
    top: var(--header-h);
    left: 0;
    bottom: var(--ticker-h);
    width: var(--sidebar-w);
    background: var(--bg-sidebar);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    z-index: 90;
    overflow-y: auto;
  }

  .nav {
    flex: 1;
    padding: 20px 0 12px;
  }

  .nav-section-label {
    font-size: 0.60rem;
    letter-spacing: 0.22em;
    color: var(--text-dim);
    padding: 0 18px 12px;
    text-transform: uppercase;
  }

  .nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 18px;
    text-align: left;
    font-family: var(--font-display);
    font-size: 0.86rem;
    color: var(--text-muted);
    border-left: 2px solid transparent;
    transition: all var(--t-fast) var(--ease);
    position: relative;
  }

  .nav-item:hover {
    color: var(--text-body);
    background: rgba(255, 255, 255, 0.025);
  }

  /* Active: use category color for border and subtle glow */
  .nav-item.active {
    color: var(--text-bright);
    border-left-color: var(--item-color);
    background: rgba(255, 255, 255, 0.04);
  }

  /* Category-colored left glow for active items */
  .nav-item.active::after {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 56px;
    background: linear-gradient(90deg, var(--item-color), transparent);
    opacity: 0.10;
    pointer-events: none;
  }

  .nav-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
    opacity: 0.50;
    transition: opacity var(--t-fast);
  }

  .nav-item:hover .nav-dot  { opacity: 0.80; }
  .nav-item.active .nav-dot { opacity: 1; }

  .nav-label-text {
    flex: 1;
  }

  .nav-count {
    font-size: 0.66rem;
    color: var(--text-dim);
    letter-spacing: 0.04em;
    transition: color var(--t-fast);
  }

  .nav-item.active .nav-count {
    color: var(--item-color);
    opacity: 0.75;
  }

  /* ── Footer ── */
  .sidebar-footer {
    padding: 14px 18px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .footer-brand {
    font-size: 0.70rem;
    letter-spacing: 0.18em;
    color: var(--text-dim);
    font-weight: 600;
  }

  .footer-sub {
    font-size: 0.58rem;
    letter-spacing: 0.08em;
    color: var(--text-dim);
    opacity: 0.45;
  }

  @media (max-width: 640px) {
    .sidebar {
      transform: translateX(-100%);
      transition: transform var(--t-mid) var(--ease);
      z-index: 95;
    }
    .sidebar.mobile-open {
      transform: translateX(0);
    }
  }
</style>
