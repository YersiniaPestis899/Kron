# KRON

RSSフィードをリアルタイムで収集・表示するニュースアグリゲーター。カテゴリ別フィルタリングと、過去の記事を時系列で遡れる「タイムマシン」機能を搭載しています。

![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=flat&logo=svelte&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)
![Fly.io](https://img.shields.io/badge/Fly.io-7B36ED?style=flat&logoColor=white)

---

## 機能

- **RSSフィード収集** — 国内外の主要メディアから記事を自動取得（1時間ごと）
- **カテゴリフィルタリング** — 総合・テクノロジー・ビジネス・政治・スポーツ・エンタメ・科学・国際
- **タイムマシン** — 過去のスナップショットを選択して、任意の時点のニュースを閲覧
- **モバイル対応** — スマートフォン・タブレットのレイアウトに最適化済み
- **PULSE デザインシステム** — 目に優しいダーク UI（背景 `#0C1018`、青灰色テキスト）

---

## 技術スタック

| 役割 | 技術 |
|------|------|
| フロントエンド | SvelteKit 2 + Svelte 5 |
| ビルドツール | Vite 6 |
| バックエンド | SvelteKit API Routes（`+server.js`） |
| データベース | SQLite（better-sqlite3） |
| RSS取得 | rss-parser + node-cron |
| デプロイ | Fly.io（adapter-node） |

---

## ローカル起動

### 必要なもの

- Node.js 20 以上
- npm 10 以上

### セットアップ

```bash
# 依存関係のインストール
npm install

# データベースの初期化
npm run setup

# 開発サーバーの起動
npm run dev
```

`http://localhost:5173` にアクセスしてください。

---

## ビルド・本番起動

```bash
npm run build
node build/index.js
```

---

## Fly.io へのデプロイ

```bash
# 初回のみ
fly launch

# 以降のデプロイ
fly deploy
```

`/data/kron.db` にマウントされた永続ボリュームに SQLite データが保存されます。

---

## プロジェクト構成

```
kron/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte      # 全体レイアウト（ヘッダー・サイドバー・ティッカー）
│   │   ├── +page.svelte        # メインページ
│   │   └── api/                # SvelteKit API エンドポイント
│   ├── lib/
│   │   ├── components/
│   │   │   ├── layout/         # Header / Sidebar / Ticker
│   │   │   ├── news/           # FeaturedCard / NewsCard / NewsGrid
│   │   │   └── timemachine/    # TimeMachinePanel / ArchiveBanner
│   │   ├── stores/             # Svelte ストア（news / timeMachine / ui）
│   │   └── utils/              # カテゴリマップ・日付フォーマット
│   └── app.css                 # PULSE デザイントークン
├── server/
│   ├── db/database.js          # SQLite 接続・スキーマ
│   └── feeds/                  # RSS フェッチャー・スケジューラー
├── scripts/
│   └── init-db.js              # DB 初期化スクリプト
└── Dockerfile                  # マルチステージビルド
```

---

## ライセンス

MIT
