import gsap from 'gsap';
import confetti from 'canvas-confetti';

// DOM Elements
const giftBox = document.getElementById('giftBox');
const giftContainer = document.querySelector('.gift-container');
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
 * 生成隨機星星背景
 */
function createStars() {
  const starCount = 150;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    // 隨機大小
    const sizeClass = Math.random() < 0.6 ? 'small' : Math.random() < 0.85 ? 'medium' : 'large';
    star.classList.add(sizeClass);

    // 隨機位置
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;

    // 隨機閃爍時間和延遲
    star.style.setProperty('--twinkle-duration', `${2 + Math.random() * 4}s`);
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

  // 隨機起始位置（畫面上方和左側）
  shootingStar.style.left = `${Math.random() * 70}%`;
  shootingStar.style.top = `${Math.random() * 30}%`;

  shootingStarsContainer.appendChild(shootingStar);

  // 動畫結束後移除
  setTimeout(() => {
    shootingStar.remove();
  }, 1500);
}

/**
 * 定期產生流星
 */
function startShootingStars() {
  // 隨機間隔產生流星
  const scheduleNext = () => {
    const delay = 3000 + Math.random() * 5000; // 3-8秒間隔
    setTimeout(() => {
      createShootingStar();
      scheduleNext();
    }, delay);
  };
  scheduleNext();
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
 * 場景轉換：從禮物盒到信件
 */
function transitionToLetter() {
  const tl = gsap.timeline();

  // 禮物盒打開動畫
  giftBox.classList.add('opened');

  // 等待禮物盒動畫完成後轉換場景
  tl.to(scene1, {
    opacity: 0,
    duration: 0.8,
    delay: 0.8,
    onComplete: () => {
      scene1.classList.remove('active');
      scene2.classList.add('active');
      document.body.classList.add('dark-mode');
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
 * 信件內容逐行淡入動畫
 */
function animateLetterContent() {
  const tl = gsap.timeline();

  // 逐行淡入
  letterLines.forEach((line, index) => {
    tl.to(line, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, index * 0.3); // 每行間隔 0.3 秒
  });

  // 最後顯示愛心裝飾
  tl.to(heartsDecoration, {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.out'
  }, '-=0.3');
}

/**
 * 主要點擊事件處理
 */
function handleGiftClick() {
  if (isAnimating) return;
  isAnimating = true;

  // 同時觸發 confetti 和場景轉換
  triggerConfetti();
  transitionToLetter();
}

// 初始化星空背景
createStars();
startShootingStars();

// 事件綁定
giftContainer.addEventListener('click', handleGiftClick);
giftContainer.addEventListener('touchend', (e) => {
  e.preventDefault();
  handleGiftClick();
});

// 初始動畫：禮物盒入場
gsap.from(giftBox, {
  scale: 0,
  rotation: -10,
  duration: 0.8,
  ease: 'back.out(1.7)',
  delay: 0.3
});

gsap.from('.hint-text', {
  opacity: 0,
  y: 20,
  duration: 0.5,
  delay: 1
});
