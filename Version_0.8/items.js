 /*******************************************************************
File: items.js
Description: This file contains all items that will be in the game for the player to find, acquire, and equip.
Author: Aidan McRae
Version: 0.6
Author: Aidan McRae
Date: June 9th, 2026
*******************************************************************/

//creating items
const ITEM_TYPES = {WEAPON: 'weapon',ARMOUR:'armour',TRINKET:'trinket'};

const SWORD = createWeapon('sword_01','Iron Sword', 6,40,30,30);
const PLATE = createArmour('armour_01','Plate Armour',20,5);
const RING = createTrinket('trinket_01','Ring of Vigor', {maxHealth:+3});
