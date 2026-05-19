//globals
var player;
var platforms = [];
var dCooldown = 0;
var hCooldown = 0;
const COOLDOWNMAX = 15;

//cooldown function
function decreaseCooldown(cooldown){
  if(cooldown > 0){
    cooldown--;
  }
  return cooldown;
}

function setup() {
  createCanvas(600, 400);
  player = new Player(100,400,'swordsman'); //making the player
  
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
    if(dCooldown == 0){
      player.takeDamage(8);
      dCooldown = COOLDOWNMAX;
    }
  }
  
  //press J to heal 3 damage;
  if (keyIsDown(74)) {
    if(hCooldown == 0){
      player.heal(3);
      hCooldown = COOLDOWNMAX;
    }
  }
  
  //cooldown
  if(dCooldown > 0){
    dCooldown = decreaseCooldown(dCooldown);
  }
  if(hCooldown > 0){
    hCooldown = decreaseCooldown(hCooldown);
  }
  
  //draw the platforms
  for(let plat of platforms){
    plat.oDraw();
  }
}