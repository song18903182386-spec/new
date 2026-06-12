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
  const root = document.documentElement;
  const starDom = document.getElementById("starfield");
  const btnDom = document.getElementById("toggleTheme");

  if (theme === "blue") {
    /* B主题：纯黑冷蓝 粗黑体硬核风 */
    root.style.setProperty("--font-title", "system-ui, -apple-system, Microsoft YaHei, sans-serif");
    root.style.setProperty("--font-text", "system-ui, -apple-system, Microsoft YaHei, sans-serif");
    root.style.setProperty("--main", "#38bdf8");
    root.style.setProperty("--light", "#bae6fd");
    root.style.setProperty("--bg-page", "#030712");
    root.style.setProperty("--star-bg", "linear-gradient(160deg, #000000 0%, #030712 60%, #050c1f 100%)");
    root.style.setProperty("--text-normal", "#f0f9ff");
    root.style.setProperty("--text-gray", "#94a3b8");
    root.style.setProperty("--card-alpha", "rgba(255,255,255,0.04)");
    root.style.setProperty("--block-alpha", "rgba(255,255,255,0.02)");
    root.style.setProperty("--glow", "rgba(56,189,248,0.6)");
    root.style.setProperty("--grad1", "rgba(56,189,248,0.22)");
    root.style.setProperty("--grad2", "rgba(129,140,248,0.08)");
    root.style.setProperty("--meteor-color", "#bae6fd");
    root.style.setProperty("--btn-color", "#38bdf8");

    if (starDom) starDom.style.background = root.getPropertyValue("--star-bg");
    if (btnDom) btnDom.style.background = root.getPropertyValue("--btn-color");
  } else {
    /* A主题：默认紫调宋体文艺风 */
    root.style.setProperty("--font-title", "SimSun, STSong, serif");
    root.style.setProperty("--font-text", "SimSun, STSong, serif");
    root.style.setProperty("--main", "#a78bfa");
    root.style.setProperty("--light", "#e9d5ff");
    root.style.setProperty("--bg-page", "#0f0f1e");
    root.style.setProperty("--star-bg", "linear-gradient(160deg, #070714 0%, #0f0f1e 50%, #181833 100%)");
    root.style.setProperty("--text-normal", "#f5f3ff");
    root.style.setProperty("--text-gray", "#c4b5fd");
    root.style.setProperty("--card-alpha", "rgba(255,255,255,0.09)");
    root.style.setProperty("--block-alpha", "rgba(255,255,255,0.05)");
    root.style.setProperty("--glow", "rgba(167,139,250,0.75)");
    root.style.setProperty("--grad1", "rgba(167,139,250,0.28)");
    root.style.setProperty("--grad2", "rgba(129,140,248,0.15)");
    root.style.setProperty("--meteor-color", "#e9d5ff");
    root.style.setProperty("--btn-color", "#a78bfa");

    if (starDom) starDom.style.background = root.getPropertyValue("--star-bg");
    if (btnDom) btnDom.style.background = root.getPropertyValue("--btn-color");
  }
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
