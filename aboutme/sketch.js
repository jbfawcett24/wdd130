function preload() {
  reload = loadImage("Images/reload.png");
  brick = loadImage("Images/bricks.jpg");
  sky = loadImage("Images/sky.png");
  ball = loadImage("Images/ball.png");
  fullScreen = loadImage("Images/fullscreen.png");
}

function setup() {
  createCanvas(400, 400);

  //image(fullScreen, 300, 0, 100, 50);
  full = get(300, 0, 50, 50);
  noFull = get(350, 0, 50, 50);

  angleMode(RADIANS);

  frameRate(60);

  var a;
  var exist;

  let store = getItem("high score");
  if (store !== null) {
    hiScore = store;
  }

  for (var j = 0; j < 4; j++) {
    rex[j] = [];
    for (var i = 0; i < 12; i++) {
      a = random(0, 2);
      if (a <= 1) {
        exist = true;
      } else {
        exist = false;
      }
      rex[j][i] = new box(exist, j, i);
    }
  }
  bel = new baal();
}

class box {
  constructor(exist, j, i) {
    this.j = j;
    this.i = i;
    this.yOff = (j * height) / 4;
    this.size = width / 12;
    this.x = width - this.size - this.i * this.size;
    this.y = height + this.yOff;
    this.exist = exist;
    this.a = 0;
  }
  create() {
    if (this.exist === true) {
      noFill();
      strokeWeight(3);
      stroke(0);
      //rect(this.x, this.y, this.size, this.size / 2);
      image(brick, this.x, this.y, this.size, this.size / 2);
    }
    if (this.y + this.size / 2 <= 0) {
      if (this.i === 0) {
        score += 1;
      }
      rex[this.j][this.i].randomize();
      this.y = height;
    } else {
      this.y -= difficulty + 1;
    }
  }
  randomize() {
    this.a = random(0, 2);
    if (this.a <= 1) {
      this.exist = true;
    } else {
      this.exist = false;
    }
  }
  reset() {
    this.y = height + this.yOff;
    rex[this.j][this.i].randomize();
  }
}

class baal {
  constructor() {
    this.x = width * 0.5;
    this.y = 0;
    this.size = width / 28.57;
    this.r = 0;
  }
  create() {
    fill(100);
    strokeWeight(1);
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    rotate(2/7 * this.r);
    image(ball, 0, 0, this.size, this.size);
    pop();
    this.y += 3;
    for (var j = 0; j < 4; j++) {
      for (var i = 0; i < 12; i++) {
        if (
          this.y + this.size / 2 >= rex[j][i].y - 1 &&
          this.y + this.size / 2 <= rex[j][i].y + 10 &&
          this.x >= rex[j][i].x - 3 &&
          this.x <= rex[j][i].x + 3 + rex[j][i].size &&
          rex[j][i].exist === true
        ) {
          this.y = rex[j][i].y - 1 - this.size / 2;
        }
      }
    }
  }
  move() {
    if (this.x - this.size / 2 <= 0) {
      this.x = 0 + this.size / 2;
    }
    if (this.x + this.size / 2 >= width) {
      this.x = width - this.size / 2;
    }
    if (lKey === true) {
      this.r--;
      this.x -= 2;
    }
    if (rKey === true) {
      this.r++;
      this.x += 2;
    }
  }
  stop() {
    stopped = true;
    image(reload, 150, 150, reload.height / 2, reload.width / 2);
    fill(0);
    stroke(0);
    strokeWeight(1);
    textSize(17);
    text("You Died", 165, 143);
    text("High Score: " + hiScore, 150, 268);
    noLoop();
  }
}
var rex = [];

var bel;

var rKey = false;
var lKey = false;

var stopped = false;

var score = 0;
var hiScore = 0;
let difficulty = 0;

let full;
let noFull;
let fScreen = false;

function keyPressed() {
  if (keyCode === 65) {
    lKey = true;
  }
  if (keyCode === 68) {
    rKey = true;
  }
}

function keyReleased() {
  if (lKey === true) {
    lKey = false;
  }
  if (rKey === true) {
    rKey = false;
  }
  if (keyIsPressed === true && keyCode === 65) {
    rKey = true;
  }
  if (keyIsPressed === true && keyCode === 68) {
    lKey = true;
  }

  return false;
}

function mousePressed() {
  if (
    mouseX >= 150 &&
    mouseX <= 250 &&
    mouseY >= 150 &&
    mouseY <= 250 &&
    stopped === true
  ) {
    stopped = false;
    score = 0;
    for (var j = 0; j < 4; j++) {
      for (var i = 0; i < 12; i++) {
        rex[j][i].reset();
      }
    }
    bel.y = 0;
    loop();
  }
  if (mouseX >= 350 && mouseX <= 400 && mouseY <= 50 && mouseY >= 0) {
    fScreen = !fScreen;
    fullscreen(fScreen);
    if(fScreen === true){
      resizeCanvas(displayHeight, displayHeight);
    } else {
      resizeCanvas(400,400); 
    }
    for (let j = 0; j < rex.length; j++) {
      for (let i = 0; i < rex[j].length; i++) {
        rex[j][i].yOff = (rex[j][i].j * height) / 4;
        rex[j][i].size = width / 12;
        rex[j][i].x = width - rex[j][i].size - rex[j][i].i * rex[j][i].size;
        rex[j][i].y = height  + rex[j][i].yOff - rex[j][i].y;
      }
    }
  }
}

function draw() {
  fill(0);
  rect(0, 0, 1000, 1000);
  image(sky, 0, 0, width, height);
  image(noFull, 350, 0, 50, 50);

  for (var j = 0; j < 4; j++) {
    for (var i = 0; i < 12; i++) {
      rex[j][i].create();
    }
  }

  if (bel.y + bel.size < 0) {
    bel.stop();
  } else if (bel.y - bel.size > height) {
    bel.stop();
  } else {
    bel.create();
    bel.move();
  }

  textSize(40);
  fill(0);
  text(score, 10, 40);

  if (score >= hiScore) {
    storeItem("high score", hiScore);
    hiScore = score;
  }

  if (score % 30 === 0) {
    difficulty = score / 30;
  }
}
