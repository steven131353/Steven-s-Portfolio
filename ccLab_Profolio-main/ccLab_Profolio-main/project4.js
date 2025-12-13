function setup() {
  createCanvas(400, 600);
  angleMode(DEGREES);
  noLoop();
}

function draw() {
  drawBackground();

  // 统一的线条风格
  stroke(20);
  strokeJoin(ROUND);
  strokeCap(ROUND);

  // 角色主色（你可以改成自己想要的）
  const ink = color(20);
  const cloth = color(35);          // 身体填充
  const accent = color(200, 40, 60); // 点缀色（腰带/小细节）
  const shadow = color(0, 20);      // 透明阴影

  // 头
  drawHead(200, 130, 0.78, ink);

  // 身体底层（先画填充再画线）
  drawBodySilhouette(cloth, ink);

  // 腰带（用 accent + 轻微透明）
  drawBeltStyled(270, 400, 170, 230, 18, accent, ink);

  // 身体内部线条 / 装饰
  drawTorso(200, 220, ink);

  // 手臂线条（用稍粗 + 轻微阴影）
  drawArms(ink, shadow);

  // 腿与鞋（加鞋底厚度）
  drawLegsAndShoes(ink, shadow);
}

/* ---------- 背景：柔和渐变 + 纸纹 ---------- */
function drawBackground() {
  // 渐变
  for (let y = 0; y < height; y++) {
    const t = y / height;
    const c = lerpColor(color(250), color(238), t);
    stroke(c);
    line(0, y, width, y);
  }

  // 纸纹
  noStroke();
  for (let i = 0; i < 2500; i++) {
    fill(0, random(6, 14));
    circle(random(width), random(height), random(0.5, 1.3));
  }

  // 轻微聚光
  noStroke();
  for (let r = 260; r > 0; r -= 6) {
    fill(255, map(r, 260, 0, 0, 30));
    circle(width / 2, 180, r * 2);
  }
}

/* ---------- 头（加线条层次 + 小高光） ---------- */
function drawHead(x, y, s, ink) {
  push();
  translate(x, y);
  scale(s);

  // 外轮廓
  noFill();
  stroke(ink);
  strokeWeight(6);
  beginShape();
  vertex(-40, 40);
  bezierVertex(-60, -30, 60, -30, 40, 40);
  bezierVertex(60, 80, -60, 80, -40, 40);
  endShape(CLOSE);

  // 内部“面罩”
  noStroke();
  fill(0);
  beginShape();
  vertex(-25, 35);
  bezierVertex(-35, 0, 35, 0, 25, 35);
  bezierVertex(30, 55, -30, 55, -25, 35);
  endShape(CLOSE);

  // 高光（让黑块更有体积）
  fill(255, 45);
  ellipse(-8, 18, 18, 10);

  // 下巴阴影
  fill(0, 40);
  ellipse(0, 52, 70, 25);

  pop();
}

/* ---------- 身体外形：先填充，再描边，显得更“完整” ---------- */
function drawBodySilhouette(cloth, ink) {
  // 轻阴影（身体投影）
  noStroke();
  fill(0, 18);
  beginShape();
  vertex(126 + 6, 318 + 8);
  vertex(180 + 6, 415 + 8);
  vertex(233 + 6, 414 + 8);
  vertex(273 + 6, 333 + 8);
  vertex(282 + 6, 221 + 8);
  vertex(243 + 6, 185 + 8);
  vertex(155 + 6, 185 + 8);
  vertex(120 + 6, 250 + 8);
  endShape(CLOSE);

  // 身体填充
  fill(cloth);
  stroke(ink);
  strokeWeight(3.5);
  beginShape();
  vertex(120, 250);
  vertex(155, 185);
  vertex(243, 185);
  vertex(282, 221);
  vertex(273, 333);
  vertex(233, 414);
  vertex(180, 415);
  vertex(126, 318);
  endShape(CLOSE);

  // 轻微高光（左上）
  noStroke();
  fill(255, 22);
  beginShape();
  vertex(135, 250);
  vertex(162, 200);
  vertex(215, 195);
  vertex(215, 255);
  vertex(175, 320);
  vertex(140, 300);
  endShape(CLOSE);
}

