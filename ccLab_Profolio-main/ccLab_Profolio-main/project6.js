let scene = 0; 
let loading = false;
let progress = 0;

//stats
let tank = [25, 15, -10, 50, 5, 30, 20];
let dps = [10, 20, 5, 15, -10, 25, 10];
let support = [-5, 30, 10, 5, 20, 15, 0];

function setup() {
  createCanvas(600, 600);
  textAlign(CENTER);
}

function draw() {
  background(15);
  if (scene === 0) {
    drawIntroPage();
  } else {
    drawDataPortrait();
  }
}

function mousePressed() {
  if (scene === 0 && !loading) {
    loading = true; // loading
  }
}
//page
function drawIntroPage() {
  background(10, 20, 30);
  noStroke();

  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(10, 20, 30), color(255, 130, 0), inter * 0.4);
    stroke(c);
    line(0, i, width, i);
  }

  //logo
  noFill();
  stroke(255, 130, 0);
  strokeWeight(8);
  ellipse(width / 2, height / 2 - 100, 160, 160);
  stroke(255);
  strokeWeight(6);
  arc(width / 2, height / 2 - 100, 160, 160, QUARTER_PI, PI - QUARTER_PI);

  noStroke();
  fill(255);
  textSize(26);
  text("OVERWATCH DATA PORTRAIT", width / 2, height / 2 + 40);

  fill(200);
  textSize(16);
  text("Tracked roles: Tank | DPS | Support", width / 2, height / 2 + 70);
  text("Each role represents my SR changes across 7 days", width / 2, height / 2 + 100);

  if (!loading) {
    fill(255, 180, 60);
    text("Click anywhere to begin loading...", width / 2, height / 2 + 150);
  }


  drawEnergyBar(width / 2 - 150, height - 80, 300, 15);
}


function drawEnergyBar(x, y, w, h) {
  noFill();
  stroke(255, 130, 0);
  rect(x, y, w, h, 5);

  if (loading && progress < 1) {
    progress += 0.01; 
  }

  if (progress >= 1) {
    scene = 1; 
  }

  noStroke();
  fill(255, 180, 60);
  rect(x, y, w * progress, h, 5);
}

//stats visual
function drawDataPortrait() {
  background(20);
  fill(255);
  textSize(20);
  text("My Overwatch Rank Data Portrait", width / 2, 40);
  textSize(14);
  text("Tank (Red) | DPS (Blue) | Support (Green)", width / 2, 70);

  for (let i = 0; i < 7; i++) {
    let baseX = 80 + i * 70;
    let wave = sin(frameCount * 0.05 + i) * 10;

    // Tank
    fill(255, 80, 80);
    ellipse(baseX, 300 - tank[i] * 2 + wave, abs(tank[i]), abs(tank[i]));

    // DPS
    fill(80, 120, 255);
    ellipse(baseX + 25, 300 - dps[i] * 2 + wave, abs(dps[i]), abs(dps[i]));

    // Support
    fill(100, 255, 150);
    ellipse(baseX + 50, 300 - support[i] * 2 + wave, abs(support[i]), abs(support[i]));
  }

  fill(255, 130, 0);
  textSize(14);
  text("SR changes per day across roles", width / 2, height - 40);
}
