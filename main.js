import gsap from 'gsap';

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

// State
let isAnimating = false;

/**
 * 生成愛心形狀的星星
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
 * 生成隨機星星背景
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

  shootingStar.style.left = `${30 + Math.random() * 60}%`;
  shootingStar.style.top = `${5 + Math.random() * 35}%`;

  shootingStarsContainer.appendChild(shootingStar);

  setTimeout(() => {
    shootingStar.remove();
  }, 1200);
}

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

function enableIntenseShootingStars() {
  shootingStarIntense = true;
  for (let i = 0; i < 3; i++) {
    setTimeout(() => createShootingStar(), i * 300);
  }
}

/**
 * 星空隧道效果 - 持續從中心生成星星往外飛，模擬穿越銀河
 * 用 canvas 繪製避免 DOM 操作的 lag
 */
function startWarpTunnel(duration, onComplete) {
  const canvas = document.createElement('canvas');
  canvas.id = 'warp-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const cx = w / 2;
  const cy = h / 2;

  // 星星粒子池
  const particles = [];
  const colors = [
    'rgba(255,255,255,', 'rgba(255,255,255,', 'rgba(255,255,255,',
    'rgba(200,200,255,', 'rgba(0,255,255,', 'rgba(255,102,255,', 'rgba(255,215,0,'
  ];

  function spawnStar() {
    // 從中心附近生成，帶隨機角度
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 3;
    return {
      x: cx + (Math.random() - 0.5) * 20,
      y: cy + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 0.3 + Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      trail: []
    };
  }

  // 預先填一些星星在各種距離，避免開場空白
  for (let i = 0; i < 80; i++) {
    const p = spawnStar();
    const age = Math.random() * 60;
    for (let j = 0; j < age; j++) {
      p.vx *= 1.025;
      p.vy *= 1.025;
      p.x += p.vx;
      p.y += p.vy;
      p.size += 0.015;
      p.life++;
    }
    if (p.x > -50 && p.x < w + 50 && p.y > -50 && p.y < h + 50) {
      particles.push(p);
    }
  }

  const startTime = Date.now();
  let running = true;

  // 加速感：隨時間增加速度倍率
  function getSpeedMultiplier(elapsed) {
    const progress = elapsed / duration;
    // 先慢後快，最後減速 (像太空船加速再減速)
    if (progress < 0.3) return 1 + progress * 4;        // 加速期
    if (progress < 0.7) return 2.2 + (progress - 0.3) * 3; // 巡航加速
    return 3.4 * (1 - (progress - 0.7) / 0.3 * 0.5);   // 減速期
  }

  function frame() {
    if (!running) return;

    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      // 淡出 canvas
      gsap.to(canvas, {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          canvas.remove();
          if (onComplete) onComplete();
        }
      });
      return;
    }

    const speedMul = getSpeedMultiplier(elapsed);
    const progress = elapsed / duration;

    ctx.clearRect(0, 0, w, h);

    // 每幀生成新星星 (數量隨速度增加)
    const spawnCount = Math.floor(2 + speedMul * 1.5);
    for (let i = 0; i < spawnCount; i++) {
      particles.push(spawnStar());
    }

    // 更新與繪製
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // 加速：離中心越遠飛越快 (透視加速)
      p.vx *= 1.02 + speedMul * 0.008;
      p.vy *= 1.02 + speedMul * 0.008;
      p.x += p.vx * speedMul;
      p.y += p.vy * speedMul;
      p.size += 0.02 * speedMul;
      p.life++;

      // 儲存軌跡點 (光軌效果)
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 6) p.trail.shift();

      // 出界移除
      if (p.x < -100 || p.x > w + 100 || p.y < -100 || p.y > h + 100) {
        particles.splice(i, 1);
        continue;
      }

      // 根據離中心距離計算亮度 (近=暗小, 遠=亮大)
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const alpha = Math.min(1, dist / 200);

      // 畫光軌
      if (p.trail.length > 1 && dist > 30) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let j = 1; j < p.trail.length; j++) {
          ctx.lineTo(p.trail[j].x, p.trail[j].y);
        }
        ctx.strokeStyle = p.color + (alpha * 0.3) + ')';
        ctx.lineWidth = p.size * 0.5;
        ctx.stroke();
      }

      // 畫星星本體
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.fill();

      // 光暈
      if (p.size > 1.5) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (alpha * 0.15) + ')';
        ctx.fill();
      }
    }

    // 中心光暈 (前進的聚焦點)
    const glowAlpha = 0.08 + speedMul * 0.03;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
    gradient.addColorStop(0, `rgba(200, 180, 255, ${glowAlpha})`);
    gradient.addColorStop(0.5, `rgba(100, 80, 200, ${glowAlpha * 0.3})`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(cx - 120, cy - 120, 240, 240);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

  return {
    stop: () => { running = false; }
  };
}

/**
 * 場景轉換
 */
