# Birthday Surprise - 七夕情人節驚喜網頁

## 專案概述

一個浪漫的七夕情人節驚喜互動網頁，以銀河星空為主題，包含愛心爆炸動畫和情書展示。部署於 GitHub Pages。

**線上網址**: `https://54rLa.github.io/-2026-/`

---

## 技術棧

| 項目 | 技術 |
|------|------|
| 建構工具 | Vite 7.3.1 |
| 動畫引擎 | GSAP 3.14.2 |
| 部署 | gh-pages (GitHub Pages) |
| 字體 | 辰宇落雁體 (ChenYuluoyan 2.0 Thin) |
| 語言 | 純 HTML + CSS + JavaScript (ES Module) |

---

## 專案結構

```
birthday-surprise/
├── index.html          # 主頁面 (兩個場景 + flash overlay)
├── main.js             # 核心邏輯 (星星生成、動畫控制、場景轉換)
├── style.css           # 所有樣式 (星空、愛心、爆炸效果、信件)
├── package.json        # 依賴與腳本
├── vite.config.js      # Vite 配置 (base: '/-2026-/')
├── .gitignore          # 忽略 node_modules/, dist/
├── start_server.bat    # 本地開發伺服器啟動 (--host 開放區網)
├── update_site.bat     # 一鍵部署腳本 (git add/commit/push + npm run deploy)
├── 網址.txt            # GitHub Pages 線上網址記錄
├── font/
│   ├── ChenYuluoyan-2.0-Thin.ttf         # 主要字體
│   └── ChenYuluoyan-Thin-Monospaced.ttf  # 等寬版本 (未使用)
├── dist/               # Vite 建構產出 (部署用，已 gitignore)
└── node_modules/       # 依賴套件 (已 gitignore)
```

---

## 頁面流程與場景

### Scene 1: 星星愛心 (`#scene1`)
- 黑色銀河背景，150 顆隨機閃爍星星 (白/青/粉/金)
- 星雲漂浮效果 (`body::before` 漸層動畫)
- 流星不定時劃過 (右上往左下)
- 中央顯示由 35 顆星星組成的愛心形狀 (心形方程式)
- 愛心持續心跳動畫 + 下方「點我」提示文字 (3D 立體效果)

### 點擊觸發: 銀河穿越轉場
1. 愛心內縮 (implode) → 星星向四方爆射 (galaxyExplode)
2. 衝擊波環 (shockwave) × 2 + 輕微螢幕震動 (screenShake)
3. 靜態星星淡出，啟動 **Canvas 星空隧道** (2.5 秒沉浸穿越銀河)
   - 星星持續從螢幕中心生成、加速向外飛散
   - 帶光軌拖尾、離中心越遠越亮越大 (透視效果)
   - 速度曲線：慢啟動 → 加速巡航 → 減速停靠
   - 中心紫色光暈聚焦點
5. 隧道尾聲：Flash overlay 柔和閃光過渡 (白光→暖粉→淡出)
6. 隧道結束：canvas 淡出移除，信件場景淡入
7. 星星背景重新生成 + 淡入 + 進入密集流星模式

### Scene 2: 情書內容 (`#scene2`)
- 毛玻璃卡片容器 (backdrop-filter: blur)
- 每行文字像流星從右上滑入 (GSAP 動畫，間隔 0.35s)
- 滑入時帶流星光軌 text-shadow 效果
- 金色高亮區塊顯示重點訊息
- 底部 5 個 CSS 純手繪漂浮愛心裝飾

---

## 核心檔案詳解

### `main.js` (~500 行)

| 函式 | 功能 |
|------|------|
| `createHeartStars()` | 用心形方程式生成 35+12 顆星星排列成愛心 |
| `createStars()` | 生成 150 顆隨機背景星星 |
| `createShootingStar()` | 建立單顆流星 DOM 元素，1.2s 後自動移除 |
| `startShootingStars()` | 定時產生流星 (普通 3-8s / 密集 0.2-2s) |
| `enableIntenseShootingStars()` | 開啟密集流星模式，立即發射 3 顆 |
| `startWarpTunnel(duration, onComplete)` | Canvas 星空隧道 (粒子系統 + 光軌 + 速度曲線) |
| `transitionToLetter()` | 場景轉換 (爆炸→隧道→閃光→信件) |
| `showLetterScene()` | 隧道結束後顯示信件、重建星空 |
| `animateLetterContent()` | 信件文字流星滑入動畫 |
| `handleHeartClick()` | 點擊事件，防重複觸發 |

