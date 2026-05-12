let fortuneData;
let catData;

let screen = "intro";
let questionIndex = 0;
let answers = [];

let inputBox;
let button;
let restartButton;

let typedText = "";
let finalText = "";
let typeIndex = 0;

let ritualStartTime = 0;
let selectedCat = "unknown creature";

let questions = [
  "What do you usually do when you have an important deadline?",
  "What habit secretly controls your life?",
  "Who or what do you trust too easily?"
];

let glitchChars = "!@#$%^&*()_+-=[]{};:<>?/|\\░▒▓█∆Ω≈√∑∫∞VOIDERRORLIFE";

function preload() {
  fortuneData = loadJSON("fortunes.json");

  catData = loadJSON(
    "https://raw.githubusercontent.com/dariusk/corpora/master/data/animals/cats.json",
    undefined,
    () => {
      catData = { cats: ["black cat", "street cat", "ghost cat", "warning cat"] };
    }
  );
}

function setup() {
  const canvas = createCanvas(600, 600);
  canvas.parent("sketch-container");

  textFont("Arial");

  inputBox = createInput("");
  inputBox.parent("sketch-container");
  inputBox.position(170, 360);
  inputBox.size(260, 36);
  inputBox.style("background", "black");
  inputBox.style("color", "white");
  inputBox.style("border", "2px solid red");
  inputBox.style("font-size", "16px");
  inputBox.hide();

  button = createButton("BEGIN");
  button.parent("sketch-container");
  button.position(225, 430);
  button.size(150, 42);
  button.style("background", "red");
  button.style("color", "white");
  button.style("border", "none");
  button.style("font-weight", "bold");
  button.mousePressed(handleButton);

  restartButton = createButton("RUIN ME AGAIN");
  restartButton.parent("sketch-container");
  restartButton.position(210, 520);
  restartButton.size(180, 42);
  restartButton.style("background", "white");
  restartButton.style("color", "black");
  restartButton.style("border", "2px solid black");
  restartButton.style("font-weight", "bold");
  restartButton.mousePressed(restart);
  restartButton.hide();
}

function draw() {
  background(8);

  drawGlitchBackground();

  textAlign(CENTER, CENTER);
  fill(255);

  if (screen === "intro") {
    drawIntro();
  } else if (screen === "question") {
    drawQuestion();
  } else if (screen === "ritual") {
    drawRitual();
  } else if (screen === "result") {
    drawResult();
  }
}

function drawIntro() {
  inputBox.hide();
  restartButton.hide();
  button.show();
  button.html("BEGIN");

  textSize(40);
  textStyle(BOLD);
  fill(255);

  text("HOW WILL YOU\nRUIN YOUR LIFE?", 300, 130);

  textSize(16);
  textStyle(NORMAL);
  fill(255, 80, 80);
  text("A chaotic digital oracle.", 300, 220);

  fill(220);
  textSize(14);

  text("Answer three questions.\nThe system predicts your downfall.", 300, 290);
}

function drawQuestion() {
  inputBox.show();
  button.show();
  button.html("SUBMIT");

  textSize(16);
  fill(255, 0, 0);

  text("QUESTION " + (questionIndex + 1) + " / " + questions.length, 300, 130);

  textSize(28);
  fill(255);

  text(questions[questionIndex], 100, 190, 400, 120);

  textSize(12);
  fill(150);

  text("Type honestly. Or lie.", 300, 320);
}

function drawRitual() {
  inputBox.hide();
  button.hide();

  let elapsed = millis() - ritualStartTime;

  push();
  translate(random(-5, 5), random(-5, 5));

  drawNoise();
  drawScanLines();
  drawCorruptedSymbols();
  drawRedGlitchBlocks();

  textAlign(CENTER, CENTER);
  textSize(34);
  textStyle(BOLD);

  fill(255, 0, 0, 160);
  text("CALCULATING\nYOUR DOWNFALL...", 300 + random(-8, 8), 220 + random(-8, 8));

  fill(255);
  text("CALCULATING\nYOUR DOWNFALL...", 300 + random(-3, 3), 220 + random(-3, 3));

  textStyle(NORMAL);
  textSize(14);
  fill(255, 0, 0);

  for (let i = 0; i < 8; i++) {
    text(randomGlitchString(int(random(8, 22))), random(80, 520), random(320, 470));
  }

  textSize(14);
  fill(255);

  text(
    random([
      "Scanning bad habits...",
      "Opening corrupted destiny file...",
      "Consulting unstable JSON...",
      "Analyzing poor decisions...",
      "Reading your browser aura...",
      "Downloading emotional damage..."
    ]),
    300,
    360
  );

  noFill();
  stroke(255, 0, 0);
  rect(150, 400, 300, 18);

  noStroke();
  fill(255, 0, 0);
  let progress = map(elapsed, 0, 2600, 0, 300);
  progress = constrain(progress, 0, 300);
  rect(150, 400, progress, 18);

  if (frameCount % 20 < 10) {
    fill(255, 0, 0);
    textSize(11);
    text("DO NOT TRUST THE RESULT", 300, 445);
  }

  pop();

  if (elapsed > 2600) {
    generateResult();
    screen = "result";
  }
}

