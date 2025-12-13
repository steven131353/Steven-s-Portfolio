let scene = -1;
let player;
let maze;
let goal;

let timerStart = 0;
let darkness = 0;

const TOP_PAD = 60;

const CS = 20;
const COLS = 30;
const ROWS = 17;

const MAZE_CONFIGS = [
  { seed: 11, bias: "none" },
  { seed: 7777, bias: "horizontal" },
  { seed: 2024, bias: "vertical" }
];

function setup() {
  createCanvas(600, 400);
  textFont("monospace");
}

function draw() {
  if (scene === -1) drawStartScreen();
  else if (scene >= 0 && scene <= 2) drawGameScene();
}

function keyPressed() {
  if (scene >= 0 && scene <= 2 && (key === "r" || key === "R")) initScene(scene);
}

function drawStartScreen() {
  background(30);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(28);
  text("Finding My Way", width / 2, 70);

  fill(210);
  textSize(14);
  text("Arrow keys to move. Reach the goal. Press R to restart.", width / 2, 105);
  text("A small maze game about feeling lost, rushed, and unsure.", width / 2, 125);

  drawStudent(width / 2 - 35, 150, 2.5);

  let btnW = 200, btnH = 45;
  let btnX = width / 2 - btnW / 2;
  let btnY = 305;

  fill(50);
  rect(btnX, btnY, btnW, btnH, 10);

  fill(255, 200, 80);
  textSize(18);
  text("Start Game", width / 2, btnY + btnH / 2);
}

function mousePressed() {
  if (scene === -1) {
    let btnW = 200, btnH = 45;
    let btnX = width / 2 - btnW / 2;
    let btnY = 305;
    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
      scene = 0;
      initScene(scene);
    }
  }
}

function initScene(s) {
  const cfg = MAZE_CONFIGS[s];
  randomSeed(cfg.seed);

  maze = new Maze(COLS, ROWS, CS, cfg.bias, TOP_PAD);
  maze.generate();

  player = new Player((1 * CS) + 2, TOP_PAD + ((ROWS - 2) * CS) + 2, 16, 2.8);
  goal = new Goal((COLS - 2) * CS, TOP_PAD + (1 * CS), 18);

  if (s === 1) timerStart = frameCount;
  if (s === 2) darkness = 0;
}

function drawGameScene() {
  drawSceneBackground();

  if (scene === 1) drawDeadlineNotes();

  maze.show();
  goal.show();
  drawHUD();

  if (scene === 1) {
    let elapsed = floor((frameCount - timerStart) / 60);
    let remaining = 15 - elapsed;
    fill(255, 0, 0);
    textSize(36);
    textAlign(CENTER, TOP);
    text(max(0, remaining), width / 2, 10);
    if (remaining <= 0) {
      initScene(1);
      return;
    }
  }

  player.update(maze);

  if (scene === 2) {
    darkness += 0.12;
    if (darkness >= 255) darkness = 255;
  }

  player.show();

  if (player.hitGoal(goal)) {
    if (scene < 2) {
      scene++;
      initScene(scene);
      return;
    } else {
      drawEndScreen();
      return;
    }
  }

  if (scene === 2) {
    fill(0, darkness);
    rect(0, 0, width, height);
    drawDarkNoise();
  }
}

function drawEndScreen() {
  background(0);
  fill(255, 200, 60);
  textAlign(CENTER, CENTER);
  textSize(26);
  text("You Found Your Way!", width / 2, height / 2 - 40);

  textSize(14);
  fill(220);
  text("I didn't solve everything. I just found the next step.", width / 2, height / 2);
  text("Press R to restart the current level.", width / 2, height / 2 + 24);
}

function drawSceneBackground() {
  noStroke();
  fill(235);
  rect(0, 0, width, height);

  fill(245);
  rect(0, 0, width, TOP_PAD);

  for (let y = TOP_PAD; y < height; y++) {
    let t = (y - TOP_PAD) / (height - TOP_PAD);
    let c;
    if (scene === 0) c = color(120, 180, 255, 70);
    if (scene === 1) c = color(255, 160, 80, 70);
    if (scene === 2) c = color(160, 240, 160, 70);
    let b = lerpColor(color(255, 255, 255, 0), c, t * 0.6);
    stroke(b);
    line(0, y, width, y);
  }
}

