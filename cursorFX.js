// cursorFX.js — lagging dot that settles onto the cursor (with slight visual offset)
// + DISCOVER label on interactive hover

const fx = document.createElement("div");
fx.className = "cursor-fx";
fx.innerHTML = `
  <div class="cursor-fx__dot"></div>
  <div class="cursor-fx__label">DISCOVER</div>
`;
document.body.appendChild(fx);

// target (real cursor position)
let tx = 0, ty = 0;
// current dot position
let x = 0, y = 0;

let started = false;

// ✅ 小一点 = 更明显滞后（0.10~0.22 都可以）
const EASE = 0.05;

// ✅ 
const VISUAL_OFFSET_X = -6;
const VISUAL_OFFSET_Y = -6;

window.addEventListener("mousemove", (e) => {
  tx = e.clientX;
  ty = e.clientY;

  // 第一次移动时，让点从鼠标位置出现（避免从(0,0)飞过来）
  if (!started) {
    x = tx;
    y = ty;
    started = true;
  }
});

function loop() {
  // 只有开始后才更新（避免一开始在左上角乱跑）
  if (started) {
    x += (tx - x) * EASE;
    y += (ty - y) * EASE;

    fx.style.transform = `translate3d(${x + VISUAL_OFFSET_X}px, ${y + VISUAL_OFFSET_Y}px, 0)`;
  }

  requestAnimationFrame(loop);
}
loop();

// interactive hover -> show label
const INTERACTIVE_SELECTOR =
  '.project-main, .project-external, a, button, input, textarea, select, [role="button"]';

document.addEventListener("mouseover", (e) => {
  if (e.target.closest(INTERACTIVE_SELECTOR)) fx.classList.add("is-active");
});

document.addEventListener("mouseout", (e) => {
  if (e.target.closest(INTERACTIVE_SELECTOR)) fx.classList.remove("is-active");
});
