//creating items
const ITEM_TYPES = {WEAPON: 'weapon',ARMOUR:'armour',TRINKET:'trinket'};

//function for creating weapons, with id,name,and damage.
function createWeapon(id,name,damage){
  return {id,name,type: ITEM_TYPES.WEAPON,stats:{damage}};
}

//function for creating armour with id,name,armourValue,and healthBonus
function createArmour(id,name,armourValue,healthBonus = 0){
  return {id,name,type: ITEM_TYPES.ARMOUR,stats:{armour:armourValue,healthBonus}};
}

//fuction for creating trinkets, including id,name,and modifiers
function createTrinket(id,name,modifiers){
  //for example, the modifiers could be modifiers: {armour: 2, maxHealth: 5, crit: 0.05, moveSpeed: 0.1}, etc
  return {id,name,type: ITEM_TYPES.TRINKET,stats:modifiers || {} };
}

const SWORD = createWeapon('sword_01','Iron Sword', 6);
const PLATE = createArmour('armour_01','Plate Armour',20,5);
const RING = createTrinket('trinket_01','Ring of Vigor', {maxHealth:+3});