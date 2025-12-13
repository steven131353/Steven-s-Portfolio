function setup() {
  createCanvas(600, 600);
  noFill();
}

function draw() {
  background(255);
 
  strokeWeight(2);

  let lineSpacing = 15; 
  let waveStrength = 150; 

  for (let y = 0; y <= height; y += lineSpacing) {
    beginShape();
    for (let x = 0; x <= width; x += 10) {

      let d = dist(mouseX, mouseY, x, y);
      let offset = 0;

      if (d < 150) {
        
        offset = sin((x + frameCount * 3) * 0.05) * map(d, 0, 150, waveStrength, 0);
      } else {
       
        offset = sin((x + frameCount * 3) * 0.05) * 5;
      }

      vertex(x, y + offset * 0.1);
    }
    endShape();
  }
}
