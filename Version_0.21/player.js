class Player{
  constructor(x,y){
    //variables of the player
    this.pWidth = 20;
    this.pHeight = 30;
    this.pos = createVector(x,y);
    this.vel = createVector(0,0);
    this.onGround = false;
    this.facingRight = true;
    this.dashCount = 1;
    this.dashCooldown = 0;
    this.dashCooldownMax = 30;
  }
  
  //updating everything, including gravity, moving, and dashing.
  update(gravity,jumpPressed,dashPressed,platforms){
    
    //function for checking if we can give the player a dash.
    function checkDash(cooldown,count,onGround){
      if(cooldown === 0 && count < 1 && onGround == true){
        count = 1;
      }
      return count;
    }
    
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
    
    //update position and setting onGround to false
    this.pos.add(this.vel);
    this.onGround = false;
    
    //collision logic finally!
    if(platforms && this.vel.y > 0 || !this.onGround){ //check if there are any platforms and if moving or not on ground
      for(let plat of platforms){ //checking every platform (might have to check only platforms in a certain radius when we get too many platforms)
        let collision = plat.collision(this.pos.x,this.pos.y,this.pWidth,this.pHeight,this.vel.y,this.vel.x);

        if(collision){ //if there is a collision
          if (collision.side === "top"){ //if the side is on the top, change to position to the top, velocity to 0, onGround to true, and check if we can add a dash to our count.
            this.pos.y = collision.pushY;
            this.vel.y = 0;
            this.onGround = true;
            this.dashCount = checkDash(this.dashCooldown, this.dashCount, this.onGround);
            break;
          }else if (collision.side === "left" || collision.side === "right"){ //if the side is left or right, move position to side but bounce back a bit with the velocity backwards.
            this.pos.x = collision.pushX;
            this.vel.x *= -0.1;
          } else if (collision.side === "bottom"){ //if the side is the bottom, just change the position to the bottom and change velocity y to zero.
            this.pos.y = collision.pushY;
            this.vel.y = 0;
          }
          break;
        }
      }
    }

    //ground collision
    if(!this.onGround && this.pos.y + this.pHeight > 400){
      this.pos.y = 400-this.pHeight;
      this.vel.y = 0;
      this.onGround = true;
      this.dashCount = checkDash(this.dashCooldown, this.dashCount, this.onGround)
      
    }
    
    //jumping
    if(jumpPressed && this.onGround){
      this.vel.y -=10;
      this.onGround = false;
    }
    
    //dashing and cooldown
    if(this.dashCooldown > 0){
      this.dashCooldown--;
    } 
    
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
    fill(220);
    rect(this.pos.x,this.pos.y,this.pWidth,this.pHeight);
  }
}