const BASE = '/api';

export async function fetchNews({ category = 'all', at = null, limit = 50, offset = 0 } = {}) {
  const params = new URLSearchParams({ category, limit, offset });
  if (at) params.set('at', at);
  const res = await fetch(`${BASE}/news?${params}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function fetchSnapshots() {
  const res = await fetch(`${BASE}/snapshots`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${BASE}/news/categories`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
