let originals = [];
let MachineOutputs = [];

let current = 0;
let fadeAmount = 0;
let distortAmount = 0;
let scanY = 0;

let particles = [];

let echoesofnature;
let echoesofpast;
let footsteps;

let soundStarted = false;

// These are the titles of the images that are displayed on the top centre of the screen.
let titles = [
  "A Solace Heart",
  "The Wanderer Of Euphoria",
  "Nomatopia",
  "The Forgotten Archives",
  "Distorted Oneness",
  "The Breath Of Doxa",
  "A place my heart once belonged",
  "Querencia",
  "The Wanderer's Loneliness",
  "The Stillness Within"
];

// These are the memories that are associated with each image.

let memories = [
  {
    location: "Garden Of Rainham",
    year: "2025",
    person: "I remember walking without have destination, only the need to be still.",
    machine: "The machine turned my stillness into a view of confusion."
  },
  {
    location: "UNKNOWN FIELD",
    year: "2023",
    person: "I remember navigating through life searching for the truth.",
    machine: "The machine detects atmosphere, shadow, and distance."
  },
  {
    location: "Mind",
    year: "2025",
    person: "I remember standing beneath trees, not seeking answers, only stillness.",
    machine: "The machine remembers a forest cathedral."
  },
  {
    location: "A QUIET ROAD",
    year: "2025",
    person: "I remember peace arriving slowly, without announcement.",
    machine: "The machine reconstructs calm as visual symmetry."
  },
  {
    location: "SOLACE",
    year: "2025",
    person: "I remember the image before it became a landscape.",
    machine: "The machine remembers texture, colour, and probability."
  },
  {
    location: "WANDERER",
    year: "2025",
    person: "I remember moving through the world as if searching for a gentler language.",
    machine: "The machine predicts a dream of becoming."
  },
  {
    location: "ARCHIVE",
    year: "2025",
    person: "I remember the frame, but not everything around it.",
    machine: "The machine fills the missing parts with hallucination."
  },
  {
    location: "THRESHOLD",
    year: "2025",
    person: "I remember standing between what I was and what I was becoming.",
    machine: "The machine sees transition as distortion."
  },
  {
    location: "MEMORY",
    year: "2025",
    person: "I remember something sacred in the ordinary.",
    machine: "The machine returns an artificial shrine."
  },
  {
    location: "BECOMING",
    year: "2025",
    person: "I remember that memory was never still.",
    machine: "The machine remembers movement without knowing why."
  }
];

// These are the sayings that appear on the screen when the image is being distorted.
let distortsayings = [
  "MEMORY EXCEEDS THE MODEL",
  "THE MACHINE MISREMEMBERS",
  "THE IMAGE CAN NO LONGER HOLD ITSELF",
  "STATISTICAL MEMORY IS NOT LIVED MEMORY",
  "THE ARCHIVE BREAKS OPEN",
  "THE MACHINE DREAMS TOO FAR"
];

// This function is responsible for preloading the images and sounds.
function preload() {
  for (let i = 1; i <= 10; i++) {
    let num = nf(i, 2);

    originals[i - 1] = loadImage("assets/originals/original_" + num + ".jpg");
    MachineOutputs[i - 1] = loadImage("assets/ai_outputs/ai_" + num + ".jpg");
  }

  soundFormats("mp3");

  echoesofnature = loadSound("assets/sounds/forest.mp3");
  echoesofpast = loadSound("assets/sounds/archives.mp3");
  footsteps = loadSound("assets/sounds/steps.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Uncial Antiqua");
  textAlign(CENTER, CENTER);
  imageMode(CENTER);

  scanY = height * 0.14;

  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      s: random(0.4, 1.8),
      a: random(20, 90),
      vx: random(-0.25, 0.25),
      vy: random(-0.25, 0.25)
    });
  }
}

// The function is responsible for rendering the visuals on to the canvas.
function draw() {
  background(3, 3, 5);

  let original = originals[current];
  let ai = MachineOutputs[current];

  if (!original || !ai || original.width === 0 || ai.width === 0) {
    fill(255);
    textSize(24);
    text("The archive is loading...", width / 2, height / 2);
    return;
  }

  let mousePosition = constrain(mouseX / width, 0, 1);

  if (mousePosition < 0.65) {
    fadeAmount = map(mousePosition, 0, 0.65, 0, 255);
    distortAmount = 0;
  } else {
    fadeAmount = 255;
    distortAmount = map(mousePosition, 0.65, 1, 0, 255);
  }

  updateSound(mousePosition);

  drawillusion(original, ai);
  drawParticles();
  drawMemoryImage(original, ai);
  drawScanner();
  drawdistort(ai);
  drawGlassLayer();
  drawUIText();
  drawProgressBar();
  drawOpening();
}

