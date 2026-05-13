//all of the UI stuff goes in here.
function drawUI(){
  fill(255); textSize(12);
  text(`HP: ${player.currentHealth} / ${player.maxHealth}`,10,20);
  text(`Armour: ${player.totalArmour}`,10,36);
  text(`Weapon Dmg: ${player.weaponDamage}`,10,52);
}

