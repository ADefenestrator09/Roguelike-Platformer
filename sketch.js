//globals
var player;
var hit = false;
var spikeDamage = false;
var dead = false;
var levelSelector = false;
var levelSelected = false;
var levelSet = -1;

//cooldown stuff

var pHealCooldown = 0; //passive heal cooldown
var dCooldown = 0; //damage cooldown
var bCooldown = 0; //building cooldown
var rCooldown = 0; //resizing cooldown
const COOLDOWNMAX = 15; //cooldown max for everything else
const BCOOLDOWNMAX = 7; //building cooldown max
const HCOOLDOWNMAX = 240; //passive heal

//platform stuff
var previewPlatform; //for previewing where the platform will be placed.
var drawBuildPlat = false;
var hasPlaced = false;

//camera stuff
var cameraBaseY = 0;
var cameraY = 0;
var worldMouseX;
var worldMouseY;

//level stuff
var level = -1;
var start = true;

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
  if(!start && !dead && !levelSelector){
    background(135, 206, 235);
  
    //update player
    player.update(0.4,keyIsDown(87)||keyIsDown(38),keyIsDown(81),platforms);

    //update damage
    if(hit && dCooldown == 0){
      player.takeDamage(enemy.attack(player));
      dCooldown = COOLDOWNMAX;
    }
    if(spikeDamage && dCooldown == 0){
      player.takeDamage(5);
      dCooldown = COOLDOWNMAX;
      spikeDamage = false;
    }

    //building
    if(keyIsDown(66) && build != true && bCooldown == 0){ //B is to turn on the level builder
      build = true;
      bCooldown = COOLDOWNMAX;
    } else if(keyIsDown(66) && build == true && bCooldown == 0){ //press B again to turn it off
      build = false;
      bCooldown = COOLDOWNMAX;
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

    if(keyIsDown(80) && rCooldown == 0 && isSpike == false){
      pHeight = 15;
      pWidth = 15;
      c = [100,100,100];
      rCooldown = BCOOLDOWNMAX
      isSpike = true;
    } if(keyIsDown(80) && rCooldown == 0 && isSpike == true){
      pHeight = 20;
      pWidth = 100;
      c = [0,220,70];
      rCooldown = BCOOLDOWNMAX;
      isSpike = false;
    }

    //adding to platform list after space bar is pressed
    if(keyIsDown(32) && newPlatform && !hasPlaced){
      hasPlaced = true;
      platforms.push(newPlatform);
      drawBuildPlat = false;
      console.log(newPlatform.info);
      number += 1;
    }
    
    //passive healing
    if(pHealCooldown == 0 && player.currentHealth < player.maxHealth){
      player.heal(1);
      pHealCooldown = HCOOLDOWNMAX;
    }
    
    //decreasing cooldowns
    if(dCooldown > 0){
      dCooldown = decreaseCooldown(dCooldown);
    }
    if(bCooldown > 0){
      bCooldown = decreaseCooldown(bCooldown);
    }
    if(rCooldown > 0){
      rCooldown = decreaseCooldown(rCooldown);
    } 
    if(pHealCooldown > 0){
      pHealCooldown = decreaseCooldown(pHealCooldown);
    }

    push(); //containing translation
    updateCamera(player); //updating camera

    player.pDraw(); //drawing player



    if(drawBuildPlat){
      newPlatform.oDraw();
    }else if(build){
      previewPlatform = new Platform(worldMouseX,worldMouseY,abs(pWidth),abs(pHeight),c,isSpike);
      previewPlatform.oDraw();
    }

    for(let plat of platforms){ //drawing platforms
      plat.oDraw();
    }
    for(let enemy of enemies){
      enemy.eDraw();
      enemy.update();
    }

    pop(); 

    drawUI(); //drawing UI
  } else if(dead){
    background(0);
    stroke(255,0,0);
    fill(50);
    rect(150,125,300,100); //you died
    rect(85,275,200,50); //respawn?
    rect(300,275,200,50); //Main Menu
    textSize(50);
    fill(0);
    strokeWeight(3);
    text("You Died",190,190);
    textSize(30);
    text("Respawn?",120,310);
    text("Main Menu",325,310);
    
    
    
  
  }else if(levelSelector){
    background(135, 206, 235);
    stroke(0);
    fill(0);
    textSize(50);
    text("Levels",225,55);
    noFill();
    strokeWeight(3);
    rect(75,93,450,194);
    fill(50,50,50,100);
    
    
    //levels
    textSize(50);
    
    text("1",112,155);
    text("2",201,155);
    text("3",290,155);
    text("4",379,155);
    text("5",468,155);
    text("6",112,255);
    text("7",201,255);
    text("8",290,255);
    text("9",379,255);
    text("0",468,255);
    
    
    changeColour(1);
    rect(82,100,80,80); //1
    changeColour(2);
    rect(171,100,80,80); //2
    changeColour(3);
    rect(260,100,80,80); //3
    changeColour(4);
    rect(349,100,80,80); //4
    changeColour(5);
    rect(438,100,80,80); //5
    changeColour(6);
    rect(82,200,80,80); //6
    changeColour(7);
    rect(171,200,80,80); //7
    changeColour(8);
    rect(260,200,80,80); //8
    changeColour(9);
    rect(349,200,80,80); //9
    changeColour(0);
    rect(438,200,80,80); //0
    
    fill(0,255,0);
    rect(475,305,100,75); //Go
    fill(50,50,50,100);
    text("Go!",485,360);
    
  }else{
    //loading screen
    background(0);
    stroke(255);
    fill(0,125,0);
    rect(50,300,200,50);
    rect(50,25,500,75);
    rect(350,125,200,225);
    fill(220);
    stroke(0);
    rect(400,162.5,100,150);
    textSize(40);
    strokeWeight(3);
    fill(255);
    stroke(0);
    text("Start",100,338);
    textSize(45);
    text("Rogue-Like Platformer",75,75);
  }
}

