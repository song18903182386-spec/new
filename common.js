// 星空画布
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let meteors = [];
let w, h;
let lastTime = 0;
const FPS = 60;
const interval = 1000 / FPS;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    createStars();
}
window.addEventListener('resize', resize);
resize();

function createStars() {
    stars = [];
    for(let i = 0; i < 220; i++) {
        stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.5 + 0.3,
            v: Math.random() * 0.2 + 0.04
        });
    }
}

function createMeteor() {
    if(meteors.length < 3) {
        meteors.push({
            x: Math.random() * w,
            y: 0,
            len: Math.random() * 80 + 50,
            vx: Math.random() * 6 + 4,
            vy: Math.random() * 4 + 3,
            op: 1
        });
    }
}
setInterval(createMeteor, 2000);

function drawStars(timestamp) {
    requestAnimationFrame(drawStars);
    if (timestamp - lastTime < interval) return;
    lastTime = timestamp;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
        star.y += star.v;
        if(star.y > h) {
            star.y = 0;
            star.x = Math.random() * w;
        }
    });

    ctx.strokeStyle = 'rgba(167, 139, 250, 1)';
    ctx.lineWidth = 2;
    meteors.forEach((meteor, index) => {
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - meteor.len, meteor.y - meteor.len);
        ctx.stroke();
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.op -= 0.01;
        if(meteor.y > h || meteor.op <= 0) {
            meteors.splice(index, 1);
        }
    });
}
drawStars(0);

// 北京时间
function updateBeijingTime() {
    const now = new Date();
    const options = {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const timeString = now.toLocaleString('zh-CN', options);
    const timeDom = document.getElementById('beijing-time');
    if(timeDom) timeDom.innerHTML = `🛰️ 中国标准时间 CST<br>${timeString}`;
}
updateBeijingTime();
setInterval(updateBeijingTime, 1000);

// 主题切换
const toggleBtn = document.getElementById('toggleTheme');
const root = document.documentElement;
function setTheme(theme) {
  if (theme === 'blue') {
    root.style.setProperty('--main-color', '#60a5fa');
    root.style.setProperty('--light-color', '#93c5fd');
    root.style.setProperty('--bg-dark', '#0f172a');
    root.style.setProperty('--text-main', '#f1f5f9');
    root.style.setProperty('--text-gray', '#94a3b8');
    root.style.setProperty('--card-bg', 'rgba(255,255,255,0.05)');
    root.style.setProperty('--section-bg', 'rgba(255,255,255,0.03)');
  } else {
    root.style.setProperty('--main-color', '#a78bfa');
    root.style.setProperty('--light-color', '#c4b5fd');
    root.style.setProperty('--bg-dark', '#0f0f1e');
    root.style.setProperty('--text-main', '#f5f3ff');
    root.style.setProperty('--text-gray', '#a8a29e');
    root.style.setProperty('--card-bg', 'rgba(255,255,255,0.07)');
    root.style.setProperty('--section-bg', 'rgba(255,255,255,0.04)');
  }
}
setTheme(localStorage.getItem('theme') || 'purple');
if(toggleBtn){
    toggleBtn.addEventListener('click', () => {
      const t = localStorage.getItem('theme') === 'blue' ? 'purple' : 'blue';
      localStorage.setItem('theme', t);
      setTheme(t);
    });
}

// 背景音乐控制
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
if(bgMusic && musicBtn){
    musicBtn.addEventListener('click', function() {
        if (bgMusic.paused) {
            bgMusic.play();
            musicBtn.textContent = "暂停音乐";
        } else {
            bgMusic.pause();
            musicBtn.textContent = "播放音乐";
        }
    });
}