function transitionToLetter() {
  // 停止心跳動畫
  starHeart.style.animation = 'none';

  // 觸發愛心爆炸
  starHeart.classList.add('exploding');

  // 螢幕震動
  setTimeout(() => {
    scene1.classList.add('shaking');
  }, 150);

  // 短暫延遲後，淡出原本的靜態星星
  setTimeout(() => {
    gsap.to(starsContainer, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in'
    });
  }, 200);

  // 愛心爆炸後 0.5s，啟動星空隧道
  setTimeout(() => {
    // 淡出 scene1 的提示文字等 UI
    gsap.to(scene1, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in'
    });

    // 啟動星空隧道穿越效果 (持續 2.5 秒)
    startWarpTunnel(2500, () => {
      // 隧道結束後：顯示信件
      showLetterScene();
    });
  }, 500);

  // 隧道進行中，1.5s 後開始柔和的閃光過渡 (準備切場)
  setTimeout(() => {
    gsap.to(flashOverlay, {
      opacity: 0.6,
      background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(200,180,255,0.3) 50%, transparent 80%)',
      duration: 0.8,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(flashOverlay, {
          opacity: 0.2,
          background: 'radial-gradient(circle, rgba(255,200,220,0.5) 0%, rgba(150,100,200,0.15) 50%, transparent 80%)',
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(flashOverlay, {
              opacity: 0,
              duration: 1,
              ease: 'power1.out'
            });
          }
        });
      }
    });
  }, 2200);
}

/**
 * 隧道結束後顯示信件場景 - 星星變卡片轉場動畫
 */
function showLetterScene() {
  scene1.classList.remove('active');

  // 重新生成靜態星空背景
  starsContainer.innerHTML = '';
  createStars();
  gsap.fromTo(starsContainer, { opacity: 0 }, {
    opacity: 1,
    duration: 1.5,
    ease: 'power1.inOut'
  });

  enableIntenseShootingStars();

  // 準備 scene2（先設為透明，取得 letter-content 尺寸用）
  gsap.set(scene2, { opacity: 0 });
  scene2.classList.add('active');

  // 等星空淡入一段時間後，開始星星變卡片動畫
  setTimeout(() => {
    startFocusStarAnimation();
  }, 500);
}

/**
 * 星星變卡片的動畫流程
 */
function startFocusStarAnimation() {
  // 動態建立 focus-star
  const focusStar = document.createElement('div');
  focusStar.className = 'focus-star';

  // 隨機位置（偏中間區域）
  const startX = 30 + Math.random() * 40; // 30%~70% 的範圍
  const startY = 20 + Math.random() * 30; // 20%~50% 的範圍
  focusStar.style.left = `${startX}vw`;
  focusStar.style.top = `${startY}vh`;

  document.body.appendChild(focusStar);

  // 取得 letter-content 的實際尺寸和位置
  const letterContent = document.querySelector('.letter-content');
  const letterRect = letterContent.getBoundingClientRect();

  // 計算畫面中央位置
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // GSAP Timeline 串聯所有階段
  const tl = gsap.timeline();

  // Phase 1 (1s)：focus-star 開始閃爍發光、微微放大，周圍星星亮度降低
  tl.to(focusStar, {
    scale: 2.5,
    boxShadow: '0 0 20px 8px rgba(200, 180, 255, 1), 0 0 40px 16px rgba(180, 160, 255, 0.5)',
    duration: 1,
    ease: 'power1.inOut',
    repeat: 1,
    yoyo: true,
    repeatDelay: 0,
  }, 0);

  // Phase 1 同步：其他星星變暗
  tl.to(starsContainer, {
    opacity: 0.3,
    duration: 1,
    ease: 'power2.inOut'
  }, 0);

  // Phase 2 (1s)：focus-star 移動到畫面正中央 + 持續放大
  tl.to(focusStar, {
    left: centerX,
    top: centerY,
    xPercent: -50,
    yPercent: -50,
    scale: 4,
    boxShadow: '0 0 30px 12px rgba(200, 180, 255, 1), 0 0 60px 24px rgba(180, 160, 255, 0.6)',
    duration: 1,
    ease: 'power2.inOut',
  }, 1.2);

  // Phase 2 同步：星星逐漸恢復亮度
  tl.to(starsContainer, {
    opacity: 0.7,
    duration: 1.5,
    ease: 'power1.inOut'
  }, 1.5);

  // Phase 3 (1.2s)：focus-star 從圓形變成卡片形狀
  tl.to(focusStar, {
    width: letterRect.width,
    height: letterRect.height,
    left: letterRect.left + letterRect.width / 2,
    top: letterRect.top + letterRect.height / 2,
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 30px 10px rgba(180, 160, 255, 0.3), 0 0 60px 20px rgba(150, 130, 220, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    scale: 1,
    duration: 1.2,
    ease: 'power2.inOut',
  }, 2.4);

  // Phase 3 同步：星星恢復完全亮度
  tl.to(starsContainer, {
    opacity: 1,
    duration: 0.8,
    ease: 'power1.inOut'
  }, 2.8);

  // Phase 4：移除 focus-star，顯示真正的 scene2，觸發內容動畫
  tl.to(focusStar, {
    opacity: 0,
    duration: 0.4,
    ease: 'power1.inOut',
  }, 3.8);

  tl.to(scene2, {
    opacity: 1,
    duration: 0.4,
    ease: 'power1.inOut',
  }, 3.8);

  tl.add(() => {
    focusStar.remove();
    animateLetterContent();
  }, 4.2);
}

/**
 * 信件內容動畫
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

  transitionToLetter();
}

// 初始化
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