function mousePressed(){ 
  //if mouse is pressed, place platform for moving and resizing.
  if(build){
    newPlatform = new Platform(int(worldMouseX),int(worldMouseY),abs(pWidth),abs(pHeight),c,isSpike);
    drawBuildPlat = true;
    hasPlaced = false;
  } 
  if(start){
    if(mouseX >= 50 && mouseX <= 250 && mouseY >= 300 && mouseY <= 350){
      start = false;
      levelSelector = true;
    }
  }
  if(dead){
    if(mouseX >= 85 && mouseX <= 285 && mouseY >= 275 && mouseY <= 325){
      dead = false;
    }
    if(mouseX >= 300 && mouseX <= 500 && mouseY >= 275 && mouseY <= 325){
      levelSelector = true;
      dead = false;
    }
  }
  if(levelSelector){
    if(mouseX >= 475 && mouseX <= 575 && mouseY >= 305 && mouseY <= 380 && levelSelected){
      level = levelSet;
      levelSelector = false;
      loadLevel();
      console.log(level);
    }
    //level selector
    if(mouseX >= 82 && mouseX <= 162 && mouseY >= 100 && mouseY <= 180){
      levelSelected = true;
      levelSet = 1;
    }else if(mouseX >= 171 && mouseX <= 251 && mouseY >= 100 && mouseY <= 180){
      levelSelected = true;
      levelSet = 2;
    }else if(mouseX >= 260 && mouseX <= 340 && mouseY >= 100 && mouseY <= 180){
      levelSelected = true;
      levelSet = 3;
    }else if(mouseX >= 349 && mouseX <= 429 && mouseY >= 100 && mouseY <= 180){
      levelSelected = true;
      levelSet = 4;
    }else if(mouseX >= 438 && mouseX <= 518 && mouseY >= 100 && mouseY <= 180){
      levelSelected = true;
      levelSet = 5;
    }else if(mouseX >= 82 && mouseX <= 162 && mouseY >= 200 && mouseY <= 280){
      levelSelected = true;
      levelSet = 6;
    }else if(mouseX >= 171 && mouseX <= 251 && mouseY >= 200 && mouseY <= 280){
      levelSelected = true;
      levelSet = 7;
    }else if(mouseX >= 260 && mouseX <= 340 && mouseY >= 200 && mouseY <= 280){
      levelSelected = true;
      levelSet = 8;
    }else if(mouseX >= 349 && mouseX <= 429 && mouseY >= 200 && mouseY <= 280){
      levelSelected = true;
      levelSet = 9;
    }else if(mouseX >= 438 && mouseX <= 518 && mouseY >= 200 && mouseY <= 280){
      levelSelected = true;
      levelSet = 0;
    }   
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
function changeColour(number){
  if(levelSet == number){
    fill(25,25,25,200);
  } else{
    fill(50,50,50,100);
  }
}