**依賴**: `gsap` (動畫時間軸)

### `style.css` (~809 行)

| 區塊 | 行數範圍 | 內容 |
|------|----------|------|
| 字體與基礎 | 1-33 | @font-face、reset、body 佈局 |
| 星雲背景 | 35-67 | `body::before` 漸層 + nebulaDrift 動畫 |
| Flash Overlay | 69-79 | 轉場閃光覆蓋層 (z-index: 500) |
| 星星系統 | 88-178 | 背景星星 (3 種尺寸 + 3 種顏色)、twinkle 動畫 |
| Warp Speed | 99-121 | 星星中心向外放射 (warpRadial，純 transform 無 filter) |
| 流星 | 180-228 | 流星本體 + 尾巴 (::after) + shoot 動畫 |
| 愛心星星 | 260-343 | 心形內星星樣式、starTwinkle 動畫 |
| 銀河爆炸 | 345-490 | implode、galaxyExplode、shockwave×2、screenShake |
| 提示文字 | 492-526 | 3D text-shadow 立體效果、pulse3D 動畫 |
| CSS 裝飾 | 528-673 | sparkle-star (閃爍十字星)、floating-heart (漂浮愛心) |
| 信件樣式 | 675-771 | 毛玻璃容器、文字光暈、高亮區塊、心跳裝飾 |
| RWD | 773-808 | 手機 (≤480px) 與橫向模式適配 |

### `index.html` (69 行)
- 兩個 `<section>` 場景 (`scene1` 星心 / `scene2` 信件)
- `<div id="flash-overlay">` 轉場閃光覆蓋層
- 所有裝飾使用 CSS class 而非 emoji (`sparkle-star`、`floating-heart`)

---

## 開發指令

```bash
npm run dev        # 啟動開發伺服器 (Vite)
npm run build      # 建構生產版本到 dist/
npm run preview    # 預覽建構結果
npm run deploy     # 建構 + 部署到 GitHub Pages (gh-pages -d dist)
```

也可使用批次腳本:
- `start_server.bat` - 啟動開發伺服器 (開放區網存取)
- `update_site.bat` - 一鍵 git add → commit → push → build → deploy

---

## Vite 配置

```js
// vite.config.js
export default defineConfig({
  base: '/-2026-/',  // GitHub Pages 子路徑
})
```

---

## 設計特點

1. **無 emoji 設計**: 所有裝飾元素皆用 CSS 偽元素 (`::before`/`::after`) 手繪
2. **性能優化**: 星星減量至 150 顆、warp 動畫僅用 transform+opacity (無 filter blur)、Canvas 粒子系統取代 DOM 動畫
3. **滑順轉場**: flash overlay (radial-gradient) 取代直接改 body 背景色、scene1/scene2 交叉淡入淡出無黑屏、warp 後星星重新生成淡入
4. **防重複觸發**: `isAnimating` flag 防止多次點擊
5. **RWD 適配**: 手機直向 + 橫向模式皆有優化
6. **觸控支援**: 同時綁定 `click` + `touchend` (附 preventDefault)

---

## Git 歷史摘要

| Commit | 說明 |
|--------|------|
| `c30e61e` | 配置 GitHub Pages 部署 |
| `102c4f3` | 移除所有 emoji，改用 CSS 裝飾 |
| `84bed60` | 修正愛心形狀、降低亮度、優化轉場 |
| `22ddd14` | 史詩級銀河爆炸效果 (衝擊波、震動、多階段閃光) |
| `ce4a405` | 傳送門替換為浪漫星星愛心 + 點擊爆炸 |
| `0843a42` | 強化銀河主題 (純黑背景、星雲、彩色星星、warp speed) |
| `8910d1d` | 最初版本 - 星空主題實現 |

---

## 修改注意事項

- 修改 `base` 路徑時需同步更新 `vite.config.js`
- 字體檔案在 `font/` 資料夾，CSS 中以 `/font/` 絕對路徑引用
- flash overlay z-index: 500，高於 app (1)
- 場景切換靠 GSAP 控制交叉淡入淡出，`.active` class 控制 visibility
- warp 動畫避免使用 `filter: blur()` 以防 lag (250→150 顆星星同時動畫)
- `regenerateStars()` 在 warp 結束後清空並重建星星，避免殘留 DOM

---

*最後更新: 2026-02-11*