/* ---------- 躯干线条：保持你原本逻辑，但统一位置更自然 ---------- */
function drawTorso(cx, cy, ink) {
  stroke(ink);
  strokeWeight(2.5);
  noFill();

  // 肩线
  beginShape();
  vertex(cx - 42, cy - 42);
  vertex(cx, cy);
  vertex(cx + 42, cy - 42);
  endShape();

  // 胸前小三角（更精致一点）
  fill(0);
  triangle(cx - 10, cy + 2, cx + 10, cy + 2, cx, cy + 30);
  noFill();

  // 内部线条（用更淡的透明）
  stroke(ink);
  strokeWeight(1.2);
  for (let i = 0; i < 5; i++) {
    let x = 180 + i * 10;
    stroke(20, 140);
    line(x, 250, 200 + (i - 2) * 4, 400);
  }
}

/* ---------- 腰带：颜色 + 深浅交替 ---------- */
function drawBeltStyled(yStart, yEnd, xL, xR, gap, accent, ink) {
  for (let y = yStart; y <= yEnd; y += gap) {
    // 交替深浅，增加节奏
    const alpha = (floor((y - yStart) / gap) % 2 === 0) ? 190 : 120;
    stroke(red(accent), green(accent), blue(accent), alpha);
    strokeWeight(2.2);
    line(xL, y, xR, y);
  }

  // 腰带扣
  noFill();
  stroke(ink);
  strokeWeight(2);
  rectMode(CENTER);
  rect((xL + xR) / 2, yStart + 15, 26, 18, 4);
}

/* ---------- 手臂：你的线条结构 + 阴影描边 ---------- */
function drawArms(ink, shadow) {
  // 阴影先画（偏移一点）
  stroke(shadow);
  strokeWeight(10);
  drawLine(140 + 3, 220 + 3, 110 + 3, 270 + 3);
  drawLine(110 + 3, 270 + 3, 130 + 3, 320 + 3);
  drawLine(140 + 3, 280 + 3, 110 + 3, 330 + 3);
  drawLine(110 + 3, 330 + 3, 130 + 3, 370 + 3);

  drawLine(260 + 3, 220 + 3, 290 + 3, 270 + 3);
  drawLine(290 + 3, 270 + 3, 270 + 3, 320 + 3);
  drawLine(260 + 3, 270 + 3, 290 + 3, 310 + 3);
  drawLine(290 + 3, 310 + 3, 270 + 3, 380 + 3);

  // 主线
  stroke(ink);
  strokeWeight(8);
  drawLine(140, 220, 110, 270);
  drawLine(110, 270, 130, 320);
  drawLine(140, 280, 110, 330);
  drawLine(110, 330, 130, 370);

  drawLine(260, 220, 290, 270);
  drawLine(290, 270, 270, 320);
  drawLine(260, 270, 290, 310);
  drawLine(290, 310, 270, 380);
}

/* ---------- 腿和鞋：加鞋底厚度+阴影 ---------- */
function drawLegsAndShoes(ink, shadow) {
  // 腿阴影
  stroke(shadow);
  strokeWeight(5);
  drawLine(170 + 2, 400 + 2, 170 + 2, 500 + 2);
  drawLine(180 + 2, 400 + 2, 175 + 2, 500 + 2);
  drawLine(230 + 2, 400 + 2, 230 + 2, 500 + 2);
  drawLine(220 + 2, 400 + 2, 225 + 2, 500 + 2);

  // 腿主线
  stroke(ink);
  strokeWeight(3);
  drawLine(170, 400, 170, 500);
  drawLine(180, 400, 175, 500);

  // 左鞋（填充 + 描边）
  fill(0);
  stroke(ink);
  strokeWeight(2);
  drawPolygon([
    [170, 500], [160, 510], [165, 520], [175, 525],
    [180, 515], [185, 520], [190, 510], [175, 500]
  ]);
  // 鞋底厚度
  noStroke();
  fill(0, 80);
  rect(175, 527, 38, 6, 3);

  // 右腿
  stroke(ink);
  strokeWeight(3);
  drawLine(230, 400, 230, 500);
  drawLine(220, 400, 225, 500);

  // 右鞋
  fill(0);
  stroke(ink);
  strokeWeight(2);
  drawPolygon([
    [225, 500], [220, 510], [225, 520], [230, 515],
    [235, 525], [240, 515], [245, 520], [250, 510], [230, 500]
  ]);
  noStroke();
  fill(0, 80);
  rect(235, 527, 40, 6, 3);
}

/* ---------- 工具函数 ---------- */
function drawLine(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
}

function drawPolygon(pts) {
  beginShape();
  pts.forEach(p => vertex(p[0], p[1]));
  endShape(CLOSE);
}
