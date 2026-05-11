var player;


function setup() {
  createCanvas(600, 400);
  player = new Player(100,300);
}

function draw() {
  background(220);
  player.update(0.4,keyIsDown(87),keyIsDown(81));
  player.pDraw();
}