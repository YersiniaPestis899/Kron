<script>
  import { selectedTimestamp, returnToPresent } from '$lib/stores/timeMachine.js';
  import { formatTimestamp } from '$lib/utils/dateFormat.js';
</script>

<div class="banner">
  <span class="icon mono">⏮</span>
  <span class="label mono">ARCHIVE</span>
  <span class="time">{formatTimestamp($selectedTimestamp)}</span>
  <button class="return-btn" on:click={returnToPresent}>
    現在に戻る ↑
  </button>
</div>

<div class="scanlines" aria-hidden="true"></div>

<style>
  .banner {
    position: fixed;
    top: var(--header-h);
    left: var(--sidebar-w);
    right: 0;
    height: 36px;
    background: rgba(184, 144, 64, 0.12);
    border-bottom: 1px solid rgba(184, 144, 64, 0.35);
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 20px;
    z-index: 95;
  }

  .icon {
    font-size: 0.8rem;
    color: var(--amber);
  }

  .label {
    font-size: 0.65rem;
    letter-spacing: 0.18em;
    color: var(--amber);
  }

  .time {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--text-body);
  }

  .return-btn {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    color: var(--amber);
    padding: 4px 10px;
    border: 1px solid rgba(184, 144, 64, 0.4);
    border-radius: 4px;
    transition: all var(--t-fast) var(--ease);
  }

  .return-btn:hover {
    background: rgba(184, 144, 64, 0.15);
    box-shadow: 0 0 10px rgba(184, 144, 64, 0.2);
  }

  @media (max-width: 640px) {
    .banner {
      left: 0;
    }
  }

  /* Subtle scanline overlay on the whole page when in archive */
  .scanlines {
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(0, 0, 0, 0.03) 3px,
      rgba(0, 0, 0, 0.03) 4px
    );
    pointer-events: none;
    z-index: 999;
  }
</style>
