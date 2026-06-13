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
