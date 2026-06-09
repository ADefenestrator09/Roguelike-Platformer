/*******************************************************************
File: library.js
Description: This file contains most of the functions used in this game.
Author: Aidan McRae
Version: 0.6
Date: June 9th, 2026
*******************************************************************/

//Weapon functions:
//function for creating weapons, with id,name,and damage.
function createWeapon(id,name,damage){
  return {id,name,type: ITEM_TYPES.WEAPON,stats:{damage}};
}

//function for creating armour with id,name,armourValue,and healthBonus
function createArmour(id,name,armourValue,healthBonus = 0){
  return {id,name,type: ITEM_TYPES.ARMOUR,stats:{armour:armourValue,healthBonus}};
}

//fuction for creating trinkets, including id,name,and modifiers
function createTrinket(id,name,modifiers){
  //for example, the modifiers could be modifiers: {armour: 2, maxHealth: 5, crit: 0.05, moveSpeed: 0.1}, etc
  return {id,name,type: ITEM_TYPES.TRINKET,stats:modifiers || {} };
}



//all of the UI stuff\
function drawUI(){
  rectHealth = player.currentHealth/player.maxHealth*100;
  rectDash = 100-player.dashCooldown/player.dashCooldownMax * 100;
  
  //health UI
  fill(0,0,0,0)
  rect(10,10,100,15,2);
  fill(255,0,0); noStroke();
  rect(10,10,rectHealth,15,2)
  fill(0); textSize(12); stroke(0); strokeWeight(0);
  text(`HP: ${player.currentHealth} / ${player.maxHealth}`,30,22);
  stroke(0);strokeWeight(2);
  
  //dash UI
  fill(0,0,0,0);
  rect(10,30,100,15,2);
  fill(0,0,255); noStroke()
  rect(10,30,rectDash,15,2)
  fill(0); stroke(0); strokeWeight(0);
  if(player.dashCooldown != 0){
    text(`${float(((100-rectDash)/60).toFixed(2))}s`,45,42);
  } else{
    text("Full",45,42);
  }
  
  drawShield(35,70,45,45,player.totalArmour);
  drawSword(80,70,45,45,32,player.weaponDamage);
  strokeWeight(1);
  drawInvSlot(150,10,40,player.equipped.weapon);
  drawInvSlot(200,10,40,player.equipped.armour);
  drawInvSlot(250,10,40,player.equipped.trinkets[0]);
  drawInvSlot(300,10,40,player.equipped.trinkets[1]);
  stroke(0); strokeWeight(2);

}

function drawShield(x, y, w, h, value){
  push();
  translate(x, y);

  image(shieldImg,-23,-21,w, h);
  //center number
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(value, 0, 1);

  pop();
}
function drawSword(x, y, w, h, value){
  push();
  translate(x, y);
  
  image(swordImg,-21,-21,w,h)

  //Center number
  strokeWeight(2);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(value, 0, 1);

  pop();
}
function drawInvSlot(x,y,s,equipped){
  push();
  translate(x,y);
  stroke(0);
  fill(0,0,0,100);
  rect(0,0,s,s,1);
  textAlign(CENTER,CENTER);
  textSize(s*0.27);
  if(equipped){
    let value = equipped.name;
    text(value,s/20-2,s/20-2,s,s);
  } else{
    text("None",s/2,s/2);
  }
  pop();
}

//cooldown stuff

//function for checking if we can give the player a dash.
function checkDash(cooldown,count,onGround){
  if(cooldown === 0 && count < 1 && onGround == true){
    count = 1;
  }
  return count;
}

//cooldown function
function decreaseCooldown(cooldown){
  if(cooldown > 0){
    cooldown--;
  }
  return cooldown;
}


//mousepressed for everything related to pressing the mouse
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
      platforms.length = 0;
      enemies.length = 0;
      loadLevel();
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