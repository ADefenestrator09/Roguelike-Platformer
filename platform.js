/*******************************************************************
File: platforms.js
Description: This file defines the platform class, which holds the statistics of each of the platfors to be used later for collision, also drawing the platforms.
Author: Aidan McRae
Version: 0.6
Date: June 9th, 2026
*******************************************************************/

class Platform{
  constructor(x,y,w,h,c,isSpike){
    this.x = x; //x pos
    this.y = y; //y pos
    this.w = w; //width
    this.h = h; //height
    this.c = c; //colour
    this.iS = isSpike; //checking if it is a spike
    
    this.info = `  platforms[${number}] = new Platform(${x},${y},${w},${h},[${c}],${isSpike});`;
  }
  
  oDraw(){ //drawing the platforms
    stroke(0);
    fill(this.c[0],this.c[1],this.c[2]);
    rect(this.x,this.y,this.w,this.h);
    
  }
}