# Birthday Surprise - 七夕情人節驚喜網頁

## 專案概述

一個浪漫的七夕情人節驚喜互動網頁，以銀河星空為主題，包含愛心爆炸動畫、Canvas 星空隧道穿越效果和情書展示。部署於 GitHub Pages。

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
├── main.js             # 核心邏輯 (星星生成、Canvas 隧道、動畫控制、場景轉換)
├── style.css           # 所有樣式 (星空、愛心、爆炸效果、信件)
├── package.json        # 依賴與腳本 (gsap)
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
- 純黑銀河背景，150 顆隨機閃爍星星 (白/青/粉/金，3 種尺寸)
- 星雲漂浮效果 (`body::before` 多層 radial-gradient + nebulaDrift 動畫)
- 流星不定時劃過 (右上往左下，帶漸層尾巴)
- 中央顯示由 35 顆輪廓 + 12 顆填充星星組成的愛心形狀 (心形方程式)
- 愛心持續心跳動畫 (`heartbeat`) + 下方「點我」提示文字 (3D text-shadow 立體效果)

### 點擊觸發: 銀河穿越轉場
1. 愛心內縮 (`heartImplode` 0.3s) → 星星向四方爆射 (`galaxyExplode` 1s)
2. 衝擊波環 (`shockwave` 0.8s + `shockwave2` 0.6s) + 輕微螢幕震動 (`screenShake` 0.4s)
3. 靜態星星淡出 (0.5s)，Scene1 UI 淡出 (0.6s)
4. 啟動 **Canvas 星空隧道** (2.5 秒沉浸穿越銀河)
   - 星星持續從螢幕中心生成、加速向外飛散 (粒子系統)
   - 帶 6 幀光軌拖尾效果
   - 離中心越遠越亮越大 (透視效果，alpha 與 size 隨距離增加)
   - 速度曲線：慢啟動 (1-2.2x) → 加速巡航 (2.2-3.4x) → 減速停靠
   - 中心紫色光暈聚焦點 (radialGradient)
   - 預先填充 80 顆星星在各種距離，避免開場空白
5. 隧道進行 1.7s 後：Flash overlay 柔和閃光過渡 (白光→暖粉→淡出)
6. 隧道結束：Canvas 淡出移除 (0.6s)，觸發信件場景
7. 星星背景重新生成 + 淡入 (1.5s) + 進入密集流星模式

### Scene 2: 情書內容 (`#scene2`)
- 毛玻璃卡片容器 (`backdrop-filter: blur(10px)`)
- 每行文字像流星從右上滑入 (GSAP 動畫，間隔 0.35s，x:80 y:-20 → 0)
- 滑入時帶流星光軌 `text-shadow` 效果，落定後回歸柔和光暈
- 紫色漸層高亮區塊 + 金色文字顯示重點訊息
- 底部 5 個 CSS 純手繪漂浮愛心裝飾 (交錯動畫延遲)

---

## 核心檔案詳解

### `main.js` (501 行)

| 函式 | 行數 | 功能 |
|------|------|------|
| `createHeartStars()` | 20-81 | 用心形方程式生成 35 顆輪廓 + 12 顆填充星星排列成愛心，各帶爆炸方向向量 |
| `createStars()` | 86-111 | 生成 150 顆隨機背景星星 (3 尺寸 + 3 色彩變體) |
| `createShootingStar()` | 116-128 | 建立單顆流星 DOM 元素，1.2s 後自動移除 |
| `startShootingStars()` | 132-143 | 定時產生流星 (普通 3-8s / 密集 0.2-2s 間隔) |
| `enableIntenseShootingStars()` | 145-150 | 開啟密集流星模式，立即連發 3 顆 |
| `startWarpTunnel(duration, onComplete)` | 156-320 | Canvas 2D 星空隧道粒子系統 (光軌 + 透視 + 速度曲線 + 中心光暈) |
| `transitionToLetter()` | 325-386 | 場景轉換編排 (爆炸→震動→星星淡出→隧道→閃光→信件) |
| `showLetterScene()` | 391-416 | 隧道結束後：移除 scene1、重建星空、淡入 scene2、啟動密集流星 |
| `animateLetterContent()` | 421-462 | 信件文字流星滑入動畫 (GSAP timeline，帶光軌→柔光 text-shadow 過渡) |
| `handleHeartClick()` | 467-472 | 點擊事件處理，`isAnimating` flag 防重複觸發 |

**依賴**: `gsap` (動畫時間軸、緩動曲線)

### `style.css` (773 行)

