import { writable, derived } from 'svelte/store';

export const isArchiveMode     = writable(false);
export const selectedTimestamp = writable(null);
export const snapshots         = writable([]);
export const isPanelOpen       = writable(false);
export const snapshotIndex     = writable(-1);   // index into snapshots array, -1 = live

export const archiveDepth = derived(
  [isArchiveMode, selectedTimestamp],
  ([$isArchiveMode, $selectedTimestamp]) => {
    if (!$isArchiveMode || !$selectedTimestamp) return 0;
    const diff = (Date.now() - new Date($selectedTimestamp).getTime()) / 1000 / 3600;
    return Math.min(diff / 72, 1); // 0→1 over 72 hours
  }
);

export function returnToPresent() {
  isArchiveMode.set(false);
  selectedTimestamp.set(null);
  snapshotIndex.set(-1);
}
