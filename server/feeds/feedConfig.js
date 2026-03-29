export const FEEDS = [
  // 国内
  { url: 'https://www.nhk.or.jp/rss/news/cat0.xml',  category: 'japan',         name: 'NHK 国内' },
  { url: 'https://www.nhk.or.jp/rss/news/cat4.xml',  category: 'japan',         name: 'NHK 社会' },

  // 国際
  { url: 'https://www.nhk.or.jp/rss/news/cat6.xml',  category: 'world',         name: 'NHK 国際' },
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'world',      name: 'BBC World' },

  // テクノロジー
  { url: 'https://hnrss.org/frontpage',              category: 'tech',          name: 'Hacker News' },
  { url: 'https://www.theverge.com/rss/index.xml',   category: 'tech',          name: 'The Verge' },
  { url: 'https://techcrunch.com/feed/',             category: 'tech',          name: 'TechCrunch' },
  { url: 'https://rss.itmedia.co.jp/rss/2.0/itmedia_all.xml', category: 'tech', name: 'ITmedia' },

  // ビジネス
  { url: 'https://www.nhk.or.jp/rss/news/cat5.xml',  category: 'business',      name: 'NHK ビジネス' },

  // 科学
  { url: 'https://www.nhk.or.jp/rss/news/cat3.xml',  category: 'science',       name: 'NHK 科学文化' },
  { url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', category: 'science',  name: 'NASA' },

  // エンタメ
  { url: 'https://natalie.mu/music/feed/news',        category: 'entertainment', name: 'ナタリー' },
  { url: 'https://www.engadget.com/rss.xml',          category: 'entertainment', name: 'Engadget' },

  // スポーツ
  { url: 'https://www.nhk.or.jp/rss/news/cat7.xml',  category: 'sports',        name: 'NHK スポーツ' },
];
