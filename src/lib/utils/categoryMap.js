export const CATEGORIES = [
  { id: 'all',           label: 'すべて',       color: 'var(--cyan)',    icon: '◈' },
  { id: 'japan',         label: '国内',          color: 'var(--green)',   icon: '◉' },
  { id: 'world',         label: '国際',          color: 'var(--blue)',    icon: '◎' },
  { id: 'tech',          label: 'テクノロジー',  color: 'var(--cyan)',    icon: '◆' },
  { id: 'business',      label: 'ビジネス',      color: 'var(--amber)',   icon: '◇' },
  { id: 'science',       label: '科学',          color: 'var(--purple)',  icon: '◈' },
  { id: 'entertainment', label: 'エンタメ',      color: 'var(--magenta)', icon: '◉' },
  { id: 'sports',        label: 'スポーツ',      color: 'var(--orange)',  icon: '◎' },
];

export function getCategoryInfo(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
}