function drawResult() {
  restartButton.show();

  textSize(14);
  fill(255, 0, 0);

  text("YOUR DESTINY HAS BEEN GENERATED", 300, 70);

  textSize(18);
  fill(255);

  text(typedText, 80, 140, 440, 320);

  if (typeIndex < finalText.length) {
    typedText += finalText.charAt(typeIndex);
    typeIndex++;
  }
}

function handleButton() {
  if (screen === "intro") {
    screen = "question";
    return;
  }

  if (screen === "question") {
    let answer = inputBox.value().trim();

    if (answer === "") {
      return;
    }

    answers.push(answer.toLowerCase());
    inputBox.value("");

    if (questionIndex < questions.length - 1) {
      questionIndex++;
    } else {
      screen = "ritual";
      ritualStartTime = millis();
    }
  }
}

function generateResult() {
  let scores = {};

  for (let path of fortuneData.paths) {
    scores[path.id] = 0;

    for (let answer of answers) {
      for (let word of path.keywords) {
        if (answer.includes(word)) {
          scores[path.id]++;
        }
      }
    }
  }

  let bestPath = random(fortuneData.paths);
  let bestScore = -1;

  for (let path of fortuneData.paths) {
    if (scores[path.id] > bestScore) {
      bestScore = scores[path.id];
      bestPath = path;
    }
  }

  if (random() < 0.3) {
    bestPath = random(fortuneData.paths);
  }

  let glitch = random(fortuneData.glitches);

  if (catData && catData.cats) {
    selectedCat = random(catData.cats);
  }

  finalText =
    bestPath.title +
    "\n\n" +
    bestPath.explanation +
    "\n\nSarcastic Advice: " +
    bestPath.advice +
    "\n\nExternal Omen: A " +
    selectedCat +
    " has appeared in your destiny." +
    "\n\nSystem Message: " +
    glitch;

  typedText = "";
  typeIndex = 0;
}

function restart() {
  screen = "intro";
  questionIndex = 0;
  answers = [];
  typedText = "";
  finalText = "";
  typeIndex = 0;

  inputBox.value("");
  inputBox.hide();
  button.show();
  restartButton.hide();
}

function drawGlitchBackground() {
  noStroke();

  for (let i = 0; i < 15; i++) {
    fill(random(120, 255), 0, random(0, 80), random(20, 70));
    rect(random(width), random(height), random(20, 160), random(2, 10));
  }

  fill(255, 0, 0, 18);
  textSize(100);
  textStyle(BOLD);

  text("ERROR", 300 + random(-3, 3), 300 + random(-3, 3));

  textStyle(NORMAL);
}

function drawNoise() {
  noStroke();

  for (let i = 0; i < 900; i++) {
    let c = random(255);
    fill(c, random(30, 100));
    rect(random(width), random(height), 1, 1);
  }
}

function drawScanLines() {
  stroke(255, 0, 0, 45);
  strokeWeight(1);

  for (let y = 0; y < height; y += 8) {
    line(0, y + random(-1, 1), width, y + random(-1, 1));
  }

  noStroke();
}

function drawCorruptedSymbols() {
  textStyle(BOLD);

  for (let i = 0; i < 35; i++) {
    textSize(random(10, 30));
    fill(255, 0, 0, random(60, 180));
    text(randomGlitchString(int(random(1, 4))), random(width), random(height));
  }

  textStyle(NORMAL);
}

function drawRedGlitchBlocks() {
  noStroke();

  for (let i = 0; i < 12; i++) {
    fill(255, 0, 0, random(40, 130));
    rect(random(width), random(height), random(40, 220), random(4, 18));
  }

  for (let i = 0; i < 6; i++) {
    fill(0, random(80, 180));
    rect(random(width), random(height), random(80, 260), random(6, 22));
  }
}

function randomGlitchString(len) {
  let s = "";

  for (let i = 0; i < len; i++) {
    s += glitchChars.charAt(int(random(glitchChars.length)));
  }

  return s;
}
