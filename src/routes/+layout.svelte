<script>
  import '../app.css';
  import Header from '$lib/components/layout/Header.svelte';
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import Ticker from '$lib/components/layout/Ticker.svelte';
  import ArchiveBanner from '$lib/components/timemachine/ArchiveBanner.svelte';
  import TimeMachinePanel from '$lib/components/timemachine/TimeMachinePanel.svelte';
  import { isArchiveMode, isPanelOpen } from '$lib/stores/timeMachine.js';
  import { sidebarOpen } from '$lib/stores/ui.js';
  import { onMount } from 'svelte';

  // Global keyboard shortcut: T to toggle time machine panel
  function handleKeydown(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'T' || e.key === 't') {
      isPanelOpen.update(v => !v);
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<Header />

{#if $isArchiveMode}
  <ArchiveBanner />
{/if}

{#if $sidebarOpen}
  <div class="sidebar-backdrop" on:click={() => sidebarOpen.set(false)} aria-hidden="true"></div>
{/if}

<div class="layout" class:panel-open={$isPanelOpen} class:archive-mode={$isArchiveMode}>
  <Sidebar />

  <main class="main">
    <slot />
  </main>

  <TimeMachinePanel />
</div>

<Ticker />

<style>
  .layout {
    display: flex;
    padding-top: var(--header-h);
    padding-bottom: var(--ticker-h);
    min-height: 100vh;
    transition: filter var(--t-slow);
  }

  /* Subtle archive mode visual treatment */
  .layout.archive-mode {
    filter: sepia(0.05) contrast(1.01);
  }

  .main {
    flex: 1;
    margin-left: var(--sidebar-w);
    padding: 28px 28px 24px;
    min-width: 0;
    transition: margin-right var(--t-mid) var(--ease), padding-top var(--t-mid) var(--ease);
  }

  /* Push content down when archive banner is visible */
  .layout.archive-mode .main {
    padding-top: calc(28px + 34px);
  }

  .layout.panel-open .main {
    margin-right: 260px;
  }

  .sidebar-backdrop {
    display: none;
  }

  @media (max-width: 640px) {
    .main {
      margin-left: 0;
      padding: 16px 14px 20px;
    }

    .layout.panel-open .main {
      margin-right: 0;
    }

    .sidebar-backdrop {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      z-index: 89;
      backdrop-filter: blur(2px);
    }
  }
</style>
