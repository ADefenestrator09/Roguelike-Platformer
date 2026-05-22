class Platform{
  constructor(x,y,w,h,c){
    this.x = x; //x pos
    this.y = y; //y pos
    this.w = w; //width
    this.h = h; //height
    this.c = c; //colour
    this.info = [x,y,w,h]
  }
  collision(playerX,playerY,playerW,playerH,playerVelY,playerVelX){
    let dx = playerX + playerW / 2 - this.x - this.w/2; //direction of x (checking if collision is on right or left)
    let dy = playerY + playerH / 2 - this.y - this.h/2; //direction of y
    let overlapX = Math.abs(dx) - (playerW/2 + this.w/2); //checking the overlap depth on the x axis
    let overlapY = Math.abs(dy) - (playerH/2 + this.h/2); //checking the overlap depth on the y axis
    
    if(overlapX < 0 && overlapY < 0){ //checking for collision (if overlap is negative, there is a collision)
      let minOverlap = Math.min(Math.abs(overlapX),Math.abs(overlapY)); //checking the lowest overlap to see which side to position to
      
      if(playerVelY > 0.1 && Math.abs(overlapY) < Math.abs(overlapX)){ //top collision
        return {side:"top",pushY:this.y-playerH};
      } 
      else if(Math.abs(playerVelX)>0.1 && Math.abs(overlapX) < Math.abs(overlapY)){ //side collision
        if(dx > 0){ //if the collision is on the right:
          return {side:"right",pushX:this.x+this.w};
        } else{ //otherwise, the collision is on the left
          return {side:"left",pushX:this.x-playerW};
        }
      } 
      else if (playerVelY < -0.1){ //if going down
        //bottom collision
        return {side:"bottom",pushY:this.y+this.h};
      }
    }
    return null; //otherwise, return nothing
  }
  oDraw(){ //drawing the platforms
    stroke(0);
    fill(this.c[0],this.c[1],this.c[2]);
    rect(this.x,this.y,this.w,this.h);
    
  }
}