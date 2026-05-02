let font;
let balls = [];
let tableMargin = 50;

let cueStart = null; 
let cueEnd = null;   
function preload() {
  font = loadFont("WieynkCapsRound-1.ttf"); 
}

function setup() {
  createCanvas(600, 600);
  textFont(font);
  textAlign(CENTER, CENTER);

  let letters = ["B", "A", "L", "L", "S"];
  makeRackRow(letters);
}

function makeRackRow(letters) {
  balls = [];
  let r = 30; 
  let startX = tableMargin + 90;
  let y = height / 2;

  for (let i = 0; i < letters.length; i++) {
    let x = startX + i * (r * 2 + 18);
    balls.push(new Ball(x, y + random(-6, 6), r, letters[i]));
  }

  for (let b of balls) {
    b.vx = random(-1, 1);
    b.vy = random(-1, 1);
  }
}

function draw() {
  drawTable();

  for (let b of balls) b.update();
  resolveCollisions();
  for (let b of balls) b.bounceWalls();

  for (let b of balls) b.draw();

  drawCue();
}

function drawTable() {
  background(245);

  // 台面
  noStroke();
  fill(30, 120, 70);
  rect(tableMargin, tableMargin, width - tableMargin * 2, height - tableMargin * 2, 18);

  // 桌边
  noFill();
  stroke(20);
  strokeWeight(18);
  rect(tableMargin, tableMargin, width - tableMargin * 2, height - tableMargin * 2, 18);


  noStroke();
  fill(10);
  let pockets = [
    [tableMargin, tableMargin],
    [width / 2, tableMargin],
    [width - tableMargin, tableMargin],
    [tableMargin, height - tableMargin],
    [width / 2, height - tableMargin],
    [width - tableMargin, height - tableMargin],
  ];
  for (let [px, py] of pockets) circle(px, py, 28);
}

function mousePressed() {
  cueStart = { x: mouseX, y: mouseY };
  cueEnd = { x: mouseX, y: mouseY };
}

function mouseDragged() {
  if (!cueStart) return;
  cueEnd = { x: mouseX, y: mouseY };
}

function mouseReleased() {
  if (!cueStart || !cueEnd) return;

  let target = nearestBall(cueStart.x, cueStart.y);

  if (target) {
    let dx = cueStart.x - cueEnd.x;
    let dy = cueStart.y - cueEnd.y;
    let power = constrain(sqrt(dx * dx + dy * dy), 0, 180);

    let mag = sqrt(dx * dx + dy * dy) + 0.0001;
    let fx = (dx / mag) * (power * 0.18);
    let fy = (dy / mag) * (power * 0.18);

    target.vx += fx;
    target.vy += fy;
  }

  cueStart = null;
  cueEnd = null;
}

function nearestBall(x, y) {
  let best = null;
  let bestD = Infinity;
  for (let b of balls) {
    let d = dist(x, y, b.x, b.y);
    if (d < bestD) {
      bestD = d;
      best = b;
    }
  }
  if (bestD > 140) return null; 
  return best;
}

function drawCue() {
  if (!cueStart || !cueEnd) return;

  stroke(255, 230);
  strokeWeight(3);
  line(cueStart.x, cueStart.y, cueEnd.x, cueEnd.y);

  noStroke();
  fill(255, 230);
  let p = constrain(dist(cueStart.x, cueStart.y, cueEnd.x, cueEnd.y), 0, 180);
  rect(18, 18, p * 2, 10, 6);
}

function resolveCollisions() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      let a = balls[i], b = balls[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let d = sqrt(dx * dx + dy * dy);
      let minD = a.r + b.r;

      if (d > 0 && d < minD) {
        let overlap = (minD - d) / 2;
        let nx = dx / d;
        let ny = dy / d;

        a.x -= nx * overlap;
        a.y -= ny * overlap;
        b.x += nx * overlap;
        b.y += ny * overlap;

      
        let va = a.vx * nx + a.vy * ny;
        let vb = b.vx * nx + b.vy * ny;
        let diff = vb - va;

        a.vx += nx * diff;
        a.vy += ny * diff;
        b.vx -= nx * diff;
        b.vy -= ny * diff;
      }
    }
  }
}

class Ball {
  constructor(x, y, r, label) {
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.r = r; 
    this.label = label;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // 摩擦
    this.vx *= 0.985;
    this.vy *= 0.985;

    if (abs(this.vx) < 0.02) this.vx = 0;
    if (abs(this.vy) < 0.02) this.vy = 0;
  }

  bounceWalls() {
    let left = tableMargin + 10;
    let right = width - tableMargin - 10;
    let top = tableMargin + 10;
    let bottom = height - tableMargin - 10;

    if (this.x - this.r < left) { this.x = left + this.r; this.vx *= -1; }
    if (this.x + this.r > right) { this.x = right - this.r; this.vx *= -1; }
    if (this.y - this.r < top) { this.y = top + this.r; this.vy *= -1; }
    if (this.y + this.r > bottom) { this.y = bottom - this.r; this.vy *= -1; }
  }

