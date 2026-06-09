/*******************************************************************
File: player.js
Description: This file defines the player class, which holds nearly everything that effects the player, including movement, damage, and items. It is completely original.
Author: Aidan McRae
Version: 0.6
Date: June 9th, 2026
*******************************************************************/

class Player{
  constructor(x,y, playerClass = 'swordsman'){
    //variables of the player
    this.pWidth = 20;
    this.pHeight = 30;
    this.pos = createVector(x,y);
    this.vel = createVector(0,0);
    this.onGround = false;
    this.facingRight = true;
    this.dashCount = 1;
    this.dashCooldown = 0;
    this.dashCooldownMax = 60;
    
    //I got coyote time from here: https://www.gdquest.com/library/glossary/coyote_time/
    this.coyoteTimeMax = 6;
    this.coyoteTimer = 0;
    
    //armour/health/attack stuff
    this.baseMaxHealth = 20;
    this.currentHealth = this.baseMaxHealth;
    
    //classes
    const classBase = {
      tank: {baseArmour:8, baseDamage:4},
      swordsman: {baseArmour:3, baseDamage:6},
      ranged: {baseArmour:3, baseDamage: 5},
      mage: {baseArmour:0, baseDamage: 4}
    } [playerClass] || {baseArmour:0,baseDamage:5} //Either it uses the class equipped or uses a fallback if undefined, which has a base armour of 0 and a base damage of 5.
    
    this.baseArmour = classBase.baseArmour;
    this.baseDamage = classBase.baseDamage;
    
    //making equipment slots
    this.equipped = {
      weapon: null,
      armour: null,
      trinkets: [null,null]
    };
    
    //stats, which will be filled later by recalcStats
    this.totalArmour = this.baseArmour;
    this.maxHealth = this.baseMaxHealth;
    this.weaponDamage = this.baseDamage;
    this.critChance = 0;
    
    //recalculating stats
    this.recalcStats();
  }
  
  recalcStats(){
    //starting from base stats
    this.totalArmour = this.baseArmour;
    this.maxHealth = this.baseMaxHealth;
    this.weaponDamage = this.baseDamage;
    this.critChance = 0;
    
    //armour slot
    if(this.equipped.armour){
      const a = this.equipped.armour.stats;
      if(a.armour){
        this.totalArmour += a.armour;
      }
      if(a.healthBonus){
        this.maxHealth += a.healthBonus;
      }
    }
    
    //weapon slot
    if(this.equipped.weapon){
      const w = this.equipped.weapon.stats;
      if(w.damage) {
        this.weaponDamage = this.baseDamage + w.damage;
      }
    }
    
    //trinkets
    for(let t of this.equipped.trinkets){
      if(!t){
        continue;
      } else{
        const s = t.stats;
        if (s.armour) {
          this.totalArmour += s.armour;
        }
        if(s.maxHealth){
          this.maxHealth += s.maxHealth;
        }
        if(s.crit){
          this.critChance += s.crit;
        }
      }
    }
    
    //change current health to new max health
    if (this.currentHealth != this.maxHealth){
      this.currentHealth = this.maxHealth;
    }
  }
  
  //equipping items
  equip(item){ 
    if(!item){ //checking if there are no items
      return;
    }
    if(item.type === ITEM_TYPES.WEAPON){ //if it is a weapon
      this.equipped.weapon = item;
    } else if(item.type === ITEM_TYPES.ARMOUR){
      this.equipped.armour = item;
    } else if (item.type === ITEM_TYPES.TRINKET){
      //finding index
      let index = this.equipped.trinkets.findIndex(t => t === null);
      if(index === -1){
        index = 0; //if there are no open spots, take the oldest one.
      }
      this.equipped.trinkets[index] = item;
    }
    this.recalcStats();
  }
  
  //unequipping stuff and nice 1 line if statements
  unequip(slot){
    if (slot === 'weapon') this.equipped.weapon = null;
    if (slot === 'armour') this.equipped.armour = null;
    if (slot === 'trinket1') this.equipped.trinkets[0] = null;
    if (slot === 'trinket2') this.equipped.trinkets[1] = null;
    this.recalcStats();
  }
  
  //damage formula for taking damage
  
  takeDamage(incoming) {
    //reduced damage = incoming * (1-armour)/(armour+100)
    const factor = this.totalArmour / (this.totalArmour + 100);
    const reduced = Math.max(0,incoming * (1-factor));
    const lost = Math.floor(reduced);
    this.currentHealth -= lost;
    if(this.currentHealth <= 0){
      this.currentHealth = 0;
      this.die();
    }
    return lost; //saying how much HP is lost
  }
  
