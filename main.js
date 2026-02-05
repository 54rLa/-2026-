import gsap from 'gsap';
import confetti from 'canvas-confetti';

// DOM Elements
const starHeart = document.getElementById('starHeart');
const heartContainer = document.getElementById('heartContainer');
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
 * 生成愛心形狀的星星
 */
function createHeartStars() {
  const heartWidth = 200;
  const heartHeight = 180;
  const starCount = 45;
  const colorVariants = ['', '', '', 'pink', 'pink', 'gold'];

  // 愛心參數方程點
  for (let i = 0; i < starCount; i++) {
    const t = (i / starCount) * Math.PI * 2;

    // 愛心形狀參數方程
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    // 轉換到容器坐標
    const px = (x / 16) * (heartWidth / 2) + heartWidth / 2;
    const py = (y / 16) * (heartHeight / 2) + heartHeight / 2;

    const star = document.createElement('div');
    star.className = 'heart-star';

    // 隨機顏色
    const colorClass = colorVariants[Math.floor(Math.random() * colorVariants.length)];
    if (colorClass) star.classList.add(colorClass);

    star.style.left = `${px}px`;
    star.style.top = `${py}px`;

    // 爆炸方向 (從中心向外)
    const centerX = heartWidth / 2;
    const centerY = heartHeight / 2;
    const explodeX = (px - centerX) * (3 + Math.random() * 2);
    const explodeY = (py - centerY) * (3 + Math.random() * 2);
    star.style.setProperty('--explode-x', `${explodeX}px`);
    star.style.setProperty('--explode-y', `${explodeY}px`);

    // 隨機閃爍
    star.style.setProperty('--twinkle-duration', `${1 + Math.random() * 1.5}s`);
    star.style.setProperty('--twinkle-delay', `${Math.random() * 2}s`);

    starHeart.appendChild(star);
  }

  // 添加一些內部填充星星
  for (let i = 0; i < 20; i++) {
    const t = Math.random() * Math.PI * 2;
    const scale = Math.random() * 0.7;

    const x = 16 * Math.pow(Math.sin(t), 3) * scale;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;

    const px = (x / 16) * (heartWidth / 2) + heartWidth / 2;
    const py = (y / 16) * (heartHeight / 2) + heartHeight / 2;

    const star = document.createElement('div');
    star.className = 'heart-star';
    const colorClass = colorVariants[Math.floor(Math.random() * colorVariants.length)];
    if (colorClass) star.classList.add(colorClass);

    star.style.left = `${px}px`;
    star.style.top = `${py}px`;
    star.style.width = '4px';
    star.style.height = '4px';
    star.style.opacity = '0.7';

    const centerX = heartWidth / 2;
    const centerY = heartHeight / 2;
    const explodeX = (px - centerX) * (4 + Math.random() * 3);
    const explodeY = (py - centerY) * (4 + Math.random() * 3);
    star.style.setProperty('--explode-x', `${explodeX}px`);
    star.style.setProperty('--explode-y', `${explodeY}px`);
    star.style.setProperty('--twinkle-duration', `${0.8 + Math.random() * 1}s`);
    star.style.setProperty('--twinkle-delay', `${Math.random() * 1.5}s`);

    starHeart.appendChild(star);
  }
}

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
 * 觸發銀河爆炸 confetti 特效
 */
function triggerConfetti() {
  // 銀河主題顏色：紫、藍、白、金、粉
  const colors = ['#a78bfa', '#818cf8', '#c4b5fd', '#fcd34d', '#ffffff', '#93c5fd', '#f472b6', '#fb7185'];

  // 第一波：中心大爆炸
  myConfetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.5 },
    colors: colors,
    shapes: ['star', 'circle'],
    scalar: 1.5,
    gravity: 0.6,
    drift: 0
  });

  // 第二波：向外擴散
  setTimeout(() => {
    myConfetti({
      particleCount: 80,
      spread: 180,
      origin: { y: 0.5 },
      colors: colors,
      shapes: ['star'],
      scalar: 1.2,
      gravity: 0.4
    });
  }, 100);

  // 第三波：四面八方爆發
  setTimeout(() => {
    // 左
    myConfetti({
      particleCount: 40,
      angle: 60,
      spread: 80,
      origin: { x: 0.3, y: 0.5 },
      colors: colors,
      shapes: ['star'],
      gravity: 0.5
    });
    // 右
    myConfetti({
      particleCount: 40,
      angle: 120,
      spread: 80,
      origin: { x: 0.7, y: 0.5 },
      colors: colors,
      shapes: ['star'],
      gravity: 0.5
    });
    // 上
    myConfetti({
      particleCount: 30,
      angle: 90,
      spread: 60,
      origin: { x: 0.5, y: 0.3 },
      colors: colors,
      shapes: ['star'],
      gravity: 0.3
    });
  }, 200);

  // 持續灑落星星
  const duration = 2500;
  const end = Date.now() + duration;

  const frame = () => {
    myConfetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.5 },
      colors: colors,
      shapes: ['star']
    });

    myConfetti({
      particleCount: 2,
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

  setTimeout(frame, 400);
}

/**
 * 場景轉換：愛心爆炸後進入信件
 */
function transitionToLetter() {
  const tl = gsap.timeline();

  // 停止心跳動畫
  starHeart.style.animation = 'none';

  // 觸發愛心爆炸
  starHeart.classList.add('exploding');

  // 添加螢幕震動效果
  setTimeout(() => {
    scene1.classList.add('shaking');
  }, 200);

  // 觸發 Warp Speed 效果 - 背景星星拉成線條
  setTimeout(() => {
    starsContainer.classList.add('warp-speed');
  }, 400);

  // 劇烈白色閃光 (銀河爆炸)
  gsap.to(document.body, {
    backgroundColor: '#ffffff',
    duration: 0.08,
    delay: 0.25,
    onComplete: () => {
      gsap.to(document.body, {
        backgroundColor: '#ffb6c1',
        duration: 0.1,
        onComplete: () => {
          gsap.to(document.body, {
            backgroundColor: '#000000',
            duration: 0.5
          });
        }
      });
    }
  });

  // 等待爆炸動畫完成後轉換場景
  tl.to(scene1, {
    opacity: 0,
    duration: 1,
    delay: 0.6,
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
function handleHeartClick() {
  if (isAnimating) return;
  isAnimating = true;

  // 觸發 confetti 和場景轉換
  triggerConfetti();
  transitionToLetter();
}

// 初始化星空背景
createStars();
createHeartStars();
startShootingStars();

// 事件綁定
heartContainer.addEventListener('click', handleHeartClick);
heartContainer.addEventListener('touchend', (e) => {
  e.preventDefault();
  handleHeartClick();
});

// 初始動畫：愛心入場
gsap.from(starHeart, {
  scale: 0,
  rotation: -15,
  duration: 1,
  ease: 'elastic.out(1, 0.5)',
  delay: 0.3
});

gsap.from('.hint-text', {
  opacity: 0,
  y: 20,
  duration: 0.5,
  delay: 1
});
