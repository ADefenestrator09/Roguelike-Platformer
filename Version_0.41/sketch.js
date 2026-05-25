//globals
var player;
var dCooldown = 0; //dash cooldown
var hCooldown = 0; //heal cooldown
var bCooldown = 0; //building cooldown
var rCooldown = 0; //resizing cooldown
const COOLDOWNMAX = 15; //cooldown max for everything else
const BCOOLDOWNMAX = 7; //building cooldown max
var previewPlatform; //for previewing where the platform will be placed.
var cameraBaseY = 0;
var cameraY = 0;
var worldMouseX;
var worldMouseY;
var drawBuildPlat = false;
var hasPlaced = false;
var level = 0;

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
  
}

function draw() {
  background(135, 206, 235);
  
  //update player
  player.update(0.4,keyIsDown(87)||keyIsDown(38),keyIsDown(81),platforms);
  
  //building
  if(keyIsDown(66) && build != true && bCooldown == 0){ //B is to turn on the level builder
    build = true;
    bCooldown = COOLDOWNMAX;
  } else if(keyIsDown(66) && build == true && bCooldown == 0){ //press B again to turn it off
    build = false;
    bCooldown = BCOOLDOWNMAX;
  }
  
  //moving platforms
  if(keyIsDown(76) && bCooldown == 0 && newPlatform){ //L
    newPlatform.x += 1; //moving it right
    bCooldown = BCOOLDOWNMAX;
  } if(keyIsDown(74) && bCooldown == 0 && newPlatform){ //J
    newPlatform.x -= 1; //moving it left
    bCooldown = BCOOLDOWNMAX;
  } if(keyIsDown(75) && bCooldown == 0 && newPlatform){ //K
    newPlatform.y += 1; //moving it down
    bCooldown = BCOOLDOWNMAX;
  } if(keyIsDown(73) && bCooldown == 0 && newPlatform){ //I
    newPlatform.y -= 1; //moving it up.
    bCooldown = BCOOLDOWNMAX;
  }
  
  //changing size of platforms
  if(keyIsDown(191) && rCooldown == 0){ //Comma for increasing width
    pWidth += 5;
    rCooldown = BCOOLDOWNMAX;
  }if(keyIsDown(190) && rCooldown == 0){ //Period for decreasing width
    pWidth -= 5;
    rCooldown = BCOOLDOWNMAX;
  }if(keyIsDown(79) && rCooldown == 0){ //O for increasing height
    pHeight -= 5;
    rCooldown = BCOOLDOWNMAX;
  }if(keyIsDown(85) && rCooldown == 0){//U for decreasing height
    pHeight += 5;
    rCooldown = BCOOLDOWNMAX;
  }
  
  //adding to platform list after space bar is pressed
  if(keyIsDown(32) && newPlatform && !hasPlaced){
    hasPlaced = true;
    platforms.push(newPlatform);
    drawBuildPlat = false;
    console.log(newPlatform.info);
    number += 1;
  }

  //cooldown
  if(dCooldown > 0){
    dCooldown = decreaseCooldown(dCooldown);
  }
  if(hCooldown > 0){
    hCooldown = decreaseCooldown(hCooldown);
  }
  if(bCooldown > 0){
    bCooldown = decreaseCooldown(bCooldown);
  }
  if(rCooldown > 0){
    rCooldown = decreaseCooldown(rCooldown);
  }
  
  push(); //containing translation
  updateCamera(player); //updating camera
  
  player.pDraw(); //drawing player
  
  
  
  if(drawBuildPlat){
    newPlatform.oDraw();
  }else if(build){
    previewPlatform = new Platform(worldMouseX,worldMouseY,abs(pWidth),abs(pHeight),c);
    previewPlatform.oDraw();
  }
  
  for(let plat of platforms){ //drawing platforms
    plat.oDraw();
  }
  
  pop(); 
  
  drawUI(); //drawing UI
}

function mousePressed(){ //if mouse is pressed, place platform for moving and resizing.
  if(build){
    newPlatform = new Platform(int(worldMouseX),int(worldMouseY),abs(pWidth),abs(pHeight),c);
    drawBuildPlat = true;
    hasPlaced = false;
  } 
}

// this is a camera function that was inspired from information from this link: https://www.construct.net/en/forum/construct-3/how-do-i-8/smooth-follow-camera-141422
//   And it basically makes it so that the camera moves in steps of 200, using the Lerp function to move smoothly.

function updateCamera(player) {
  let step = floor(player.pos.y / 200) * 200;
  let targetY;
  //console.log(step)
  
  if(player.pos.y > 200){ //if on floor
    targetY = height / 2 - step;
  } else if(player.pos.y > 100){
    targetY = height / 2 - step/2 - 100;     
  } else{
    targetY = height / 2 - step/2;
  }

  //console.log(targetY);
  
  if(player.vel.y < 15){
    cameraY = lerp(cameraY, targetY, 0.04); //slower for slower velocities
  } else{
    cameraY = lerp(cameraY, targetY, 0.20); //faster for faster velocities
  }
  
  //console.log(int(player.vel.y),int(player.pos.y));

  let targetX = width / 2 - player.pos.x;
  
  //makes you know where the worlds x and y are.
  worldMouseX = mouseX - targetX;
  worldMouseY = mouseY - cameraY;
  
  translate(targetX, cameraY);
}

