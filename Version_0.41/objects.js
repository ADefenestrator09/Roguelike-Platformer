var build = false;
var platforms = [];
var c = [0,220,70];
var pWidth = 100;
var pHeight = 20;
var newPlatform;
var number = 4;




//platforms

if(level == 0){
  platforms[0] = new Platform(300,380,100,20,c);
  platforms[1] = new Platform(400,300,20,100,c);
  platforms[2] = new Platform(400,300,100,20,c);
  platforms[3] = new Platform(493,238,100,20,c);
  platforms[4] = new Platform(623,177,100,20,c); 
  platforms[5] = new Platform(736,113,100,20,c); 
  platforms[6] = new Platform(852,24,100,20,c); 
  platforms[7] = new Platform(965,-55,100,20,c); 
  platforms[8] = new Platform(1077,-120,100,20,c); 
  platforms[9] = new Platform(1174,-193,100,20,c); 
  platforms[10] = new Platform(1268,-277,100,20,c); 
  platforms[11] = new Platform(1387,-336,100,20,c); 
}
