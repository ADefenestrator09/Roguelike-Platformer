var rectHealth;

//all of the UI stuff goes in here.
function drawUI(){
  rectHealth = player.currentHealth/player.maxHealth*100
  
  fill(0,0,0,0)
  rect(10,10,100,15);
  fill(255,0,0); noStroke();
  rect(10,10,rectHealth,15)
  fill(0); textSize(12); stroke(0); strokeWeight(0);
  text(`HP: ${player.currentHealth} / ${player.maxHealth}`,30,22);
  text(`Armour: ${player.totalArmour}`,10,36);
  text(`Weapon Dmg: ${player.weaponDamage}`,10,52);
  strokeWeight(1);
}

