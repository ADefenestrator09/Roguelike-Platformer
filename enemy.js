class Enemy{
  construcor(x,y,stats){
    this.pos = createVector(x,y);
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    
    this.maxHealth = stats.mh; //max health 
    this.w = stats.w; //width
    this.h = stats.h; //height
    this.d = stats.d; //damage
    this.r = stats.r; //reward
    this.s = stats.s; //speed 
    this.he = stats.he; //health
    this.path = []; //path
    this.c = stats.c; //colour
    
    //armour/health/attack stuff
    this.baseMaxHealth = maxHealth;
    this.currentHealth = this.baseMaxHealth;
    
    //recalculating stats
    this.recalcStats();
  }
  
  //updating everything, including gravity, moving, and dashing.
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
        if(plat.x < this.pos.x + this.pWidth && 
          plat.x + plat.w > this.pos.x &&
          plat.y < this.pos.y + this.pHeight &&
          plat.y + plat.h > this.pos.y){
          
          //resolve horizontal collisions
          if(Math.abs(this.vel.x) > VEL_THR){
            if(this.vel.x > 0){
              //when moving right, move player to left of platform
              this.pos.x = plat.x - this.pWidth;
            }else{
              //when moving left, move player to right side of platform
              this.pos.x = plat.x + plat.w;
            }
            this.vel.x = 0;
          } else {
            //for small horizontal movement, push out by minimal penetration
            let dx = (this.pos.x + this.pWidth/2) - (plat.x + plat.w/2); //direction x
            let overlapX = Math.abs(dx) - (this.pWidth/2 + plat.w/2);
            if(overlapX < 0) {
              if(dx > 0) this.pos.x = plat.x + plat.w;
              else this.pos.x = plat.x - this.pWidth;
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
        if(plat.x < this.pos.x + this.pWidth &&
          plat.x + plat.w > this.pos.x &&
          plat.y < this.pos.y + this.pHeight &&
          plat.y + plat.h > this.pos.y){
          
          //if falling, land on the top of the platform
          if(this.vel.y > VEL_THR){
            this.pos.y = plat.y - this.pHeight;
            this.vel.y = 0;
            this.onGround = true;
            this.dashCount = checkDash(this.dashCooldown,this.dashCount,this.onGround);
          }
          
          //if moving up, hit the bottom of the platform
          else if (this.vel.y < -VEL_THR){
            this.pos.y = plat.y + plat.h;
            this.vel.y = 0;
          }
          //when nearly stationary:
          else{
            let dy = (this.pos.y + this.pHeight/2) - (plat.y + plat.h/2);
            let overlapY = Math.abs(dy) - (this.pHeight/2 + plat.h/2);
            if(overlapY < 0){
              if(dy < 0) { //if player's center is above the platforms center, snap on to the top.
                this.pos.y = plat.y - this.pHeight;
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
    if(!this.onGround && this.pos.y + this.pHeight > 400){
      this.pos.y = 400-this.pHeight;
      this.vel.y = 0;
      this.onGround = true;
      this.dashCount = checkDash(this.dashCooldown, this.dashCount, this.onGround)
    }
    
    //world ceiling collision at y = -400;
    if(!this.onGround & this.pos.y < -400){
      this.pos.y = -400;
      this.vel.y = 0;
    }
    
    //jumping
    if(needToJump && this.onGround){
      this.vel.y -=10;
      this.onGround = false;
    }
  }
  
  recalcStats(){
    //change current health to new max health
    if (this.currentHealth != this.maxHealth){
      this.currentHealth = this.maxHealth;
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
  
  //attack system
  attack(player){
    if(player.pos.x < this.pos.x + this.w && 
      player.pos.x + player.pWidth > this.pos.x &&
      player.pos.y < this.pos.y + this.h &&
      player.pos.y + player.pHeight > this.pos.y){
      hit = true;
      return damage,hit;
    }
    //going to implement a system for if it comes in contact with the player that it does damage.
  }
 
  //death
  die(){
    console.log("Enemy Died");
    //need to handle death later
  }
  
  
    
  //drawing the player
  eDraw(){
    stroke(0);
    fill(220);
    rect(this.pos.x,this.pos.y,this.pWidth,this.pHeight);
  }
}
