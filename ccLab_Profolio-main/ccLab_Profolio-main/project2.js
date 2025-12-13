let faceColor;  

function setup() {
  createCanvas(400, 400);
  faceColor = color(255, 220, 180); 
}

function draw() {
  background(220);

 
  fill(faceColor);
  ellipse(200, 200, 180, 220);


  let eyeSpacing = map(mouseX, 0, width, 40, 100);
  let mouthH = map(mouseY, 0, height, 5, 50);

  fill(255);
  ellipse(200 - eyeSpacing/2, 170, 30, 20);
  ellipse(200 + eyeSpacing/2, 170, 30, 20);


  fill(0);
  ellipse(200 - eyeSpacing/2, 170, 10, 10);
  ellipse(200 + eyeSpacing/2, 170, 10, 10);


  fill(200, 50, 60);
  arc(200, 240, 100, mouthH, 0, PI);
}

function keyPressed() {
  if (key === ' ') { 
    faceColor = color(random(255), random(255), random(255));
  }
}

