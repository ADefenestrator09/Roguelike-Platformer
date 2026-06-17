/*******************************************************************
File: objects.js
Description: This file contains the objects that make up the levels in this game.
Version: 0.6
Author: Aidan McRae
Date: June 9th, 2026
*******************************************************************/


//building variables
var build = false;
var c = [0,220,70];
var pWidth = 100;
var pHeight = 20;
var newPlatform;
var isSpike = false;
var isObjective = false;
var pNumber;
var eNumber;

//arrays
var enemies = [];
var platforms = [];

//enemy types
var enemyTypes = {
  slime: {eWidth:20,eHeight:20,damage:4,reward:null,speed:1,colour:[0,255,0,200],maxHealth:15} 
}


//loading levels
function loadLevel(){
  platforms.length = 0;
  enemies.length = 0;
  if(level == 0){ //level 0
    enemies[0] = new Enemy(0,400,enemyTypes.slime);
    enemies[1] = new Enemy(475,280,enemyTypes.slime); 
    enemies[2] = new Enemy(1125,-146,enemyTypes.slime); 
    
    platforms[0] = new Platform(300,380,100,20,[0,220,70],false);
    platforms[1] = new Platform(400,300,20,100,[0,220,70],false);
    platforms[2] = new Platform(400,300,100,20,[0,220,70],false);
    platforms[3] = new Platform(493,238,100,20,[0,220,70],false);
    platforms[4] = new Platform(623,177,100,20,[0,220,70],false); 
    platforms[5] = new Platform(736,113,100,20,[0,220,70],false); 
    platforms[6] = new Platform(852,24,100,20,[0,220,70],false); 
    platforms[7] = new Platform(965,-55,100,20,[0,220,70],false); 
    platforms[8] = new Platform(1077,-120,100,20,[0,220,70],false); 
    platforms[9] = new Platform(1174,-193,100,20,[0,220,70],false); 
    platforms[10] = new Platform(1268,-277,100,20,[0,220,70],false); 
    platforms[11] = new Platform(1387,-336,100,20,[0,220,70],false); 
    platforms[12] = new Platform(72,248,100,20,[0,220,70],false); 
    platforms[13] = new Platform(853,105,100,20,[0,220,70],false); 
    platforms[14] = new Platform(975,82,100,20,[0,220,70],false); 
    platforms[15] = new Platform(1092,134,100,20,[0,220,70],false); 
    platforms[16] = new Platform(1201,215,100,20,[0,220,70],false); 
    platforms[17] = new Platform(1316,265,100,20,[0,220,70],false); 
    platforms[18] = new Platform(1437,335,100,20,[0,220,70],false); 
    platforms[19] = new Platform(1567,374,100,20,[0,220,70],false); 
    platforms[20] = new Platform(1694,332,100,20,[0,220,70],false); 
    platforms[21] = new Platform(1794,305,100,20,[0,220,70],false); 
    platforms[22] = new Platform(1900,247,100,20,[0,220,70],false); 
    platforms[23] = new Platform(1983,193,100,20,[0,220,70],false); 
    platforms[24] = new Platform(2067,134,100,20,[0,220,70],false); 
    platforms[25] = new Platform(2042,107,100,20,[0,220,70],false); 
    platforms[26] = new Platform(1907,56,100,20,[0,220,70],false); 
    platforms[27] = new Platform(1892,-23,100,20,[0,220,70],false); 
    platforms[28] = new Platform(2118,88,100,20,[0,220,70],false); 
    platforms[29] = new Platform(2217,91,345,20,[0,220,70],false); 
    platforms[30] = new Platform(2596,135,345,20,[0,220,70],false); 
    platforms[31] = new Platform(2859,245,345,20,[0,220,70],false); 
    platforms[32] = new Platform(3164,210,345,20,[0,220,70],false); 
    platforms[33] = new Platform(3479,157,345,20,[0,220,70],false); 
    platforms[34] = new Platform(3785,114,345,20,[0,220,70],false); 
    platforms[35] = new Platform(4063,157,345,20,[0,220,70],false); 
    platforms[36] = new Platform(4439,251,345,20,[0,220,70],false); 
    platforms[37] = new Platform(4769,367,345,20,[0,220,70],false); 
    platforms[38] = new Platform(5286,381,345,20,[0,220,70],false); 
    platforms[39] = new Platform(5645,329,345,30,[0,220,70],false); 
    platforms[40] = new Platform(5996,326,345,75,[0,220,70],false); 
    platforms[41] = new Platform(6340,275,345,125,[0,220,70],false); 
    platforms[42] = new Platform(612,111,15,15,[150,150,150],true); 
    platforms[43] = new Platform(44,371,15,15,[100,100,100],true); 

    eNumber = enemies.length;
    pNumber = platforms.length;
  } else if(level == 1){ //level 1
    enemies[0] = new Enemy(678,215,enemyTypes.slime); 
    enemies[1] = new Enemy(456,356,enemyTypes.slime); 
    enemies[2] = new Enemy(1113,380,enemyTypes.slime); 
    enemies[3] = new Enemy(1394,292,enemyTypes.slime);
    enemies[4] = new Enemy(1364,-110,enemyTypes.slime); 
    enemies[5] = new Enemy(1443,-110,enemyTypes.slime); 
    enemies[6] = new Enemy(1502,-280,enemyTypes.slime); 
    
    platforms[0] = new Platform(-200,145,30,255,[0,220,70],false,false); 
    platforms[1] = new Platform(-199,115,365,30,[0,220,70],false,false); 
    platforms[2] = new Platform(125,380,365,20,[0,220,70],false,false); 
    platforms[3] = new Platform(484,288,130,20,[0,220,70],false,false); 
    platforms[4] = new Platform(660,235,130,20,[0,220,70],false,false); 
    platforms[5] = new Platform(825,189,130,20,[0,220,70],false,false); 
    platforms[6] = new Platform(492,385,555,15,[100,100,100],true,false); 
    platforms[7] = new Platform(185,449,555,15,[100,100,100],true,false); 
    platforms[8] = new Platform(987,156,100,20,[0,220,70],false,false); 
    platforms[9] = new Platform(141,445,100,20,[0,220,70],false,false); 
    platforms[10] = new Platform(1067,174,20,225,[0,220,70],false,false); 
    platforms[11] = new Platform(1135,202,100,20,[0,220,70],false,false); 
    platforms[12] = new Platform(1265,278,100,20,[0,220,70],false,false); 
    platforms[13] = new Platform(1534,204,100,20,[0,220,70],false,false); 
    platforms[14] = new Platform(1366,314,100,20,[0,220,70],false,false); 
    platforms[15] = new Platform(1762,176,100,20,[0,220,70],false,false); 
    platforms[16] = new Platform(1887,102,100,20,[0,220,70],false,false); 
    platforms[17] = new Platform(1729,23,100,20,[0,220,70],false,false); 
    platforms[18] = new Platform(1581,-48,100,20,[0,220,70],false,false); 
    platforms[19] = new Platform(1333,-87,195,20,[0,220,70],false,false); 
    platforms[20] = new Platform(1136,-120,100,20,[0,220,70],false,false); 
    platforms[21] = new Platform(1272,-196,100,20,[0,220,70],false,false); 
    platforms[22] = new Platform(1426,-257,100,20,[0,220,70],false,false);
    platforms[23] = new Platform(1594,-290,100,20,[255,100,100],false,true);
    platforms[24] = new Platform(2234,1,20,400,[0,220,70],false,false);
    
    eNumber = enemies.length;
    pNumber = platforms.length;
  } else if(level == 2){ //level 2
    
    eNumber = enemies.length;
    pNumber = platforms.length;
  } else if(level == 3){ //level 3
    
    eNumber = enemies.length;
    pNumber = platforms.length;
  } else if(level == 4){ //level 4
    
    eNumber = enemies.length;
    pNumber = platforms.length;
  } else if(level == 5){ //level 5
    
    eNumber = enemies.length;
    pNumber = platforms.length;
  } else if(level == 6){ //level 6
    
    eNumber = enemies.length;
    pNumber = platforms.length;
  } else if(level == 7){ //level 7
    
    eNumber = enemies.length;
    pNumber = platforms.length;
  } else if(level == 8){ //level 8
    
    eNumber = enemies.length;
    pNumber = platforms.length;
  } else if(level == 9){ //level 9
    
    eNumber = enemies.length;
    pNumber = platforms.length;
  }
}


