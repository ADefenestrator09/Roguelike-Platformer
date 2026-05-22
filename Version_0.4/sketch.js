//globals
var player;
var dCooldown = 0;
var hCooldown = 0;
var bCooldown = 0;
var rCooldown = 0; //resizing cooldown
const COOLDOWNMAX = 15;
const BCOOLDOWNMAX = 7;
var previewPlatform; //for previewing where the platform will be placed.
var cameraBaseY = 0;
var cameraY = 0;
var worldMouseX;
var worldMouseY;
var drawBuildPlat = false;
var hasPlaced = false;

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
  
  //building
  if(keyIsDown(66) && build != true && bCooldown == 0){ //B is to turn on the level builder
    build = true;
    bCooldown = COOLDOWNMAX;
  } else if(keyIsDown(66) && build == true && bCooldown == 0){ //press B again to turn it off
    build = false;
    bCooldown = BCOOLDOWNMAX;
  }
  
  //moving platforms
  if(keyIsDown(222) && bCooldown == 0 && newPlatform){ // " or '
    newPlatform.x += 1; //moving it right
    bCooldown = BCOOLDOWNMAX;
  } if(keyIsDown(76) && bCooldown == 0 && newPlatform){ //L
    newPlatform.x -= 1; //moving it left
    bCooldown = BCOOLDOWNMAX;
  } if(keyIsDown(186) && bCooldown == 0 && newPlatform){ //: or ;
    newPlatform.y += 1; //moving it down
    bCooldown = BCOOLDOWNMAX;
  } if(keyIsDown(80) && bCooldown == 0 && newPlatform){ //P
    newPlatform.y -= 1; //moving it up.
    bCooldown = BCOOLDOWNMAX;
  }
  
  //changing size of platforms
  if(keyIsDown(191) && rCooldown == 0){ //Comma for increasing width
    pWidth += 5;
    rCooldown = BCOOLDOWNMAX;
  }if(keyIsDown(188) && rCooldown == 0){ //? for decreasing width
    pWidth -= 5;
    rCooldown = BCOOLDOWNMAX;
  }if(keyIsDown(79) && rCooldown == 0){ //O for increasing height
    pHeight -= 5;
    rCooldown = BCOOLDOWNMAX;
  }if(keyIsDown(219) && rCooldown == 0){//{ or [ for decreasing height
    pHeight += 5;
    rCooldown = BCOOLDOWNMAX;
  }
  
  //adding to platform list after space bar is pressed
  if(keyIsDown(32) && newPlatform && !hasPlaced){
    hasPlaced = true;
    platforms.push(newPlatform);
    drawBuildPlat = false;
  }
  if(keyIsDown(67) && bCooldown == 0){ //if c is pressed, export platforms to json file.
    console.log(platforms);
    saveJSON(platforms,'platform_test.json')
    bCooldown = COOLDOWNMAX;
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
  
  //this is a camera function that was inspired from information from this link: https://www.construct.net/en/forum/construct-3/how-do-i-8/smooth-follow-camera-141422
  //And it basically makes it so that the camera moves in steps of 200, using the Lerp function to move smoothly.

  function updateCamera(player){
    //checks if the players y pos is less then 200 pixels lower than the cameras base. If so, it decreases the cameras base by 200. Otherwise, if it is more than 200 higher, it'll increase it by 200.
    if(player.pos.y < cameraBaseY - 200){
      cameraBaseY -= 200;
    } else if(player.pos.y > cameraBaseY + 200){
      cameraBaseY += 200;
    }

    let targetX = width/2 - player.pos.x;
    let targetY = height/2 - cameraBaseY;

    targetY = constrain(targetY, height - 400, 0);

    cameraY = lerp(cameraY, targetY, 0.08);
    
    //makes you know where the worlds x and y are.
    worldMouseX = mouseX - targetX;
    worldMouseY = mouseY - cameraY;

    //translating the canvas to where needed
    translate(targetX, cameraY);
  }
  
  push(); //containing translation
  updateCamera(player); //updating camera
  
  player.pDraw(); //drawing player
  
  if(drawBuildPlat){
    newPlatform.oDraw();
  }else if(build){
    previewPlatform.oDraw();
  }
  
  for(let plat of platforms){ //drawing platforms
    plat.oDraw();
  }
  previewPlatform = new Platform(worldMouseX,worldMouseY,abs(pWidth),abs(pHeight),c);
  
  pop(); 
  
  drawUI(); //drawing UI
}

function mousePressed(){ //if mouse is pressed, place platform for moving and resizing.
  if(build){
    newPlatform = new Platform(int(worldMouseX),int(worldMouseY),abs(pWidth),abs(pHeight),c);
    console.log(newPlatform);
    drawBuildPlat = true;
    hasPlaced = false;
  } 
}