// This function is responsible for starting the sound when the user clicks on the canvas,
// which adds to the immersive experience of the project as users interact with the project and see how the machine distorts the original memory.
function startSound() {
  if (!soundStarted) {
    userStartAudio();

    echoesofnature.loop();
    echoesofpast.loop();
    footsteps.loop();

    echoesofnature.setVolume(0.45);
    echoesofpast.setVolume(0.0);
    footsteps.setVolume(0.0);

    soundStarted = true;
  }
}

// This function is responsible for updating the sound based on the mouse position which creates an immersive experience for users as they interact with the project
// which allows them to hear the transformation happening to the image as they move the mouse from one point to another, revealing what the machine has done to the original memory changing it to distorted memories.

function updateSound(mousePosition) {
  if (!soundStarted) return;

  let forestVol = map(mousePosition, 0, 1, 0.55, 0.08);
  let archivesVol = map(mousePosition, 0.2, 0.75, 0.0, 0.38);
  let stepsVol = map(mousePosition, 0.55, 1, 0.0, 0.42);

  forestVol = constrain(forestVol, 0.05, 0.55);
  archivesVol = constrain(archivesVol, 0.0, 0.38);
  stepsVol = constrain(stepsVol, 0.0, 0.42);

  echoesofnature.setVolume(forestVol, 0.2);
  echoesofpast.setVolume(archivesVol, 0.2);
  footsteps.setVolume(stepsVol, 0.2);

  if (distortAmount > 20) {
    let distort = map(distortAmount, 0, 255, 1, 2.2);

    echoesofnature.rate(random(0.85, 1.05));
    echoesofpast.rate(random(0.7, distort));
    footsteps.rate(random(0.45, distort));

    echoesofnature.pan(random(-0.2, 0.2));
    echoesofpast.pan(random(-0.6, 0.6));
    footsteps.pan(random(-1, 1));
  } else {
    echoesofnature.rate(1);
    echoesofpast.rate(1);
    footsteps.rate(1);

    echoesofnature.pan(0);
    echoesofpast.pan(0);
    footsteps.pan(0);
  }
}

// 
function drawillusion(original, ai) {
  push();

  tint(255, 45);
  drawCover(original, width / 2, height / 2, width, height);

  tint(255, fadeAmount * 0.28);
  drawCover(ai, width / 2, height / 2, width, height);

  noTint();

  fill(0, 180);
  rect(0, 0, width, height);

  noStroke();
  for (let r = 800; r > 0; r -= 25) {
    fill(255, 255, 255, map(r, 800, 0, 0, 7));
    ellipse(width / 2, height / 2, r, r * 0.58);
  }

  pop();
}

// This function is responsible for drawing the original memory and the machine's interpretation of the memory side by side in the centre of the screen,
// with a subtle floating effect to add to the overall aesthetic of the project.
function drawMemoryImage(original, ai) {
  let maxW = width * 0.68;
  let maxH = height * 0.64;
  let floatY = sin(frameCount * 0.01) * 7;

  push();
  translate(width / 2, height / 2 + floatY);

  noStroke();
  fill(0, 180);
  rectMode(CENTER);
  rect(0, 18, maxW + 55, maxH + 55, 14);

  tint(255, 255);
  drawContain(original, 0, 0, maxW, maxH);

  tint(255, fadeAmount);
  drawContain(ai, 0, 0, maxW, maxH);
  noTint();

  noFill();
  stroke(255, 90);
  strokeWeight(1);
  rect(0, 0, maxW + 20, maxH + 20, 8);

  stroke(255, 28);
  rect(0, 0, maxW - 20, maxH - 20, 4);

  pop();
}

