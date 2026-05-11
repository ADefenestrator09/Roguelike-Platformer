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
  update(gravity,jumpPressed,dashPressed){
    
    //updating gravity
    this.vel.y += gravity;
    
    //horizontal movement- figured this way out to make one line if statements. Much cleaner.
    if(keyIsDown(65)){ //A
      this.vel.x-=0.5;
      this.facingRight = false;
    } 
    if(keyIsDown(68)){ //D
      this.vel.x+=0.5;
      this.facingRight = true;
    } 
    
    //frictionnnnnn
    this.vel.x *=0.85;
    
    //update position
    this.pos.add(this.vel);
    
    //ground collision- currently for y=400, where there are no platforms yet.
    if(this.pos.y + this.pHeight > 400){
      this.pos.y = 400-this.pHeight;
      this.vel.y = 0;
      this.onGround = true;
      
      //refilling dash if on ground and dash cooldown == 0
      if(this.dashCooldown === 0 && this.dashCount < 1){
        this.dashCount = 1;
      }
      
    } else{
      this.onGround = false;
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
      
      this.dashCount--;
      this.dashCooldown = this.dashCooldownMax;
    }
    this.vel.x += dashPower;
  }
  //drawing the player
  pDraw(){
    rect(this.pos.x,this.pos.y,this.pWidth,this.pHeight);
  }
}