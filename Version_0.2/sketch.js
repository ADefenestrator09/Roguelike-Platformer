//globals
var player;
var platforms = [];

function setup() {
  createCanvas(600, 400);
  player = new Player(100,300); //making the player

  //platforms
  platforms[0] = new Platform(300,380,20,20,[0,220,70]);
  platforms[1] = new Platform(400,300,20,20,[0,220,70]);
}

function draw() {
  background(220);
  
  //update and draw player
  player.update(0.4,keyIsDown(87)||keyIsDown(38),keyIsDown(81),platforms);
  player.pDraw();
  
  //draw the platforms
  for(let plat of platforms){
    plat.oDraw();
  }
}