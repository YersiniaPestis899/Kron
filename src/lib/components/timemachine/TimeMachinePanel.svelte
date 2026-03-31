<script>
  import { onMount } from 'svelte';
  import {
    isPanelOpen, snapshots, isArchiveMode,
    selectedTimestamp, snapshotIndex, returnToPresent
  } from '$lib/stores/timeMachine.js';
  import { fetchSnapshots } from '$lib/api.js';
  import { formatTimestamp } from '$lib/utils/dateFormat.js';

  let loading = false;

  async function loadSnapshots() {
    loading = true;
    try {
      const data = await fetchSnapshots();
      snapshots.set(data.snapshots || []);
    } catch(e) {
      console.error(e);
    } finally {
      loading = false;
    }
  }

  function selectSnapshot(snap, idx) {
    snapshotIndex.set(idx);
    selectedTimestamp.set(snap.completed_at || snap.started_at);
    isArchiveMode.set(true);
  }

  function handleReturnToPresent() {
    returnToPresent();
  }

  $: if ($isPanelOpen && $snapshots.length === 0) {
    loadSnapshots();
  }

  function handleKey(e) {
    if (!$isPanelOpen) return;
    if (e.key === 'ArrowUp' && $snapshotIndex > 0) {
      const idx = $snapshotIndex - 1;
      selectSnapshot($snapshots[idx], idx);
    } else if (e.key === 'ArrowDown') {
      const idx = $isArchiveMode ? $snapshotIndex + 1 : 0;
      if ($snapshots[idx]) selectSnapshot($snapshots[idx], idx);
    } else if (e.key === 'Escape') {
      returnToPresent();
    }
  }
</script>

<svelte:window on:keydown={handleKey} />

