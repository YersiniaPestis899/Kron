export function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  if (isNaN(diff)) return '—';

  const m = Math.floor(diff / 60000);
  if (m < 1)   return 'たった今';
  if (m < 60)  return `${m}分前`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}時間前`;
  const d = Math.floor(h / 24);
  if (d < 7)   return `${d}日前`;
  return new Date(dateStr).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
}

export function formatTimestamp(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    month: 'short', day: 'numeric', weekday: 'short'
  });
}
