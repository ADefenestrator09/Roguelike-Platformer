/*******************************************************************
File: sketch.js
Description: This file contains everything regarding to the drawing of the game and keyboard/mouse inputs.
Author: Aidan McRae
Version: 0.6
Date: June 9th, 2026
*******************************************************************/

//globals
var player;
var hit = false;
var spikeDamage = false;
var dead = false;

//cooldown stuff
var pHealCooldown = 0; //passive heal cooldown
var dCooldown = 0; //damage cooldown
var edCooldown = 0;
var bCooldown = 0; //building cooldown
var rCooldown = 0; //resizing cooldown
const COOLDOWNMAX = 15; //cooldown max for everything else
const BCOOLDOWNMAX = 7; //building cooldown max
const HCOOLDOWNMAX = 240; //passive heal

//platform stuff
var previewPlatform; //for previewing where the platform will be placed.
var drawBuildPlat = false;
var hasPlaced = false;
const VEL_THR = 0.05 //small threshold for stopping detecting collisions when almost stationary.
const MAX_STEP = 50; //for avoiding accidental extreme tunneling thorough platforms

//camera stuff
var cameraBaseY = 0;
var cameraY = 0;
var worldMouseX;
var worldMouseY;

//level stuff
var level = -1;
var start = true;
var levelSelector = false;
var levelSelected = false;
var levelSet = -1;

//UI stuff
var rectHealth;
var rectDash;
var shieldImg;
var swordImg;

function setup() {
  createCanvas(600, 400);
  player = new Player(100,400,'swordsman'); //making the player
  
  //equipping starter gear
  player.equip(SWORD);
  player.equip(PLATE);
  player.equip(RING);
  
  shieldImg = loadImage("images/shield.png"); //https://pngtree.com/freepng/bronze-sword-cartoon-illustration_4621258.html png image from pngtree.com
  swordImg = loadImage("images/sword.png"); //https://www.vecteezy.com/free-png/sword
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
    if(edCooldown > 0){
      edCooldown = decreaseCooldown(edCooldown);
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
    
    for(let enemy of enemies){
      enemy.eDraw();
      enemy.update(0.4,platforms,player);
      enemy.patrol(player,platforms);
    }



    if(drawBuildPlat){
      newPlatform.oDraw();
    }else if(build){
      previewPlatform = new Platform(worldMouseX,worldMouseY,abs(pWidth),abs(pHeight),c,isSpike);
      previewPlatform.oDraw();
    }

    for(let plat of platforms){ //drawing platforms
      plat.oDraw();
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

