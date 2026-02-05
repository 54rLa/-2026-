import gsap from 'gsap';
import confetti from 'canvas-confetti';

// DOM Elements
const portal = document.getElementById('portal');
const portalContainer = document.getElementById('portalContainer');
const scene1 = document.getElementById('scene1');
const scene2 = document.getElementById('scene2');
const letterLines = document.querySelectorAll('.letter-line');
const heartsDecoration = document.querySelector('.hearts-decoration');
const starsContainer = document.getElementById('stars-container');
const shootingStarsContainer = document.getElementById('shooting-stars');

// Custom confetti canvas
const confettiCanvas = document.getElementById('confetti-canvas');
const myConfetti = confetti.create(confettiCanvas, {
  resize: true,
  useWorker: true
});

// State
let isAnimating = false;

/**
 * 生成隨機星星背景 - 銀河效果
 */
function createStars() {
  const starCount = 250; // 更多星星
  const colorVariants = ['', '', '', '', 'cyan', 'pink', 'gold']; // 大部分白色，少數彩色

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    // 隨機大小
    const rand = Math.random();
    const sizeClass = rand < 0.65 ? 'small' : rand < 0.9 ? 'medium' : 'large';
    star.classList.add(sizeClass);

    // 隨機顏色變體
    const colorClass = colorVariants[Math.floor(Math.random() * colorVariants.length)];
    if (colorClass) star.classList.add(colorClass);

    // 隨機位置
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;

    // 隨機閃爍時間和延遲
    star.style.setProperty('--twinkle-duration', `${1.5 + Math.random() * 3}s`);
    star.style.setProperty('--twinkle-delay', `${Math.random() * 5}s`);

    starsContainer.appendChild(star);
  }
}

/**
 * 創建流星效果
 */
function createShootingStar() {
  const shootingStar = document.createElement('div');
  shootingStar.className = 'shooting-star';

  // 從右上角開始（右側 30%-90%，上方 5%-40%）
  shootingStar.style.left = `${30 + Math.random() * 60}%`;
  shootingStar.style.top = `${5 + Math.random() * 35}%`;

  shootingStarsContainer.appendChild(shootingStar);

  // 動畫結束後移除
  setTimeout(() => {
    shootingStar.remove();
  }, 1200);
}

/**
 * 定期產生流星
 */
let shootingStarIntense = false;

function startShootingStars() {
  // 隨機間隔產生流星
  const scheduleNext = () => {
    // 密集模式：1-3秒，普通模式：3-8秒
    const delay = shootingStarIntense
      ? 200 + Math.random() * 2000
      : 3000 + Math.random() * 5000;
    setTimeout(() => {
      createShootingStar();
      scheduleNext();
    }, delay);
  };
  scheduleNext();
}

/**
 * 啟動密集流星模式
 */
function enableIntenseShootingStars() {
  shootingStarIntense = true;
  // 立即產生幾顆流星
  for (let i = 0; i < 3; i++) {
    setTimeout(() => createShootingStar(), i * 300);
  }
}

/**
 * 觸發星空主題 confetti 爆炸特效
 */
function triggerConfetti() {
  // 星空主題顏色：紫、藍、白、金
  const colors = ['#a78bfa', '#818cf8', '#c4b5fd', '#fcd34d', '#ffffff', '#93c5fd'];

  // 主爆炸 - 星星形狀
  myConfetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: colors,
    shapes: ['star', 'circle'],
    scalar: 1.2
  });

  // 側邊爆炸
  setTimeout(() => {
    myConfetti({
      particleCount: 50,
      spread: 100,
      origin: { y: 0.5, x: 0.3 },
      colors: colors,
      gravity: 0.8,
      shapes: ['star']
    });

    myConfetti({
      particleCount: 50,
      spread: 100,
      origin: { y: 0.5, x: 0.7 },
      colors: colors,
      gravity: 0.8,
      shapes: ['star']
    });
  }, 200);

  // 持續灑落效果
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    myConfetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.5 },
      colors: colors,
      shapes: ['star']
    });

    myConfetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.5 },
      colors: colors,
      shapes: ['star']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  setTimeout(frame, 500);
}

/**
 * 場景轉換：穿越傳送門進入宇宙
 */
function transitionToLetter() {
  const tl = gsap.timeline();

  // 觸發 Warp Speed 效果 - 星星拉成線條
  starsContainer.classList.add('warp-speed');

  // 傳送門穿越動畫
  portal.classList.add('entering');

  // 短暫白色閃光
  gsap.to(document.body, {
    backgroundColor: '#ffffff',
    duration: 0.1,
    delay: 0.8,
    onComplete: () => {
      gsap.to(document.body, {
        backgroundColor: '#000000',
        duration: 0.3
      });
    }
  });

  // 等待穿越動畫完成後轉換場景
  tl.to(scene1, {
    opacity: 0,
    duration: 1.2,
    delay: 0.5,
    onComplete: () => {
      scene1.classList.remove('active');
      scene2.classList.add('active');
      document.body.classList.add('dark-mode');
      // 移除 warp speed 效果
      starsContainer.classList.remove('warp-speed');
      // 啟動密集流星模式
      enableIntenseShootingStars();
    }
  })
    .to(scene2, {
      opacity: 1,
      duration: 0.5
    })
    .add(() => {
      animateLetterContent();
    });
}

/**
 * 信件內容 - 流星滑入動畫
 */
function animateLetterContent() {
  const tl = gsap.timeline();

  // 每行文字像流星一樣從右上滑入
  letterLines.forEach((line, index) => {
    // 設定初始狀態：在右上方，透明
    gsap.set(line, {
      opacity: 0,
      x: 100,
      y: -30,
      filter: 'blur(4px)'
    });

    tl.to(line, {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'power3.out',
      onStart: () => {
        // 添加流星光軌效果
        line.style.textShadow = '20px -10px 20px rgba(200, 180, 255, 0.8), 40px -20px 30px rgba(150, 130, 220, 0.5)';
      },
      onComplete: () => {
        // 動畫結束後恢復正常光暈
        gsap.to(line, {
          textShadow: '0 2px 15px rgba(180, 160, 255, 0.6)',
          duration: 0.5
        });
      }
    }, index * 0.4); // 每行間隔 0.4 秒
  });

  // 最後顯示愛心裝飾（也用流星效果）
  gsap.set(heartsDecoration, {
    opacity: 0,
    x: 50,
    y: -20
  });

  tl.to(heartsDecoration, {
    opacity: 1,
    x: 0,
    y: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.2');
}

/**
 * 主要點擊事件處理
 */
function handlePortalClick() {
  if (isAnimating) return;
  isAnimating = true;

  // 觸發 confetti 和場景轉換
  triggerConfetti();
  transitionToLetter();
}

// 初始化星空背景
createStars();
startShootingStars();

// 事件綁定
portalContainer.addEventListener('click', handlePortalClick);
portalContainer.addEventListener('touchend', (e) => {
  e.preventDefault();
  handlePortalClick();
});

// 初始動畫：傳送門入場
gsap.from(portal, {
  scale: 0,
  rotation: -180,
  duration: 1.2,
  ease: 'back.out(1.4)',
  delay: 0.3
});

gsap.from('.hint-text', {
  opacity: 0,
  y: 20,
  duration: 0.5,
  delay: 1.2
});