{#if $isPanelOpen}
<aside class="panel">
  <div class="panel-header">
    <div class="panel-title mono">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      TIME MACHINE
    </div>
    <button class="close-btn" on:click={() => isPanelOpen.set(false)} aria-label="閉じる">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>

  <div class="panel-body">
    <!-- LIVE / Present button -->
    <button
      class="present-btn"
      class:active={!$isArchiveMode}
      on:click={handleReturnToPresent}
    >
      <span class="present-dot"></span>
      <span class="present-label">現在 <span class="live-tag mono">LIVE</span></span>
    </button>

    <div class="timeline-header mono">SNAPSHOTS</div>

    {#if loading}
      <div class="state-msg mono">読み込み中...</div>
    {:else if $snapshots.length === 0}
      <div class="state-msg">
        <p>スナップショットなし</p>
        <p class="state-sub">しばらくお待ちください</p>
      </div>
    {:else}
      <div class="timeline">
        {#each $snapshots as snap, i}
          <button
            class="snap"
            class:active={$isArchiveMode && $snapshotIndex === i}
            on:click={() => selectSnapshot(snap, i)}
          >
            <div class="snap-dot"></div>
            <div class="snap-info">
              <span class="snap-time mono">{formatTimestamp(snap.started_at)}</span>
              {#if snap.article_count > 0}
                <span class="snap-count mono">+{snap.article_count} 記事</span>
              {/if}
            </div>
            {#if $isArchiveMode && $snapshotIndex === i}
              <span class="snap-active-tag mono">表示中</span>
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <div class="panel-footer mono">
    <span>↑↓ 移動</span>
    <span class="footer-sep">·</span>
    <span>ESC 現在へ</span>
  </div>
</aside>
{/if}

<style>
  .panel {
    position: fixed;
    top: var(--header-h);
    right: 0;
    bottom: var(--ticker-h);
    width: 260px;
    background: var(--bg-sidebar);
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    z-index: 90;
    animation: slide-in var(--t-mid) var(--ease) both;
  }

  @keyframes slide-in {
    from { transform: translateX(100%); opacity: 0; }
    to   { transform: translateX(0);   opacity: 1; }
  }

  /* ── Header ── */
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(
      180deg,
      rgba(0, 200, 216, 0.04) 0%,
      transparent 100%
    );
  }

  .panel-title {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    color: var(--cyan);
    text-transform: uppercase;
  }

  .close-btn {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: var(--text-dim);
    transition: all var(--t-fast);
  }

  .close-btn:hover {
    color: var(--text-body);
    background: var(--bg-raised);
  }

  /* ── Body ── */
  .panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 12px 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* ── Present (LIVE) button ── */
  .present-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    font-family: var(--font-display);
    font-size: 0.84rem;
    color: var(--text-muted);
    width: 100%;
    text-align: left;
    border-left: 2px solid transparent;
    transition: all var(--t-fast);
    margin-bottom: 6px;
  }

  .present-btn:hover {
    color: var(--text-body);
    background: rgba(255, 255, 255, 0.025);
  }

  .present-btn.active {
    color: var(--cyan-bright);
    border-left-color: var(--cyan);
    background: var(--cyan-dim);
  }

  .present-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--cyan);
    flex-shrink: 0;
    box-shadow: 0 0 6px var(--cyan);
    animation: pulse-dot 2.5s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.35; }
  }

  .present-label {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .live-tag {
    font-size: 0.58rem;
    letter-spacing: 0.12em;
    color: var(--cyan);
    padding: 1px 5px;
    border: 1px solid rgba(0, 200, 216, 0.30);
    border-radius: 2px;
    background: rgba(0, 200, 216, 0.06);
  }

  /* ── Timeline label ── */
  .timeline-header {
    font-size: 0.58rem;
    letter-spacing: 0.20em;
    color: var(--text-dim);
    padding: 4px 16px 8px;
    text-transform: uppercase;
  }

  /* ── Timeline ── */
  .timeline {
    display: flex;
    flex-direction: column;
    gap: 1px;
    position: relative;
  }

  /* Vertical timeline bar */
  .timeline::before {
    content: '';
    position: absolute;
    left: 22px;
    top: 6px; bottom: 6px;
    width: 1px;
    background: linear-gradient(
      180deg,
      var(--border) 0%,
      rgba(0, 200, 216, 0.05) 100%
    );
  }

  /* ── Snapshot item ── */
  .snap {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 14px;
    width: 100%;
    text-align: left;
    border-left: 2px solid transparent;
    transition: all var(--t-fast);
    position: relative;
  }

  .snap:hover {
    background: rgba(255, 255, 255, 0.025);
  }

  .snap.active {
    background: rgba(192, 144, 64, 0.07);
    border-left-color: var(--amber);
  }

  .snap-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-dim);
    flex-shrink: 0;
    border: 1px solid var(--bg-sidebar);
    position: relative;
    z-index: 1;
    transition: all var(--t-fast);
  }

  .snap:hover .snap-dot {
    background: var(--text-muted);
  }

  .snap.active .snap-dot {
    background: var(--amber);
    box-shadow: 0 0 8px rgba(192, 144, 64, 0.5);
    width: 7px;
    height: 7px;
  }

  .snap-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }

  .snap-time {
    font-size: 0.70rem;
    color: var(--text-muted);
    letter-spacing: 0.02em;
  }

  .snap.active .snap-time {
    color: var(--amber);
  }

  .snap-count {
    font-size: 0.60rem;
    color: var(--text-dim);
    letter-spacing: 0.04em;
  }

  .snap-active-tag {
    font-size: 0.56rem;
    letter-spacing: 0.10em;
    color: var(--amber);
    padding: 1px 5px;
    border: 1px solid rgba(192, 144, 64, 0.30);
    border-radius: 2px;
    background: rgba(192, 144, 64, 0.06);
    flex-shrink: 0;
  }

  /* ── State messages ── */
  .state-msg {
    padding: 20px 16px;
    font-size: 0.78rem;
    text-align: center;
    color: var(--text-dim);
    line-height: 1.7;
  }

  .state-sub {
    font-size: 0.70rem;
    opacity: 0.6;
    margin-top: 4px;
  }

  /* ── Footer ── */
  .panel-footer {
    padding: 10px 16px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.60rem;
    letter-spacing: 0.06em;
    color: var(--text-dim);
  }

  .footer-sep {
    opacity: 0.4;
  }

  @media (max-width: 640px) {
    .panel {
      left: 0;
      width: 100%;
      top: var(--header-h);
      border-left: none;
      border-top: 1px solid var(--border);
    }
  }
</style>
