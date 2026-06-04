var rectHealth;
var rectDash;

//all of the UI stuff goes in here.
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
    text(`${float(player.dashCooldown/100)}s`,45,42);
  } else{
    text("Full",45,42);
  }
  
  drawShield(35,70,30,30,player.totalArmour);
  drawFist(80,70,32,player.weaponDamage);
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

  //shield body
  fill(140);
  stroke(80);
  strokeWeight(2);
  rectMode(CENTER);
  rect(0, 0, w, h, 4);

  //subtle inner border
  noFill();
  stroke(190);
  strokeWeight(1);
  rect(0, 0, w - 4, h - 4, 3);

  //center number
  noStroke();
  fill(30);
  textAlign(CENTER, CENTER);
  textSize(h * 0.5);
  text(value, 0, 1);

  pop();
}
function drawFist(x, y, size, value){
  push();
  translate(x, y);
  rectMode(CENTER);
  ellipseMode(CENTER);

  //Fist base
  fill(160, 120, 80);
  stroke(90);
  strokeWeight(2);
  rect(0, 0, size, size * 0.9, 6);

  //Knuckles 
  fill(190, 140, 90);
  noStroke();
  let k = size * 0.18;
  ellipse(-size * 0.22, -size * 0.25, k);
  ellipse(-size * 0.06, -size * 0.28, k);
  ellipse(size * 0.10, -size * 0.27, k);
  ellipse(size * 0.26, -size * 0.24, k);

  //Thumb 
  fill(170, 130, 85);
  stroke(90);
  strokeWeight(1.5);
  beginShape();
  vertex(-size * 0.30, size * 0.05);
  vertex(-size * 0.40, size * 0.15);
  vertex(-size * 0.35, size * 0.30);
  vertex(-size * 0.20, size * 0.25);
  vertex(-size * 0.22, size * 0.10);
  endShape(CLOSE);

  //Center number
  strokeWeight(2);
  noStroke();
  fill(30);
  textAlign(CENTER, CENTER);
  textSize(size * 0.6);
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


