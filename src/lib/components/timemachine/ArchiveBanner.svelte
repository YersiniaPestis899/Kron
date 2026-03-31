<script>
  import { selectedTimestamp, returnToPresent } from '$lib/stores/timeMachine.js';
  import { formatTimestamp } from '$lib/utils/dateFormat.js';
</script>

<div class="banner">
  <span class="icon mono">⏮</span>
  <span class="label mono">ARCHIVE</span>
  <span class="divider">·</span>
  <span class="time mono">{formatTimestamp($selectedTimestamp)}</span>
  <button class="return-btn mono" on:click={returnToPresent}>
    ↑ 現在に戻る
  </button>
</div>

<div class="scanlines" aria-hidden="true"></div>

<style>
  .banner {
    position: fixed;
    top: var(--header-h);
    left: var(--sidebar-w);
    right: 0;
    height: 34px;
    background: linear-gradient(
      90deg,
      rgba(192, 144, 64, 0.10) 0%,
      rgba(192, 144, 64, 0.06) 100%
    );
    border-bottom: 1px solid rgba(192, 144, 64, 0.28);
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 20px;
    z-index: 95;
  }

  .icon {
    font-size: 0.75rem;
    color: var(--amber);
    opacity: 0.8;
  }

  .label {
    font-size: 0.60rem;
    letter-spacing: 0.20em;
    color: var(--amber);
    text-transform: uppercase;
  }

  .divider {
    color: rgba(192, 144, 64, 0.30);
    font-size: 0.8rem;
  }

  .time {
    font-size: 0.76rem;
    color: var(--text-body);
    letter-spacing: 0.02em;
  }

  .return-btn {
    margin-left: auto;
    font-size: 0.66rem;
    letter-spacing: 0.08em;
    color: var(--amber);
    padding: 3px 10px;
    border: 1px solid rgba(192, 144, 64, 0.35);
    border-radius: 3px;
    transition: all var(--t-fast) var(--ease);
  }

  .return-btn:hover {
    background: rgba(192, 144, 64, 0.12);
    box-shadow: 0 0 12px rgba(192, 144, 64, 0.18);
    border-color: rgba(192, 144, 64, 0.55);
  }

  @media (max-width: 640px) {
    .banner {
      left: 0;
    }
  }

  .scanlines {
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(0, 0, 0, 0.025) 3px,
      rgba(0, 0, 0, 0.025) 4px
    );
    pointer-events: none;
    z-index: 999;
  }
</style>
