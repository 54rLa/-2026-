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
const flashOverlay = document.getElementById('flash-overlay');

// Custom confetti canvas
const confettiCanvas = document.getElementById('confetti-canvas');
const myConfetti = confetti.create(confettiCanvas, {
  resize: true,
  useWorker: true
});

// State
let isAnimating = false;

/**
 * 生成愛心形狀的星星 - 優化版
 */
function createHeartStars() {
  const heartWidth = 180;
  const heartHeight = 160;
  const outlineStars = 35;
  const colorVariants = ['', '', 'pink', 'gold'];

  for (let i = 0; i < outlineStars; i++) {
    const t = (i / outlineStars) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

    const px = (x / 18) * (heartWidth / 2) + heartWidth / 2;
    const py = (-y / 18) * (heartHeight / 2) + heartHeight / 2 - 10;

    const star = document.createElement('div');
    star.className = 'heart-star';

    const colorClass = colorVariants[Math.floor(Math.random() * colorVariants.length)];
    if (colorClass) star.classList.add(colorClass);

    star.style.left = `${px}px`;
    star.style.top = `${py}px`;

    const centerX = heartWidth / 2;
    const centerY = heartHeight / 2;
    const explodeX = (px - centerX) * 4;
    const explodeY = (py - centerY) * 4;
    star.style.setProperty('--explode-x', `${explodeX}px`);
    star.style.setProperty('--explode-y', `${explodeY}px`);

    star.style.setProperty('--twinkle-duration', `${1.5 + Math.random() * 1.5}s`);
    star.style.setProperty('--twinkle-delay', `${Math.random() * 2}s`);

    starHeart.appendChild(star);
  }

  // 內部填充星星
  for (let i = 0; i < 12; i++) {
    const t = Math.random() * Math.PI * 2;
    const scale = 0.2 + Math.random() * 0.5;

    const x = 16 * Math.pow(Math.sin(t), 3) * scale;
    const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;

    const px = (x / 18) * (heartWidth / 2) + heartWidth / 2;
    const py = (-y / 18) * (heartHeight / 2) + heartHeight / 2 - 10;

    const star = document.createElement('div');
    star.className = 'heart-star small';

    star.style.left = `${px}px`;
    star.style.top = `${py}px`;

    const centerX = heartWidth / 2;
    const centerY = heartHeight / 2;
    star.style.setProperty('--explode-x', `${(px - centerX) * 5}px`);
    star.style.setProperty('--explode-y', `${(py - centerY) * 5}px`);
    star.style.setProperty('--twinkle-duration', `${1 + Math.random() * 1}s`);
    star.style.setProperty('--twinkle-delay', `${Math.random() * 1.5}s`);

    starHeart.appendChild(star);
  }
}

/**
 * 生成隨機星星背景 - 銀河效果 (減量至 150 顆降低 lag)
 */
function createStars() {
  const starCount = 150;
  const colorVariants = ['', '', '', '', 'cyan', 'pink', 'gold'];

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    const rand = Math.random();
    const sizeClass = rand < 0.65 ? 'small' : rand < 0.9 ? 'medium' : 'large';
    star.classList.add(sizeClass);

    const colorClass = colorVariants[Math.floor(Math.random() * colorVariants.length)];
    if (colorClass) star.classList.add(colorClass);

    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    star.style.left = `${posX}%`;
    star.style.top = `${posY}%`;

    // Warp 方向：從螢幕中心往外放射
    const dx = posX - 50;
    const dy = posY - 50;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const warpX = (dx / dist) * (60 + dist * 2.5);
    const warpY = (dy / dist) * (60 + dist * 2.5);
    star.style.setProperty('--warp-x', `${warpX}vw`);
    star.style.setProperty('--warp-y', `${warpY}vh`);

    star.style.setProperty('--twinkle-duration', `${1.5 + Math.random() * 3}s`);
    star.style.setProperty('--twinkle-delay', `${Math.random() * 5}s`);

    // Warp 延遲：靠中心的先動，模擬深度
    const warpDelay = (1 - dist / 70) * 0.2;
    star.style.setProperty('--warp-delay', `${Math.max(0, warpDelay).toFixed(2)}s`);

    starsContainer.appendChild(star);
  }
}

/**
 * 創建流星效果
 */
function createShootingStar() {
  const shootingStar = document.createElement('div');
  shootingStar.className = 'shooting-star';

  shootingStar.style.left = `${30 + Math.random() * 60}%`;
  shootingStar.style.top = `${5 + Math.random() * 35}%`;

  shootingStarsContainer.appendChild(shootingStar);

  setTimeout(() => {
    shootingStar.remove();
  }, 1200);
}

/**
 * 定期產生流星
 */
let shootingStarIntense = false;