| 區塊 | 行數範圍 | 內容 |
|------|----------|------|
| 字體與基礎 | 1-33 | @font-face (ChenYuluoyan)、CSS reset、body 佈局 (flex 置中) |
| 星雲背景 | 35-67 | `body::before` 4 層 radial-gradient + `nebulaDrift` 30s 動畫 |
| Flash Overlay | 69-79 | 轉場閃光覆蓋層 (`position: fixed`, z-index: 500) |
| App 容器 | 81-86 | `#app` 全螢幕容器 (z-index: 1) |
| 星星背景 | 88-154 | `#stars-container`、`.star` (3 尺寸 small/medium/large + 3 色 cyan/pink/gold)、`twinkle` 動畫 |
| 流星 | 156-204 | `.shooting-star` 本體 + `::after` 尾巴 (100px 漸層) + `shoot` 動畫 |
| 場景基礎 | 206-222 | `.scene` 全螢幕絕對定位、`.active` 僅控制 visibility |
| 愛心容器 | 224-263 | `.heart-container` flex 佈局、`.star-heart` 心跳動畫 + drop-shadow |
| 愛心星星 | 265-307 | `.heart-star` (5px 圓點 + 光暈)、pink/gold 變體、`starTwinkle` 動畫 |
| 銀河爆炸 | 309-454 | `heartImplode`、`galaxyExplode`、`shockwave` × 2、`screenShake` |
| 提示文字 | 456-490 | `.hint-text` 3D text-shadow 5 層深度 + `pulse3D` 動畫 |
| CSS 裝飾 | 492-637 | `sparkle-star` (閃爍十字星 `::before`/`::after`)、`floating-heart` (CSS 愛心 5 色變體) |
| 信件樣式 | 639-735 | 毛玻璃容器、文字光暈、highlight-block 金色高亮、hearts-decoration 心跳裝飾 |
| RWD | 737-773 | 手機直向 (≤480px) + 橫向 (≤500px height) 適配 |

### `index.html` (66 行)
- 兩個 `<section>` 場景 (`scene1` 星心 / `scene2` 信件)
- `scene1` 帶 `style="opacity: 1;"` 內聯樣式 (防止 GSAP 設定前的閃爍)
- `<div id="flash-overlay">` 轉場閃光覆蓋層 (位於 `#app` 外部)
- 所有裝飾使用 CSS class 而非 emoji (`sparkle-star`、`floating-heart`)
- 信件內容：7 行正文 + 2 行金色高亮重點 + 5 個漂浮愛心

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
2. **性能優化**: 星星減量至 150 顆、CSS 動畫僅用 transform+opacity (無 filter blur)、星空隧道使用 Canvas 2D 粒子系統取代 DOM 動畫
3. **沉浸式轉場**: Canvas 星空隧道模擬穿越銀河的前進感、flash overlay (radial-gradient) 柔和過渡、scene1/scene2 交叉淡入淡出無黑屏
4. **防閃爍**: `.scene.active` 僅設 visibility、scene1 內聯 opacity:1、scene2 由 GSAP 先設 opacity:0 再加 active class
5. **防重複觸發**: `isAnimating` flag 防止多次點擊
6. **RWD 適配**: 手機直向 + 橫向模式皆有優化
7. **觸控支援**: 同時綁定 `click` + `touchend` (附 preventDefault)

---

## Git 歷史摘要

| Commit | 說明 |
|--------|------|
| `60f9546` | 移除 canvas-confetti 彩帶效果，保持沉浸式銀河體驗 |
| `bcec9b5` | Canvas 星空隧道穿越效果 - 真正的衝入銀河沉浸體驗 |
| `14a7170` | 優化轉場效果 - 衝入銀河方向、消除 lag、滑順過渡 |
| `c30e61e` | 配置 GitHub Pages 部署 |
| `102c4f3` | 移除所有 emoji，改用 CSS 裝飾 |
| `84bed60` | 修正愛心形狀、降低亮度、優化轉場性能 |
| `22ddd14` | 史詩級銀河爆炸效果 (衝擊波、震動、多階段閃光) |
| `ce4a405` | 傳送門替換為浪漫星星愛心 + 點擊爆炸 |
| `0843a42` | 強化銀河主題 (純黑背景、星雲、彩色星星、warp speed) |
| `69bf445` | 新增 skill ui-ux-pro-max |
| `2d12a83` | 將禮物盒改為宇宙傳送門 |
| `c84b206` | 修正流星尾巴向右上方延伸 |
| `d7c551a` | 修正流星尾巴方向 |
| `d4c5a0f` | 重新設計流星樣式 |
| `7c27ee8` | 修正流星方向為右上到左下，添加密集模式 |
| `82b16df` | 首頁文字 3D 立體效果 |
| `f2733ca` | 流星滑入文字動畫效果 |
| `8910d1d` | 最初版本 - 星空主題實現 |

---

## 修改注意事項

- 修改 `base` 路徑時需同步更新 `vite.config.js`
- 字體檔案在 `font/` 資料夾，CSS 中以 `/font/` 絕對路徑引用
- flash overlay z-index: 500，高於 app (z-index: 1)
- 場景切換靠 GSAP 控制交叉淡入淡出，`.active` class 僅控制 visibility
- scene2 顯示前必須先 `gsap.set(scene2, { opacity: 0 })` 再加 `.active`，避免 1 幀閃爍
- warp 隧道使用動態建立的 Canvas (z-index: 2)，結束後自動淡出並移除 DOM
- `showLetterScene()` 會清空 `starsContainer` 並重建星星，避免殘留 DOM
- 星空隧道預填 80 顆星星避免開場空白，每幀生成 2-6 顆新星星

---

*最後更新: 2026-02-12*
