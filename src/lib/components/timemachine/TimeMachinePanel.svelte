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

  // Keyboard navigation
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
    <div class="panel-title">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <span class="mono">TIME MACHINE</span>
    </div>
    <button class="close-btn" on:click={() => isPanelOpen.set(false)}>✕</button>
  </div>

  <div class="panel-body">
    <button
      class="present-btn"
      class:active={!$isArchiveMode}
      on:click={handleReturnToPresent}
    >
      <span class="present-dot"></span>
      <span>現在 (LIVE)</span>
    </button>

    <div class="timeline-label mono">過去のスナップショット</div>

    {#if loading}
      <div class="loading-msg dim mono">読み込み中...</div>
    {:else if $snapshots.length === 0}
      <div class="empty-msg dim">
        <p>スナップショットなし</p>
        <p>しばらくお待ちください</p>
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
                <span class="snap-count mono">+{snap.article_count}</span>
              {/if}
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <div class="panel-footer mono">
    <span class="dim">↑↓ キーで移動</span>
    <span class="dim">ESC で現在に戻る</span>
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

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 16px 12px;
    border-bottom: 1px solid var(--border);
  }

  .panel-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    color: var(--cyan);
  }

  .close-btn {
    font-size: 0.75rem;
    color: var(--text-dim);
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all var(--t-fast);
  }

  .close-btn:hover { color: var(--text-body); background: var(--bg-raised); }

  .panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 14px 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .present-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    font-family: var(--font-display);
    font-size: 0.85rem;
    color: var(--text-muted);
    width: 100%;
    text-align: left;
    border-left: 2px solid transparent;
    transition: all var(--t-fast);
    margin-bottom: 8px;
  }

  .present-btn:hover { color: var(--text-body); background: rgba(255,255,255,0.03); }

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
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%,100%{ opacity:1; } 50%{ opacity:0.4; }
  }

  .timeline-label {
    font-size: 0.62rem;
    letter-spacing: 0.14em;
    color: var(--text-dim);
    padding: 4px 16px 8px;
    text-transform: uppercase;
  }

  .timeline {
    display: flex;
    flex-direction: column;
    gap: 1px;
    position: relative;
  }

  .timeline::before {
    content: '';
    position: absolute;
    left: 22px;
    top: 0; bottom: 0;
    width: 1px;
    background: var(--border);
  }

  .snap {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 16px;
    width: 100%;
    text-align: left;
    border-left: 2px solid transparent;
    transition: all var(--t-fast);
    position: relative;
  }

  .snap:hover { background: rgba(255,255,255,0.025); }

  .snap.active {
    background: rgba(184, 144, 64, 0.08);
    border-left-color: var(--amber);
  }

  .snap-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--text-dim);
    flex-shrink: 0;
    border: 1px solid var(--bg-sidebar);
    position: relative;
    z-index: 1;
    transition: all var(--t-fast);
  }

  .snap.active .snap-dot {
    background: var(--amber);
    box-shadow: 0 0 6px var(--amber);
  }

  .snap:hover .snap-dot { background: var(--text-muted); }

  .snap-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .snap-time {
    font-size: 0.72rem;
    color: var(--text-muted);
    letter-spacing: 0.02em;
  }

  .snap.active .snap-time { color: var(--amber); }

  .snap-count {
    font-size: 0.62rem;
    color: var(--text-dim);
    letter-spacing: 0.04em;
  }

  .loading-msg, .empty-msg {
    padding: 20px 16px;
    font-size: 0.8rem;
    text-align: center;
    color: var(--text-dim);
    line-height: 1.7;
  }

  .panel-footer {
    padding: 12px 16px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .panel-footer span {
    font-size: 0.65rem;
    letter-spacing: 0.06em;
    color: var(--text-dim);
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