function startShootingStars() {
  const scheduleNext = () => {
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
  for (let i = 0; i < 3; i++) {
    setTimeout(() => createShootingStar(), i * 300);
  }
}

/**
 * 觸發 confetti 特效 (精簡版，減少粒子數)
 */
function triggerConfetti() {
  const colors = ['#a78bfa', '#818cf8', '#c4b5fd', '#fcd34d', '#ffffff', '#93c5fd', '#f472b6'];

  // 單波中心爆發
  myConfetti({
    particleCount: 80,
    spread: 120,
    origin: { y: 0.5 },
    colors: colors,
    shapes: ['star', 'circle'],
    scalar: 1.3,
    gravity: 0.5,
    drift: 0
  });

  // 兩側爆發
  setTimeout(() => {
    myConfetti({
      particleCount: 30,
      angle: 60,
      spread: 70,
      origin: { x: 0.2, y: 0.5 },
      colors: colors,
      shapes: ['star'],
      gravity: 0.5
    });
    myConfetti({
      particleCount: 30,
      angle: 120,
      spread: 70,
      origin: { x: 0.8, y: 0.5 },
      colors: colors,
      shapes: ['star'],
      gravity: 0.5
    });
  }, 200);

  // 持續灑落 (降低頻率，每 3 幀才噴一次)
  const duration = 1800;
  const end = Date.now() + duration;
  let frameCount = 0;

  const frame = () => {
    frameCount++;
    if (frameCount % 3 === 0) {
      myConfetti({
        particleCount: 1,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 },
        colors: colors,
        shapes: ['star']
      });
      myConfetti({
        particleCount: 1,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 },
        colors: colors,
        shapes: ['star']
      });
    }

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  setTimeout(frame, 500);
}

/**
 * 場景轉換：用 flash overlay 做滑順過渡，不直接改 body 背景
 */
function transitionToLetter() {
  const tl = gsap.timeline();

  // 停止心跳動畫
  starHeart.style.animation = 'none';

  // 觸發愛心爆炸
  starHeart.classList.add('exploding');

  // 螢幕震動 (輕微)
  setTimeout(() => {
    scene1.classList.add('shaking');
  }, 150);

  // Warp Speed 效果 - 星星從中心向外飛散
  setTimeout(() => {
    starsContainer.classList.add('warp-speed');
  }, 300);

  // 用 overlay 做柔和閃光過渡 (不改 body background，避免生硬切換)
  // 階段 1: 從透明漸變到半透明白 (像光芒擴散)
  gsap.to(flashOverlay, {
    opacity: 0.7,
    background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(200,180,255,0.4) 50%, transparent 80%)',
    duration: 0.4,
    delay: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      // 階段 2: 白光退去，帶一絲暖粉色
      gsap.to(flashOverlay, {
        opacity: 0.3,
        background: 'radial-gradient(circle, rgba(255,200,220,0.6) 0%, rgba(150,100,200,0.2) 50%, transparent 80%)',
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          // 階段 3: 完全淡出
          gsap.to(flashOverlay, {
            opacity: 0,
            duration: 0.8,
            ease: 'power1.out'
          });
        }
      });
    }
  });

  // 場景切換：scene1 淡出 + scene2 淡入 有重疊，避免黑屏
  tl.to(scene1, {
    opacity: 0,
    duration: 0.8,
    delay: 0.8,
    ease: 'power2.inOut',
    onStart: () => {
      // 在 scene1 還沒完全消失時就開始顯示 scene2
      scene2.classList.add('active');
      gsap.fromTo(scene2, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.inOut'
      });
    },
    onComplete: () => {
      scene1.classList.remove('active');
      // 重新生成星星背景 (warp 結束後星星已消失)
      regenerateStars();
      enableIntenseShootingStars();
    }
  })
    .add(() => {
      animateLetterContent();
    }, '-=0.4'); // 信件動畫提前開始，銜接更順
}

/**
 * Warp 結束後重新生成新的星星，淡入顯示
 */
function regenerateStars() {
  starsContainer.classList.remove('warp-speed');
  // 清除舊星星
  starsContainer.innerHTML = '';
  // 重新生成
  createStars();
  // 淡入
  gsap.fromTo(starsContainer, { opacity: 0 }, {
    opacity: 1,
    duration: 1.5,
    ease: 'power1.inOut'
  });
}

/**
 * 信件內容 - 流星滑入動畫
 */
function animateLetterContent() {
  const tl = gsap.timeline();

  letterLines.forEach((line, index) => {
    gsap.set(line, {
      opacity: 0,
      x: 80,
      y: -20
    });

    tl.to(line, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      onStart: () => {
        line.style.textShadow = '15px -8px 15px rgba(200, 180, 255, 0.6), 30px -15px 25px rgba(150, 130, 220, 0.3)';
      },
      onComplete: () => {
        gsap.to(line, {
          textShadow: '0 2px 15px rgba(180, 160, 255, 0.6)',
          duration: 0.4
        });
      }
    }, index * 0.35);
  });

  gsap.set(heartsDecoration, {
    opacity: 0,
    x: 40,
    y: -15
  });

  tl.to(heartsDecoration, {
    opacity: 1,
    x: 0,
    y: 0,
    duration: 0.5,
    ease: 'power2.out'
  }, '-=0.2');
}

/**
 * 主要點擊事件處理
 */
function handleHeartClick() {
  if (isAnimating) return;
  isAnimating = true;

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
