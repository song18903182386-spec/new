const root = document.documentElement;
const canvas = document.getElementById('starfield');
const ctx = canvas?.getContext('2d');
let stars = [];
let meteors = [];
let w, h;
let lastTime = 0;
const FPS = 60;
const interval = 1000 / FPS;

function resize() {
    if(!canvas) return;
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
setInterval(()=>{
    if(meteors.length < 3) {
        meteors.push({
            x: Math.random() * w,
            y: 0,
            len: Math.random() * 80 + 50,
            vx: Math.random() * 2 + 2,
            vy: Math.random() * 2 + 3,
            op: 1
        });
    }
}, 2000);

function drawStars(timestamp) {
    requestAnimationFrame(drawStars);
    if (timestamp - lastTime < interval || !ctx) return;
    lastTime = timestamp;
    ctx.clearRect(0, 0, w, h);
    const meteorColor = getComputedStyle(root).getPropertyValue('--meteor-color').trim();
    ctx.fillStyle = "#fff";
    stars.forEach(s=>{
        ctx.beginPath();
        ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fill();
        s.y += s.v;
        if(s.y>h){s.y=0;s.x=Math.random()*w;}
    })
    ctx.strokeStyle = meteorColor;
    ctx.lineWidth = 2;
    meteors.forEach((m,i)=>{
        ctx.beginPath();
        ctx.moveTo(m.x,m.y);
        ctx.lineTo(m.x - m.len, m.y + m.len);
        ctx.globalAlpha = m.op;
        ctx.stroke();
        ctx.globalAlpha = 1;
        m.x += m.vx;
        m.y += m.vy;
        m.op -= 0.008;
        if(m.op<=0||m.y>h) meteors.splice(i,1);
    })
}
drawStars(0);

function updateBeijingTime(){
    const dom = document.getElementById('beijing-time');
    if(!dom) return;
    const now = new Date();
    const opt = {timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',weekday:'long',hour:'2-digit',minute:'2-digit',second:'2-digit'};
    dom.innerHTML = `🛰️ 中国标准时间 CST<br>${now.toLocaleString('zh-CN',opt)}`;
}
updateBeijingTime();
setInterval(updateBeijingTime,1000);

// 切换核心函数
function setTheme(theme){
    const starDom = document.getElementById('starfield');
    const btn = document.getElementById('toggleTheme');
    if(theme === 'blue'){
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
        if(starDom) starDom.style.background = root.getPropertyValue("--star-bg");
        if(btn) btn.style.background = root.getPropertyValue("--btn-color");
    }else{
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
        if(starDom) starDom.style.background = root.getPropertyValue("--star-bg");
        if(btn) btn.style.background = root.getPropertyValue("--btn-color");
    }
}

// 页面加载完成自动初始化+绑定按钮点击
window.addEventListener('DOMContentLoaded', function(){
    // 读取保存主题
    let saved = localStorage.getItem('theme');
    if(saved !== 'blue') saved = 'purple';
    setTheme(saved);

    // 自动绑定按钮点击，所有页面共用，不用改html
    const toggleBtn = document.getElementById('toggleTheme');
    if(toggleBtn){
        toggleBtn.addEventListener('click', function(){
            let now = localStorage.getItem('theme');
            let next = now === 'blue' ? 'purple' : 'blue';
            localStorage.setItem('theme', next);
            setTheme(next);
            console.log('切换成功', next);
        })
    }
})

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