function drawHUD() {
  fill(0, 220, 0);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Press R to Restart", 8, 6);

  fill(0);
  textSize(14);

  let title = "";
  let line1 = "";
  let line2 = "Arrow keys to move. Reach the goal.";

  if (scene === 0) {
    title = "Level 1";
    line1 = "New place. I'm learning the rules in university.";
  } else if (scene === 1) {
    title = "Level 2";
    line1 = "Facing Deadlines. I'm trying to keep up.";
  } else if (scene === 2) {
    title = "Level 3";
    line1 = "Uncertainty. I move even when I can't see.";
  }

  text(title + ": " + line1, 8, 28);
  text(line2, 8, 46);

  if (scene === 2 && darkness >= 255) {
    fill(0);
    textAlign(CENTER, TOP);
    textSize(16);
    text("Fully dark. Keep moving or press R.", width / 2, 10);
  }
}

function drawDeadlineNotes() {
  for (let i = 0; i < 10; i++) {
    let x = 10 + i * 55;
    let y = TOP_PAD + 10 + (i % 2) * 18;
    push();
    translate(x, y);
    rotate(radians((i % 3 - 1) * 4));
    fill(255, 245, 220, 200);
    stroke(120, 80, 40, 120);
    rect(0, 0, 38, 26, 3);
    line(6, 8, 32, 8);
    line(6, 14, 28, 14);
    pop();
  }
}

function drawDarkNoise() {
  let n = 140;
  noStroke();
  for (let i = 0; i < n; i++) {
    let x = random(width);
    let y = random(height);
    fill(255, 255, 255, map(darkness, 0, 255, 0, 18));
    rect(x, y, 1, 1);
  }
}

function drawStudent(x, y, s) {
  push();
  translate(x, y);
  scale(s);

  stroke(30);
  strokeWeight(2);

  fill(255, 225, 200);
  ellipse(20, 12, 22, 24);

  fill(30);
  line(14, 10, 18, 10);
  line(22, 10, 26, 10);

  noFill();
  stroke(60);
  arc(20, 16, 14, 10, 0, PI);

  stroke(80);
  line(12, 18, 16, 18);
  line(24, 18, 28, 18);

  noStroke();
  fill(80, 140, 240);
  rect(12, 26, 16, 18, 4);

  fill(50);
  rect(10, 30, 4, 16, 3);
  rect(26, 30, 4, 16, 3);

  fill(120, 80, 40);
  rect(28, 30, 12, 16, 3);
  fill(160, 120, 70);
  rect(30, 34, 8, 2);

  pop();
}

function drawBookWall(x, y, s) {
  push();
  translate(x, y);

  noStroke();
  fill(70, 40, 20);
  rect(0, 0, s, s);

  fill(120, 70, 40);
  rect(2, 2, s - 4, s - 4);

  stroke(80, 40, 20);
  strokeWeight(2);
  line(3, s * 0.35, s - 3, s * 0.35);
  line(3, s * 0.65, s - 3, s * 0.65);

  stroke(230, 230, 210, 150);
  strokeWeight(1);
  line(s * 0.75, 3, s * 0.75, s - 3);

  pop();
}

function drawCoffee(x, y, s) {
  push();
  translate(x, y);

  noStroke();
  fill(220, 170, 90);
  rect(2, 4, s - 6, s - 8, 4);

  fill(255);
  rect(4, 6, s - 10, s - 12, 3);

  stroke(255);
  strokeWeight(2);
  noFill();
  arc(s - 4, s * 0.55, 10, 10, -PI / 2, PI / 2);

  noStroke();
  fill(120, 80, 40, 220);
  rect(6, 10, s - 14, s - 20, 2);

  pop();
}

