<script>
  import { lastUpdated } from '$lib/stores/news.js';
  import { isPanelOpen } from '$lib/stores/timeMachine.js';
  import { sidebarOpen } from '$lib/stores/ui.js';
  import { formatTimestamp } from '$lib/utils/dateFormat.js';
  import { onMount } from 'svelte';

  let nowStr = '';
  let tick;

  onMount(() => {
    const update = () => {
      nowStr = new Date().toLocaleTimeString('ja-JP', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    };
    update();
    tick = setInterval(update, 1000);
    return () => clearInterval(tick);
  });

  $: timeMain = nowStr.slice(0, 5);
  $: timeSec  = nowStr.slice(5);
</script>

<header class="header">
  <button class="hamburger" on:click={() => sidebarOpen.update(v => !v)} aria-label="メニュー">
    <span></span><span></span><span></span>
  </button>

  <div class="logo">
    <span class="logo-k">K</span><span class="logo-ron">RON</span>
    <span class="live-dot" title="ライブ"></span>
  </div>

  <div class="header-sep"></div>

  <div class="header-center mono">
    <span class="clock-main">{timeMain}</span><span class="clock-sec">{timeSec}</span>
  </div>

  <div class="header-right">
    {#if $lastUpdated}
      <span class="updated mono">SYNC <span class="updated-time">{formatTimestamp($lastUpdated)}</span></span>
    {/if}
    <button
      class="tm-toggle"
      class:active={$isPanelOpen}
      on:click={() => isPanelOpen.update(v => !v)}
      title="タイムトラベル [T]"
      aria-label="タイムマシン"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <span class="tm-label">TIME</span>
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
    backdrop-filter: blur(16px);
  }

  /* Animated scan line sweeping across the bottom border */
  .header::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0; right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--cyan) 40%,
      var(--cyan-bright) 50%,
      var(--cyan) 60%,
      transparent 100%
    );
    background-size: 40% 100%;
    background-repeat: no-repeat;
    animation: scan-h 8s ease-in-out infinite;
    opacity: 0.55;
  }

  /* ── Logo ── */
  .logo {
    display: flex;
    align-items: baseline;
    flex-shrink: 0;
    user-select: none;
  }

  .logo-k {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 1.7rem;
    color: var(--cyan-bright);
    letter-spacing: -0.04em;
    line-height: 1;
    text-shadow: 0 0 28px var(--cyan-glow), 0 0 8px rgba(0, 200, 216, 0.25);
  }

  .logo-ron {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: 1.7rem;
    color: var(--text-bright);
    letter-spacing: 0.10em;
    line-height: 1;
  }

  .live-dot {
    width: 5px;
    height: 5px;
    background: var(--cyan);
    border-radius: 50%;
    margin-left: 9px;
    margin-bottom: 3px;
    flex-shrink: 0;
    box-shadow: 0 0 8px var(--cyan), 0 0 16px rgba(0, 200, 216, 0.25);
    animation: pulse-dot 2.5s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--cyan), 0 0 16px rgba(0, 200, 216, 0.25); }
    50%       { opacity: 0.35; box-shadow: 0 0 3px var(--cyan); }
  }

  /* ── Separator ── */
  .header-sep {
    width: 1px;
    height: 18px;
    background: var(--border);
    flex-shrink: 0;
  }

  /* ── Clock ── */
  .header-center {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: baseline;
  }

  .clock-main {
    font-size: 0.98rem;
    color: var(--text-body);
    letter-spacing: 0.12em;
  }

  .clock-sec {
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.10em;
    opacity: 0.65;
  }

  /* ── Right section ── */
  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .updated {
    font-size: 0.64rem;
    letter-spacing: 0.08em;
    color: var(--text-dim);
    text-transform: uppercase;
  }

  .updated-time {
    color: var(--text-muted);
  }

  /* ── Time Machine Toggle ── */
  .tm-toggle {
    height: 30px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 10px;
    border-radius: 4px;
    color: var(--text-muted);
    border: 1px solid var(--border);
    transition: all var(--t-fast) var(--ease);
    font-family: var(--font-mono);
  }

  .tm-label {
    font-size: 0.62rem;
    letter-spacing: 0.12em;
  }

  .tm-toggle:hover {
    color: var(--cyan-bright);
    border-color: rgba(0, 200, 216, 0.35);
    background: var(--cyan-dim);
  }

  .tm-toggle.active {
    color: var(--cyan-bright);
    border-color: var(--border-active);
    background: var(--cyan-dim);
    animation: tm-pulse 3s ease-in-out infinite;
  }

  @keyframes tm-pulse {
    0%, 100% { box-shadow: 0 0 10px var(--cyan-glow); }
    50%       { box-shadow: 0 0 22px rgba(0, 200, 216, 0.35), inset 0 0 8px rgba(0, 200, 216, 0.05); }
  }

  /* ── Hamburger ── */
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
    height: 1.5px;
    background: var(--text-muted);
    border-radius: 1px;
    transition: background var(--t-fast);
  }

  .hamburger:hover span { background: var(--text-bright); }

  @media (max-width: 640px) {
    .hamburger { display: flex; }
    .updated { display: none; }
    .header { padding: 0 14px; gap: 10px; }
    .header-sep { display: none; }
    .tm-label { display: none; }
    .tm-toggle { padding: 0 8px; }
  }
</style>
