/*******************************************************************
File: platforms.js
Description: This file defines the platform class, which holds the statistics of each of the platfors to be used later for collision, also drawing the platforms.
Version: 0.6
Author: Aidan McRae
Date: June 9th, 2026
*******************************************************************/

class Platform{
  constructor(x,y,w,h,c,isSpike,isObjective){
    this.x = x; //x pos
    this.y = y; //y pos
    this.w = w; //width
    this.h = h; //height
    this.c = c; //colour
    this.iS = isSpike; //checking if it is a spike
    this.iO = isObjective; //checking if it is an objective
    
    this.info = `  platforms[${pNumber}] = new Platform(${x},${y},${w},${h},[${c}],${isSpike},${isObjective});`;
  }
  
  oDraw(){ //drawing the platforms
    stroke(0);
    fill(this.c[0],this.c[1],this.c[2]);
    rect(this.x,this.y,this.w,this.h);
    
  }
}
