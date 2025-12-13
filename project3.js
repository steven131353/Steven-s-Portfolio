let prevTick;
let shapes = []; 

function setup() {
  createCanvas(600, 600);
  background(20);  
  prevTick = floor(millis() / 1000); 
}

function draw() {
  let currentTick = floor(millis() / 1000); 
  if (currentTick !== prevTick) {
    addNewShape();   
    prevTick = currentTick;
  }

  
  background(20);
  for (let s of shapes) {
    fill(s.c);
    noStroke();
    if (s.type === "circle") {
      ellipse(s.x, s.y, s.size);
    } else if (s.type === "rect") {
      rect(s.x, s.y, s.size, s.size);
    } else if (s.type === "triangle") {
      triangle(s.x, s.y,
               s.x + s.size, s.y,
               s.x + s.size / 2, s.y - s.size);
    }
  }

  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Experimental Clock: tick " + currentTick, 10, 10);
}

function addNewShape() {
  let shape = {
    x: random(width),
    y: random(height),
    size: random(20, 80),
    type: random(["circle", "rect", "triangle"]),
    c: color(random(255), random(255), random(255), 200)
  };
  shapes.push(shape);
}
