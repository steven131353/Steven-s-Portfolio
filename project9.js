let video;
let faceMesh;
let faces = [];

let pixelSlider;
let heatSlider;
let coldSlider;
let brightSlider;
let driftSlider;
let shakeSlider;

let smoothedFaceWidth = 120;

const sketchW = 900;
const sketchH = 560;

function setup() {
  const canvas = createCanvas(sketchW, sketchH);
  canvas.parent("sketch-container");

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  pixelSlider = createEffectSlider(20, 60, 0, 30, 0, 1);
  heatSlider = createEffectSlider(20, 110, 0, 120, 0, 1);
  coldSlider = createEffectSlider(20, 160, 0, 120, 0, 1);
  brightSlider = createEffectSlider(20, 210, 50, 150, 100, 1);
  driftSlider = createEffectSlider(20, 260, 0, 30, 0, 1);
  shakeSlider = createEffectSlider(20, 310, 0, 20, 0, 1);

  faceMesh = ml5.faceMesh({
    maxFaces: 1,
    refineLandmarks: false,
    flipped: true
  });

  faceMesh.detectStart(video, gotFaces);

  noStroke();
  textFont("Arial");
}

function createEffectSlider(x, y, minValue, maxValue, startValue, stepValue) {
  const slider = createSlider(minValue, maxValue, startValue, stepValue);
  slider.parent("sketch-container");
  slider.position(x, y);
  slider.style("width", "180px");
  return slider;
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  background(0);

  let camW = video.width;
  let camH = video.height;

  let scaleFactor = min(width / camW, height / camH);
  let drawW = camW * scaleFactor;
  let drawH = camH * scaleFactor;
  let offsetX = (width - drawW) / 2;
  let offsetY = (height - drawH) / 2;

  let faceWidth = 120;

  if (faces.length > 0) {
    let pts = faces[0].keypoints;
    let minX = Infinity;
    let maxX = -Infinity;

    for (let p of pts) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
    }

    faceWidth = maxX - minX;
  }

  smoothedFaceWidth = lerp(smoothedFaceWidth, faceWidth, 0.12);

  let userPixel = pixelSlider.value();
  let facePixel = map(smoothedFaceWidth, 80, 280, 0, 20, true);
  let cellSize = max(userPixel, facePixel);

  if (
    cellSize <= 0.5 &&
    heatSlider.value() === 0 &&
    coldSlider.value() === 0 &&
    brightSlider.value() === 100 &&
    driftSlider.value() === 0 &&
    shakeSlider.value() === 0
  ) {
    image(video, offsetX, offsetY, drawW, drawH);
  } else {
    drawPixelGrid(offsetX, offsetY, drawW, drawH, cellSize);
  }

  drawUI();
}

function drawPixelGrid(offsetX, offsetY, drawW, drawH, cellSize) {
  video.loadPixels();

  let step = max(1, floor(cellSize));

  let heat = heatSlider.value();
  let cold = coldSlider.value();
  let brightnessAmount = brightSlider.value() / 100;
  let drift = driftSlider.value();
  let shake = shakeSlider.value();

  for (let y = 0; y < video.height; y += step) {
    for (let x = 0; x < video.width; x += step) {
      let index = (y * video.width + x) * 4;

      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      r = constrain((r + heat) * brightnessAmount, 0, 255);
      g = constrain(g * brightnessAmount, 0, 255);
      b = constrain((b + cold) * brightnessAmount, 0, 255);

      fill(r, g, b);

      let waveX = sin(y * 0.05 + frameCount * 0.05) * drift;
      let waveY = cos(x * 0.05 + frameCount * 0.05) * drift;

      let jitterX = random(-shake, shake);
      let jitterY = random(-shake, shake);

      let px = map(x, 0, video.width, offsetX, offsetX + drawW) + waveX + jitterX;
      let py = map(y, 0, video.height, offsetY, offsetY + drawH) + waveY + jitterY;
      let pw = map(step, 0, video.width, 0, drawW);
      let ph = map(step, 0, video.height, 0, drawH);

      rect(px, py, pw + 1, ph + 1);
    }
  }
}

function drawUI() {
  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);

  text("Emotional Camera", 20, 15);

  textSize(14);
  text("Pixel", 20, 40);
  text("Heat", 20, 90);
  text("Cold", 20, 140);
  text("Brightness", 20, 190);
  text("Drift", 20, 240);
  text("Shake", 20, 290);

  textSize(12);
  text("Move closer to the camera = blurrier", 20, 350);
  text("face width: " + nf(smoothedFaceWidth, 1, 1), 20, 375);
}