  //attack system
  attack(){
    const base = this.weaponDamage;
    const critRoll = Math.random() < this.critChance;
    return critRoll ? Math.floor(base * 1.5) : base; //checks if critRoll is true and then off of that, it either applies the base attack damage or the crit attack damage.
  }
  
  //heal function
  heal(amount) {
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
  }
  
  //death
  die(){
    this.pos.x = 100;
    this.pos.y = 400;
    this.currentHealth = this.maxHealth;
    dead = true;
  }
  
  //updating everything, including gravity, moving, and dashing.
  update(gravity,jumpPressed,dashPressed,platforms){
    //updating gravity
    this.vel.y += gravity;
    
    //horizontal movement
    if(keyIsDown(65)||keyIsDown(37)){ //A
      this.vel.x-=0.5;
      this.facingRight = false;
    } 
    if(keyIsDown(68)||keyIsDown(39)){ //D
      this.vel.x+=0.5;
      this.facingRight = true;
    } 
    
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
          
          //taking damage if it is a spike horizontally
          if(plat.iS){
            spikeDamage = true;
          }
          
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
          
          //spike damage vertically
          if(plat.iS){
            spikeDamage = true;
          }
          
          //if falling, land on the top of the platform
          if(this.vel.y > VEL_THR){
            this.pos.y = plat.y - this.pHeight;
            this.vel.y = 0;
            this.onGround = true;
            this.coyoteTimer = this.coyoteTimeMax;
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
                this.coyoteTimer = this.coyoteTimeMax;
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
    
    //enemy collision (only X value colision because I don't want the player to be able to land on the enemy)
    if(enemies){
      for(let enemy of enemies){
        //simple test for checking overlap
        if(enemy.pos.x < this.pos.x + this.pWidth && 
          enemy.pos.x + enemy.w > this.pos.x &&
          enemy.pos.y < this.pos.y + this.pHeight &&
          enemy.pos.y + enemy.h > this.pos.y){
          
          //taking damage if in contact with enemy
          if(edCooldown == 0){
            this.takeDamage(enemy.d);
            edCooldown = 45;
          }
          
          //resolve horizontal collisions
          if(Math.abs(this.vel.x) > VEL_THR){
            if(this.vel.x > 0){
              //when moving right, move player to left
              this.pos.x = enemy.pos.x - this.pWidth;
            }else{
              //when moving left, move player to right 
              this.pos.x = enemy.pos.x + enemy.w;
            }
            this.vel.x = 0;
          } else {
            //for small horizontal movement, push out by minimal penetration
            let dx = (this.pos.x + this.pWidth/2) - (enemy.pos.x + enemy.w/2); //direction x
            let overlapX = Math.abs(dx) - (this.pWidth/2 + enemy.w/2);
            if(overlapX < 0) {
              if(dx > 0) this.pos.x = enemy.pos.x + enemy.w;
              else this.pos.x = enemy.pos.x - this.pWidth;
              this.vel.x = 0;
            }
          }
          break; //once X is resolved, stop checking other platforms for the X value.
        }
      }
    }  
    
    //world floor collision
    if(!this.onGround && this.pos.y + this.pHeight > 400){
      this.pos.y = 400-this.pHeight;
      this.vel.y = 0;
      this.onGround = true;
      this.coyoteTimer = this.coyoteTimeMax;
      this.dashCount = checkDash(this.dashCooldown, this.dashCount, this.onGround)
    }
    
    //world ceiling collision at y = -400;
    if(!this.onGround && this.pos.y < -400){
      this.pos.y = -400;
      this.vel.y = 0;
    }
    if(!this.onGround && this.coyoteTimer > 0){
      this.coyoteTimer--;
    }
    
    //jumping
    if(jumpPressed && (this.onGround || this.coyoteTimer > 0)){
      this.vel.y -=10;
      this.onGround = false;
      this.coyoteTimer = 0;
    }
    
    //dashing and cooldown
    if(this.dashCooldown > 0) this.dashCooldown--;
      
    let dashPower = 0;
    if(dashPressed && this.dashCount > 0 && this.dashCooldown === 0){
      //I found this and it is a really nice way of checking true or false on something and assigning a value to a variable in a very concise way.
      dashPower = this.facingRight ? 12:-12;
      
      //if we dash, reduce dash count and turn on cooldown
      this.dashCount--;
      this.dashCooldown = this.dashCooldownMax;
    }
    this.vel.x += dashPower;
  }
    
  //drawing the player
  pDraw(){
    stroke(0);
    fill(220);
    rect(this.pos.x,this.pos.y,this.pWidth,this.pHeight);
  }
}