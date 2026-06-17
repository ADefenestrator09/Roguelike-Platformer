/*******************************************************************
File: enemy.js
Description: This file defines the enemy class, which holds nearly everything that effects the enemy, including movement, damage, and pathfinding. It is completely original.
Version: 0.6
Author: Aidan McRae
Date: June 9th, 2026
*******************************************************************/

class Enemy{
  constructor(x,y,stats){
    //enemy constructor variables
    this.pos = createVector(x,y);
    this.vel = createVector(0,0);
    
    //starting x/y
    this.startingX = x;
    this.startingY = y;
    
    //stats
    this.maxHealth = stats.maxHealth; //max health 
    this.w = stats.eWidth; //width
    this.h = stats.eHeight; //height
    this.d = stats.damage; //damage
    this.r = stats.reward; //reward
    this.s = stats.speed; //speed 
    this.c = stats.colour; //colour
  
    this.onGround = false;
    this.alive = true;
    this.currentHealth = this.maxHealth;
    
    //patrolling variables
    this.direction = 1; //1 is right, -1 is left;
    this.turned = false;
    this.patrollingDistance = 400;
    this.savedXVal = this.pos.x;
    this.savedDirection = this.direction;
    this.wasChasing = false;
    
    
  }
  
  //updating everything, including gravity and moving
  update(gravity,platforms,player){
    if(!this.alive) return;
    
    
    const VEL_THR = 0.05 //small threshold for stopping detecting collisions when almost stationary.
    
    const MAX_STEP = 50; //for avoiding accidental extreme tunneling thorough platforms

    //updating gravity
    this.vel.y += gravity;
    
    //frictionnnnnn
    this.vel.x *=0.85;
    
    //stopping large steps, which would cause problems. 
    //constrain is a really nice p5 function that basically makes sure that the numbers given to the function are kept between two values. It is really useful here, as it makes sure that the jump in vel.x and vel.y is never more than the max step limit.
    this.vel.x = constrain(this.vel.x, -MAX_STEP,MAX_STEP)
    this.vel.y = constrain(this.vel.y, -MAX_STEP,MAX_STEP)
    
    this.pos.x += this.vel.x;
    
    //X value collision
    if(platforms){
      for(let plat of platforms){
        //simple test for checking overlap
        if(plat.x < this.pos.x + this.w && 
          plat.x + plat.w > this.pos.x &&
          plat.y < this.pos.y + this.h &&
          plat.y + plat.h > this.pos.y){
          
          //resolve horizontal collisions
          if(Math.abs(this.vel.x) > VEL_THR){
            if(this.vel.x > 0){
              //when moving right, move player to left of platform
              this.pos.x = plat.x - this.w;
            }else{
              //when moving left, move player to right side of platform
              this.pos.x = plat.x + plat.w;
            }
            this.vel.x = 0;
          } else {
            //for small horizontal movement, push out by minimal penetration
            let dx = (this.pos.x + this.w/2) - (plat.x + plat.w/2); //direction x
            let overlapX = Math.abs(dx) - (this.w/2 + plat.w/2);
            if(overlapX < 0) {
              if(dx > 0) this.pos.x = plat.x + plat.w;
              else this.pos.x = plat.x - this.w;
              this.vel.x = 0;
            }
          }
          break; //once X is resolved, stop checking other platforms for the X value.
        }
      }
    }
    
    //Y value collision
    this.pos.y += this.vel.y;
    this.onGround = false; //only set to true if the player lands.
    
    if(platforms) {
      for(let plat of platforms){
        if(plat.x < this.pos.x + this.w &&
          plat.x + plat.w > this.pos.x &&
          plat.y < this.pos.y + this.h &&
          plat.y + plat.h > this.pos.y){
          
          //if falling, land on the top of the platform
          if(this.vel.y > VEL_THR){
            this.pos.y = plat.y - this.h;
            this.vel.y = 0;
            this.onGround = true;
          }
          
          //if moving up, hit the bottom of the platform
          else if (this.vel.y < -VEL_THR){
            this.pos.y = plat.y + plat.h;
            this.vel.y = 0;
          }
          //when nearly stationary:
          else{
            let dy = (this.pos.y + this.h/2) - (plat.y + plat.h/2);
            let overlapY = Math.abs(dy) - (this.h/2 + plat.h/2);
            if(overlapY < 0){
              if(dy < 0) { //if player's center is above the platforms center, snap on to the top.
                this.pos.y = plat.y - this.h;
                this.vel.y = 0;
                this.onGround = true;
              } else{
                this.pos.y = plat.y + plat.h;
                this.vel.y = 0;
              }
            }
          }
          break; //if y is resolved, you don't need to check any more platforms.
        }
      }
    }
    
    //world floor collision
    if(!this.onGround && this.pos.y + this.h > 400){
      this.pos.y = 400-this.h;
      this.vel.y = 0;
      this.onGround = true;
    }
  }
  
