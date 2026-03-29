<script>
  import { lastUpdated } from '$lib/stores/news.js';
  import { isPanelOpen } from '$lib/stores/timeMachine.js';
  import { sidebarOpen } from '$lib/stores/ui.js';
  import { formatTimestamp } from '$lib/utils/dateFormat.js';
  import { onMount } from 'svelte';

  let nowStr = '';
  let tick;

  onMount(() => {
    const update = () => { nowStr = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); };
    update();
    tick = setInterval(update, 1000);
    return () => clearInterval(tick);
  });
</script>

<header class="header">
  <button class="hamburger" on:click={() => sidebarOpen.update(v => !v)} aria-label="メニュー">
    <span></span><span></span><span></span>
  </button>

  <div class="logo">
    <span class="logo-k">K</span><span class="logo-ron">RON</span>
    <span class="live-dot" title="ライブ"></span>
  </div>

  <div class="header-center mono">
    <span class="clock">{nowStr}</span>
  </div>

  <div class="header-right">
    {#if $lastUpdated}
      <span class="updated dim mono">更新 {formatTimestamp($lastUpdated)}</span>
    {/if}
    <button
      class="tm-toggle"
      class:active={$isPanelOpen}
      on:click={() => isPanelOpen.update(v => !v)}
      title="タイムトラベル [T]"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    </button>
  </div>
</header>

<style>
  .header {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: var(--header-h);
    background: var(--bg-header);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    padding: 0 20px;
    gap: 16px;
    z-index: 100;
    backdrop-filter: blur(12px);
  }

  .logo {
    display: flex;
    align-items: baseline;
    gap: 0;
    flex-shrink: 0;
    user-select: none;
  }

  .logo-k {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.6rem;
    color: var(--cyan-bright);
    letter-spacing: -0.04em;
    line-height: 1;
    text-shadow: 0 0 20px var(--cyan-glow);
  }

  .logo-ron {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: 1.6rem;
    color: var(--text-bright);
    letter-spacing: 0.08em;
    line-height: 1;
  }

  .live-dot {
    width: 6px;
    height: 6px;
    background: var(--cyan);
    border-radius: 50%;
    margin-left: 8px;
    margin-bottom: 2px;
    flex-shrink: 0;
    box-shadow: 0 0 8px var(--cyan);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--cyan); }
    50%       { opacity: 0.5; box-shadow: 0 0 3px var(--cyan); }
  }

  .header-center {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .clock {
    font-size: 0.85rem;
    color: var(--text-muted);
    letter-spacing: 0.12em;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }

  .updated {
    font-size: 0.75rem;
    letter-spacing: 0.04em;
  }

  .tm-toggle {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    color: var(--text-muted);
    border: 1px solid var(--border);
    transition: all var(--t-fast) var(--ease);
  }

  .tm-toggle:hover, .tm-toggle.active {
    color: var(--cyan-bright);
    border-color: var(--border-active);
    background: var(--cyan-dim);
    box-shadow: 0 0 12px var(--cyan-glow);
  }

  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    padding: 6px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .hamburger span {
    display: block;
    width: 20px;
    height: 2px;
    background: var(--text-muted);
    border-radius: 1px;
    transition: background var(--t-fast);
  }

  .hamburger:hover span { background: var(--text-bright); }

  @media (max-width: 640px) {
    .hamburger { display: flex; }
    .updated { display: none; }
    .header { padding: 0 14px; gap: 10px; }
  }
</style>