function drawDiploma(x, y, s) {
  push();
  translate(x, y);

  noStroke();
  fill(255, 235, 180);
  rect(2, 4, s - 4, s - 8, 3);

  stroke(160, 120, 60);
  strokeWeight(2);
  line(6, 10, s - 6, 10);
  line(6, 14, s - 10, 14);
  line(6, 18, s - 8, 18);

  noStroke();
  fill(220, 60, 60);
  circle(s - 6, s - 10, 8);

  pop();
}

class Player {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
  }

  update(maze) {
    let vx = 0, vy = 0;
    if (keyIsDown(LEFT_ARROW)) vx -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) vx += this.speed;
    if (keyIsDown(UP_ARROW)) vy -= this.speed;
    if (keyIsDown(DOWN_ARROW)) vy += this.speed;

    let nx = this.x + vx;
    if (!this.collides(nx, this.y, maze)) this.x = nx;

    let ny = this.y + vy;
    if (!this.collides(this.x, ny, maze)) this.y = ny;

    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, TOP_PAD, TOP_PAD + ROWS * CS - this.size);
  }

  collides(nx, ny, maze) {
    const s = this.size;
    const minCol = floor(nx / CS);
    const maxCol = floor((nx + s - 1) / CS);
    const minRow = floor((ny - TOP_PAD) / CS);
    const maxRow = floor((ny + s - 1 - TOP_PAD) / CS);

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        if (maze.isWall(c, r)) return true;
      }
    }
    return false;
  }

  show() {
    drawStudent(this.x - 6, this.y - 10, 0.8);
  }

  hitGoal(g) {
    return !(
      this.x + this.size < g.x ||
      this.x > g.x + g.size ||
      this.y + this.size < g.y ||
      this.y > g.y + g.size
    );
  }
}

class Goal {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }
  show() {
    if (scene === 2) drawDiploma(this.x, this.y, this.size);
    else drawCoffee(this.x, this.y, this.size);
  }
}

class Maze {
  constructor(cols, rows, cs, bias, yOffset) {
    this.cols = cols;
    this.rows = rows;
    this.cs = cs;
    this.bias = bias;
    this.yOffset = yOffset;
    this.grid = [];
  }

  initGrid() {
    this.grid = new Array(this.rows).fill(0).map(() => new Array(this.cols).fill(1));
  }

  generate() {
    this.initGrid();
    let stack = [];
    let cx = 1, cy = 1;
    this.grid[cy][cx] = 0;
    stack.push({ x: cx, y: cy });

    while (stack.length > 0) {
      let cur = stack[stack.length - 1];
      let neighbors = this.getNeighbors(cur.x, cur.y);

      if (neighbors.length > 0) {
        neighbors.sort((a, b) => {
          if (this.bias === "horizontal") return abs(b.dx) - abs(a.dx);
          if (this.bias === "vertical") return abs(b.dy) - abs(a.dy);
          return 0;
        });

        let n = random(neighbors);
        this.grid[cur.y + n.dy][cur.x + n.dx] = 0;
        this.grid[n.y][n.x] = 0;
        stack.push({ x: n.x, y: n.y });
      } else {
        stack.pop();
      }
    }

    this.grid[this.rows - 2][1] = 0;
    this.grid[1][this.cols - 2] = 0;
  }

  getNeighbors(x, y) {
    const dirs = [
      { dx: 0, dy: -2 },
      { dx: 2, dy: 0 },
      { dx: 0, dy: 2 },
      { dx: -2, dy: 0 }
    ];

    let res = [];
    for (let d of dirs) {
      let nx = x + d.dx;
      let ny = y + d.dy;

      if (nx > 0 && nx < this.cols - 1 && ny > 0 && ny < this.rows - 1 && this.grid[ny][nx] === 1) {
        let wx = x + d.dx / 2;
        let wy = y + d.dy / 2;
        if (this.grid[wy][wx] === 1) res.push({ x: nx, y: ny, dx: d.dx / 2, dy: d.dy / 2 });
      }
    }

    shuffle(res);
    return res;
  }

  isWall(c, r) {
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return true;
    return this.grid[r][c] === 1;
  }

  show() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] === 1) drawBookWall(c * this.cs, this.yOffset + r * this.cs, this.cs);
      }
    }
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