  //patrolling for the enemy
  patrol(player,platforms){
    const DETECTRANGE = 150;
    const LEEWAY = 5;
    let shouldTurn = false;

    //if the player is within the detect range
    if(Math.abs(player.pos.x - this.pos.x) <= DETECTRANGE && Math.abs(player.pos.y - this.pos.y)<=DETECTRANGE && player.pos.y <= this.pos.y - 10){
      
      //this is for moving back to the direction that it was heading in prior to chasing the player
      if(!this.wasChasing){
        this.savedDirection = this.direction;
      }
      
      this.wasChasing = true;
      if (player.pos.x > this.pos.x){
        this.direction = 1; //turn towards the player if it's to the right
      } else{
        this.direction = -1; //same for the left
      }
      this.vel.x = this.direction * this.s; //move in the direction needed
    } 
    
    else { //if it is not in the detect range
      //if it is on the ground
      if(this.onGround){
        
        if(this.wasChasing){ //if it was chasing and now it's not, set the direction back to the original direction 
          this.direction = this.savedDirection;
          this.wasChasing = false;
        }

        let checkX;
        if (this.direction > 0) { //if moving right, thde front x position is equal to the x value plus width plus the leeway.
          checkX = this.pos.x + this.w + LEEWAY;
        } else {
          checkX = this.pos.x - LEEWAY; //otherwise, if moving left, it is just the x position minus the leeway
        }

        let checkY = this.pos.y + this.h + 1; //the y position just under it's foot (to check whether there is a platform in front)

        let onPlatformAhead = false;

        for(let plat of platforms){ //checking if point in front of enemy is still over solid ground. If not, it is about to walk over an edge.
          let isOverPlatform = checkX > plat.x && checkX < plat.x + plat.w;
          let isAtPlatformTop = checkY >= plat.y && checkY <= plat.y + 10;

          if(isOverPlatform && isAtPlatformTop) {
            onPlatformAhead = true;
            break;
          }
        }

        if(!onPlatformAhead && !this.turned){ //if there is no platform ahead of the enemy, it turns so it doesn't fall off
          shouldTurn = true;
          this.turned = true;
        }
        
        if(onPlatformAhead){
          this.turned = false;
        }

        for(let plat of platforms){//this just checks if it is going to move into the platform while moving right or left and resolves it by turning if true
          let movingRightIntoPlat = this.direction > 0 && this.pos.x + this.w <= plat.x && this.pos.x + this.w + this.s >= plat.x && this.pos.y + this.h > plat.y && this.pos.y < plat.y + plat.h; 

          let movingLeftIntoPlat = this.direction < 0 && this.pos.x >= plat.x + plat.w && this.pos.x + this.s <= plat.x + plat.w && this.pos.y + this.h > plat.y && this.pos.y < plat.y + plat.h;

          if(movingRightIntoPlat || movingLeftIntoPlat){
            shouldTurn = true;
            this.savedXVal = this.pos.x;
            break;
          }
          
          if(this.savedXVal + this.patrollingDistance <= this.pos.x || this.savedXVal - this.patrollingDistance >= this.pos.x){ //this is for turning after a set distance.
            shouldTurn = true;
          }
        }
      }

      if(shouldTurn){ //this inverts the direction that the enemy is going in
        this.direction *= -1;
      }
      this.vel.x = this.direction * this.s; //the velocity is then changed to the direction times the speed of the enemy.
    }
  }
  
  //damage formula for taking damage
  takeDamage(incoming) {
    this.currentHealth -= incoming;
    if(this.currentHealth <= 0){
      this.currentHealth = 0;
      this.die();
    }
    return incoming; //saying how much HP is lost
  }
  
  //death
  die(){
    console.log("Enemy Died");
    this.alive = false;
    //need to handle death later
  }
  
  //resetting stats if the player dies
  reset(){
    this.alive = true;
    this.currentHealth = this.maxHealth;
    this.pos.x = this.startingX;
    this.pos.y = this.startingY;
  }

  //drawing the enemy
  eDraw(){
    stroke(0);
    fill(this.c[0],this.c[1],this.c[2],this.c[3]);
    rect(this.pos.x,this.pos.y,this.w,this.h);
  }
}
