import { writable } from 'svelte/store';

export const articles       = writable([]);
export const loading        = writable(false);
export const error          = writable(null);
export const currentCategory = writable('all');
export const categoryCounts  = writable({});
export const totalCount      = writable(0);
export const lastUpdated     = writable(null);
