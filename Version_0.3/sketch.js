//globals
var player;
var platforms = [];

function setup() {
  createCanvas(600, 400);
  player = new Player(100,300,'swordsman'); //making the player
  
  //equipping starter gear
  player.equip(SWORD);
  player.equip(PLATE);
  player.equip(RING);
  
  //platforms
  platforms[0] = new Platform(300,380,100,20,[0,220,70]);
  platforms[1] = new Platform(400,300,20,100,[0,220,70]);
  platforms[2] = new Platform(400,300,100,20,[0,220,70]);
}

function draw() {
  background(135, 206, 235);
  
  //drawing UI
  drawUI();
  
  //update and draw player
  player.update(0.4,keyIsDown(87)||keyIsDown(38),keyIsDown(81),platforms);
  player.pDraw();
  
  //testing damage and heal: press H to take 8 damage
  if(keyIsDown(72)){
    player.takeDamage(8);
  }
  //press J to heal 3 damage;
  if (keyIsDown(74)) {
    player.heal(3);
  }
  
  //draw the platforms
  for(let plat of platforms){
    plat.oDraw();
  }
}