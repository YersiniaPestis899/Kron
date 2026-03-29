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
    <div class="nav-label mono">CHANNELS</div>
    {#each CATEGORIES as cat}
      <button
        class="nav-item"
        class:active={$currentCategory === cat.id}
        on:click={() => selectCat(cat.id)}
      >
        <span class="nav-icon" style="color: {cat.color}">{cat.icon}</span>
        <span class="nav-label-text">{cat.label}</span>
        {#if $categoryCounts[cat.id]}
          <span class="nav-count mono">{$categoryCounts[cat.id]}</span>
        {/if}
      </button>
    {/each}
  </nav>

  <div class="sidebar-footer mono">
    <div class="footer-line">KRON v1.0</div>
    <div class="footer-line dim">RSS AGGREGATOR</div>
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

  .nav-label {
    font-size: 0.65rem;
    letter-spacing: 0.18em;
    color: var(--text-dim);
    padding: 0 18px 10px;
    text-transform: uppercase;
  }

  .nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 18px;
    text-align: left;
    font-family: var(--font-display);
    font-size: 0.88rem;
    color: var(--text-muted);
    border-left: 2px solid transparent;
    transition: all var(--t-fast) var(--ease);
    position: relative;
  }

  .nav-item:hover {
    color: var(--text-body);
    background: rgba(255,255,255,0.03);
  }

  .nav-item.active {
    color: var(--text-bright);
    border-left-color: var(--cyan);
    background: var(--cyan-dim);
  }

  .nav-icon {
    font-size: 0.75rem;
    width: 16px;
    flex-shrink: 0;
  }

  .nav-label-text {
    flex: 1;
  }

  .nav-count {
    font-size: 0.7rem;
    color: var(--text-dim);
    letter-spacing: 0.04em;
  }

  .nav-item.active .nav-count {
    color: var(--cyan);
  }

  .sidebar-footer {
    padding: 14px 18px;
    border-top: 1px solid var(--border);
  }

  .footer-line {
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    color: var(--text-dim);
    line-height: 1.8;
  }

  .footer-line.dim {
    color: var(--text-dim);
    opacity: 0.5;
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