// This function is responsible for drawing the distortion effect on the image which serves as a visual representation of the machine's interpretation of the original memory
// and how it distorts the original memory into something new and different.
function drawdistort(ai) {
  if (distortAmount <= 1) return;

  let intensity = map(distortAmount, 0, 255, 0, 1);

  push();
  translate(width / 2, height / 2);

  for (let i = 0; i < 22; i++) {
    let sliceH = random(8, 32);
    let y = random(-height * 0.28, height * 0.28);
    let offset = random(-90, 90) * intensity;

    tint(255, random(45, 150) * intensity);
    image(
      ai,
      offset,
      y,
      width * 0.62,
      sliceH,
      0,
      random(ai.height),
      ai.width,
      sliceH
    );
  }

  noTint();
  pop();

  noStroke();

  for (let i = 0; i < 18; i++) {
    fill(255, random(15, 55) * intensity);
    rect(
      random(width * 0.15, width * 0.85),
      random(height * 0.15, height * 0.8),
      random(20, 160) * intensity,
      random(1, 4)
    );
  }

  if (distortAmount > 100) {
    fill(255, 220);
    textSize(16);
    text(
      random(distortsayings),
      width / 2 + random(-3, 3),
      height * 0.17 + random(-2, 2)
    );
  }
}

// This function is responsible for drawing the scanner effect that moves across the screen which shows the process of the machine scanning and analyzing the orignal memory and transforming into its own interpretation.
function drawScanner() {
  let scannerSpeed = map(distortAmount, 0, 255, 0.9, 4.5);

  scanY += scannerSpeed;

  if (scanY > height * 0.84) {
    scanY = height * 0.16;
  }

  noStroke();
  fill(255, 18);
  rect(width * 0.16, scanY - 25, width * 0.68, 50);

  stroke(255, 110);
  strokeWeight(1);
  line(width * 0.16, scanY, width * 0.84, scanY);
}

// This function is responsible for drawing the particles which serves as an effect that adds to the overall aesthetic of the project.
function drawParticles() {
  noStroke();

  for (let p of particles) {
    let distort = map(distortAmount, 0, 255, 1, 5);

    fill(255, p.a);
    circle(p.x, p.y, p.s);

    p.x += p.vx * distort;
    p.y += p.vy * distort;

    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
  }
}

// This function is used for creating a glass-textured layer on top of the background image which adds to the overall aesthetic of the project.
function drawGlassLayer() {
  noStroke();

  for (let i = 0; i < 180; i++) {
    fill(0, i * 0.55);
    rect(0, 0, width, i);
    rect(0, height - i, width, i);
    blur(1);
  }

  for (let i = 0; i < 120; i++) {
    fill(0, i * 0.35);
    rect(0, 0, i, height);
    rect(width - i, 0, i, height);
      blur(1);
  }
}

// This function draws the interface text which includes the title of the project, of the image, the original memory and the machine's interpretation of the memory.
function drawUIText() {
  let memoryPercent = int(map(fadeAmount, 0, 255, 0, 100));
  let distortPercent = int(map(distortAmount, 0, 255, 0, 100));
  let data = memories[current];

  push();

  textFont("Uncial Antiqua");
  rectMode(CORNER);
  textAlign(CENTER, CENTER);

  // top centre title
  fill(255, 220);
  textSize(40);
  textFont("Cinzel");
  text("The Memory Between Us", width / 2, 42);

  fill(255, 110);
  textSize(18);
  textFont("Uncial Antiqua");
  text("The Archives dreams back", width / 2, 72);

  // image title
  fill(255, 180);
  textSize(12);
  textFont("Uncial Antiqua");
  text(titles[current], width / 2, height * 0.145);

  // 
  let mainText;

  if (distortAmount < 80) {
    mainText = fadeAmount < 130 ? data.person : data.machine;
  } else {
    mainText = "when the machine dreams too far, memory begins to distort";
  }

  fill(255, 235);
  textSize(22);
  drawCenteredText(mainText, width / 2, height - 120, width * 1, 20);

  //Instructions for user to understand the interface and the transformation happening to the image as they move the mouse from one point to another.
  //which also shows the percentage of transformation as it is happening to the image, and how much the machine is transforming the original memory into distorted memories.
  fill(255, 125);
  textSize(11);
  textFont("Georgia");
  text(
    "move mouse (Left to Right): original memory - machine memory - memory distort",
    width / 2,
    height - 62
  );

  fill(255, 90);
  textSize(10);
  textFont("Georgia");
  text(
    "machine transformation: " +
      memoryPercent +
      "% / memory distort: " +
      distortPercent +
      "%",
    width / 2,
    height - 42
  );

  // the left aligned metadata about the image which changes as the image distorts through mouse interactions.
  textAlign(LEFT, TOP);
  fill(255, 95);
  textSize(10);

  if (distortAmount < 120) {
    text("LOCATION: " + data.location, 32, 28);
    text("YEAR: " + data.year, 32, 46);
    text("DATASET: PERSONAL PHOTOGRAPHIC ARCHIVE", 32, 64);
  } else {
    text("LOCATION: ERROR", 32, 28);
    text("YEAR: NULL", 32, 46);
    text("DATASET: FRAGMENTED / UNSTABLE", 32, 64);
  }

  // the right aligned metadata about the image which changes as the image distorts through mouse interactions.
  textAlign(RIGHT, TOP);

  if (distortAmount < 120) {
    text("PERSONAL MEMORY", width - 32, 28);
    text(
      "MACHINE CONFIDENCE: " +
        int(map(fadeAmount, 0, 255, 12, 96)) +
        "%",
      width - 32,
      46
    );
    text("IMAGE " + nf(current + 1, 2) + " / 10", width - 32, 64);
  } else {
    text("MACHINE CONFIDENCE: 100%", width - 32, 28);
    text("EMOTIONAL CERTAINTY: NULL", width - 32, 46);
    text("IMAGE STATUS: Distorted", width - 32, 64);
  }

  pop();
}

