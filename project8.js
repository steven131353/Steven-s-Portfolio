// project8.js
// 9 canvases on one page (instance mode)

const N = 9;

// 你可以在这里统一控制每个 canvas 的尺寸
const W = 260;
const H = 180;

for (let i = 1; i <= N; i++) {
  makeSketch(`sketch-${i}`, i);
}

function makeSketch(parentId, index) {
  new p5((p) => {
    let t = 0;

    p.setup = () => {
      const c = p.createCanvas(W, H);
      c.parent(parentId);

      // 可选：让每个格子有不同随机种子
      p.randomSeed(index * 999);
      p.noStroke();
    };

    p.draw = () => {
      // 给每个 canvas 一个“轻微不同”的动态
      p.background(15);

      // index 控制不同速度/图案
      const speed = 0.01 + index * 0.002;
      t += speed;

      // 示例：简单的弹跳圆 + 文字编号
      const x = (p.sin(t * (1 + index * 0.05)) * 0.5 + 0.5) * p.width;
      const y = (p.cos(t * (1 + index * 0.04)) * 0.5 + 0.5) * p.height;

      const r = 18 + 6 * p.sin(t * 2.0);

      p.fill(75, 15, 255); // 你也可以改成黑白/更克制
      p.circle(x, y, r * 2);

      p.fill(255);
      p.textAlign(p.LEFT, p.TOP);
      p.textSize(12);
      p.text(`#${index}`, 10, 10);
    };

    // 可选：每个 canvas 自己响应鼠标（注意：mouseX/mouseY 是相对该 canvas）
    p.mouseMoved = () => {
      // 例如：悬停时加亮边框（用背景/元素表达）
    };
  });
}