  draw() {
    
    textSize(this.r * 1.6);

    // 阴影
    noStroke();
    fill(0, 70);
    text(this.label, this.x + 4, this.y + 6);

   
    fill(255);
    text(this.label, this.x, this.y);

    
    stroke(0);
    strokeWeight(3);
    fill(255);
    text(this.label, this.x, this.y);
    noStroke();
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    makeRackRow(["B", "A", "L", "L", "S"]);
  }
}

let scribbledSketch = function(p) {
  let font;
  let word = "SCRIBBLED";
  let idx = 0;

  let fontSize = 150;
  let sampleFactor = 0.13;

  let lastX = -999;
  let lastY = -999;

  p.preload = function() {
    font = p.loadFont("ZQKScribbled-2.ttf");
  };

  p.setup = function() {
    let canvas = p.createCanvas(600, 600);
    canvas.parent("scribbled-container");
    p.background(255);
  };

  p.draw = function() {
    let threshold = 100;
    let d = p.dist(p.mouseX, p.mouseY, lastX, lastY);

    if (d > threshold && insideCanvas(p.mouseX, p.mouseY)) {
      stampNextLetter(p.mouseX, p.mouseY);
      lastX = p.mouseX;
      lastY = p.mouseY;

      idx++;
      if (idx >= word.length) idx = 0;
    }
  };

  function insideCanvas(x, y) {
    return x >= 0 && x <= p.width && y >= 0 && y <= p.height;
  }

  function stampNextLetter(x, y) {
    let ch = word[idx];

    let pts = font.textToPoints(ch, 0, 0, fontSize, {
      sampleFactor: sampleFactor
    });

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let pt of pts) {
      minX = p.min(minX, pt.x);
      minY = p.min(minY, pt.y);
      maxX = p.max(maxX, pt.x);
      maxY = p.max(maxY, pt.y);
    }

    let cx = (minX + maxX) / 2;
    let cy = (minY + maxY) / 2;

    let passes = p.floor(p.map(p.mouseY, 0, p.height, 3, 10));

    p.stroke(0, 80);
    p.strokeWeight(2);
    p.noFill();

    for (let k = 0; k < passes; k++) {
      p.beginShape();

      for (let pt of pts) {
        let nx = p.noise(k * 30 + pt.x * 0.03, pt.y * 0.03, p.frameCount * 0.02);
        let ny = p.noise(k * 30 + 99 + pt.x * 0.03, 99 + pt.y * 0.03, p.frameCount * 0.02);

        let wobble = 10;
        let ox = (nx - 0.5) * wobble;
        let oy = (ny - 0.5) * wobble;

        p.vertex(x + (pt.x - cx) + ox, y + (pt.y - cy) + oy);
      }

      p.endShape();
    }
  }

  function resetSketch() {
    p.background(255);
    idx = 0;
    lastX = -999;
    lastY = -999;
  }

  p.keyPressed = function() {
    resetSketch();
  };

  p.mousePressed = function() {
    if (p.mouseButton === p.LEFT) {
      resetSketch();
    }
  };
};

new p5(scribbledSketch);

let sonicSketch = function(p) {
  let font, pts = [];
  let word = "SONIC";
  let fontSize = 200;
  let sampleFactor = 0.14;

  p.preload = function() {
    font = p.loadFont("Sonic-Boom-Regular-1.ttf");
  };

  p.setup = function() {
    let canvas = p.createCanvas(600, 600);
    canvas.parent("sonic-container");
    rebuild();
  };

  function rebuild() {
    pts = font.textToPoints(word, 30, 380, fontSize, {
      sampleFactor: sampleFactor
    });
  }

  p.draw = function() {
    p.background(255);

    let frontX = p.mouseX;
    let band = 90;

    p.stroke(0);
    p.strokeWeight(2);
    p.noFill();

    p.beginShape();
    for (let pt of pts) {
      let d = p.abs(pt.x - frontX);

      let t = 1 - p.constrain(d / band, 0, 1);

      let stepCount = 6;
      let stepped = p.floor(t * stepCount) / stepCount;

      let pushX = stepped * 35;
      let pushY = -stepped * 18;

      let j = stepped * 1.2;
      let jx =
        (p.noise(pt.x * 0.02, pt.y * 0.02, p.frameCount * 0.03) - 0.5) * j;
      let jy =
        (p.noise(pt.x * 0.02 + 9, pt.y * 0.02, p.frameCount * 0.03) - 0.5) * j;

      p.vertex(pt.x + pushX + jx, pt.y + pushY + jy);
    }
    p.endShape();

    p.stroke(0, 80);
    p.strokeWeight(1);
    p.line(frontX, 0, frontX, p.height);
  };
};

new p5(sonicSketch);