// this function draws text centered horizontally and vertically within a specified bounding box to ensure that the text is properly aligned and visually balanced.
function drawCenteredText(str, x, y, maxWidth, lineHeight) {
  let words = str.split(" ");
  let line = "";
  let lines = [];

  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + " ";

    if (textWidth(testLine) > maxWidth && i > 0) {
      lines.push(line);
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }

  lines.push(line);

  let totalHeight = lines.length * lineHeight;
  let startY = y - totalHeight / 2;

  textAlign(CENTER, CENTER);

  for (let i = 0; i < lines.length; i++) {
    text(lines[i], x, startY + i * lineHeight);
  }
}

// The progress bar which is located at the bottom of the screen which displays the percentage of transformation as it is happening to the image as the mouse is being moved which reveals what the machine has done to the original memory changing it to distorted memories.
function drawProgressBar() {
  let barwidth = width * 0.46;
  let x = width / 2 - barwidth / 2;
  let y = height - 18;

  noStroke();

  fill(255, 35);
  rect(x, y, barwidth, 3);

  fill(255, 150);
  rect(x, y, map(fadeAmount, 0, 255, 0, barwidth * 0.65), 3);

  fill(255, 90);
  rect(
    x + barwidth * 0.65,
    y,
    map(distortAmount, 0, 255, 0, barwidth * 0.35),
    3
  );
}

// The Opening screen which serves as the introduction to the project, inviting users to interact with the essence of the project which will also be activated with sound that captures the essence of the project,
// for people to see how the machine distorts the original memory.

function drawOpening() {
  if (!soundStarted) {
    fill(0, 180);
    rect(0, 0, width, height);

    fill(255, 230);
    textSize(26);
    text("Click to explore the memories", width / 2, height / 2);

    fill(255, 130);
    textSize(13);
    text("sound activates on click", width / 2, height / 2 + 38);
  }
}

//
function drawContain(img, cx, cy, maxW, maxH) {
  let imgRatio = img.width / img.height;
  let boxRatio = maxW / maxH;

  let drawW, drawH;

  if (imgRatio > boxRatio) {
    drawW = maxW;
    drawH = maxW / imgRatio;
  } else {
    drawH = maxH;
    drawW = maxH * imgRatio;
  }

  image(img, cx, cy, drawW, drawH);
}

// 
function drawCover(img, cx, cy, w, h) {
  let imgRatio = img.width / img.height;
  let canvasRatio = w / h;

  let drawW, drawH;

  if (imgRatio > canvasRatio) {
    drawH = h;
    drawW = h * imgRatio;
  } else {
    drawW = w;
    drawH = w / imgRatio;
  }

  image(img, cx, cy, drawW, drawH);
}

//
function mousePressed() {
  startSound();

  current = (current + 1) % originals.length;
  fadeAmount = 0;
  distortAmount = 0;
  scanY = height * 0.16;
}

// This function allows users to go through the image through the use of the left and right arrow keys on the keyboard which also resets the effects on the image for the users to view the original memory.
function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    current = (current + 1) % originals.length;
    fadeAmount = 0;
    distortAmount = 0;
  }

  if (keyCode === LEFT_ARROW) {
    current--;
    if (current < 0) current = originals.length - 1;
    fadeAmount = 0;
    distortAmount = 0;
  }
}

// This function ensures that the canvas is automatically resizable to different sizes.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}