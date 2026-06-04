var build = false;
var platforms = [];
var c = [0,220,70];
var pWidth = 100;
var pHeight = 20;
var newPlatform;


var enemies = [];
var isSpike = false;

var platLen = platforms.length;
var number = platLen;



function loadLevel(){
  if(level == 0){
    platforms[0] = new Platform(300,380,100,20,[0,220,70],false);
    platforms[1] = new Platform(400,300,20,100,[0,220,70],false);
    platforms[2] = new Platform(400,300,100,20,[0,220,70],false);
    platforms[3] = new Platform(493,238,100,20,[0,220,70],false);
    platforms[4] = new Platform(623,177,100,20,[0,220,70],false); 
    platforms[5] = new Platform(736,113,100,20,[0,220,70],false); 
    platforms[6] = new Platform(852,24,100,20,[0,220,70],false); 
    platforms[7] = new Platform(965,-55,100,20,[0,220,70],false); 
    platforms[8] = new Platform(1077,-120,100,20,[0,220,70],false); 
    platforms[9] = new Platform(1174,-193,100,20,[0,220,70],false); 
    platforms[10] = new Platform(1268,-277,100,20,[0,220,70],false); 
    platforms[11] = new Platform(1387,-336,100,20,[0,220,70],false); 
    platforms[12] = new Platform(72,248,100,20,[0,220,70],false); 
    platforms[13] = new Platform(853,105,100,20,[0,220,70],false); 
    platforms[14] = new Platform(975,82,100,20,[0,220,70],false); 
    platforms[15] = new Platform(1092,134,100,20,[0,220,70],false); 
    platforms[16] = new Platform(1201,215,100,20,[0,220,70],false); 
    platforms[17] = new Platform(1316,265,100,20,[0,220,70],false); 
    platforms[18] = new Platform(1437,335,100,20,[0,220,70],false); 
    platforms[19] = new Platform(1567,374,100,20,[0,220,70],false); 
    platforms[20] = new Platform(1694,332,100,20,[0,220,70],false); 
    platforms[21] = new Platform(1794,305,100,20,[0,220,70],false); 
    platforms[22] = new Platform(1900,247,100,20,[0,220,70],false); 
    platforms[23] = new Platform(1983,193,100,20,[0,220,70],false); 
    platforms[24] = new Platform(2067,134,100,20,[0,220,70],false); 
    platforms[25] = new Platform(2042,107,100,20,[0,220,70],false); 
    platforms[26] = new Platform(1907,56,100,20,[0,220,70],false); 
    platforms[27] = new Platform(1892,-23,100,20,[0,220,70],false); 
    platforms[28] = new Platform(2118,88,100,20,[0,220,70],false); 
    platforms[29] = new Platform(2217,91,345,20,[0,220,70],false); 
    platforms[30] = new Platform(2596,135,345,20,[0,220,70],false); 
    platforms[31] = new Platform(2859,245,345,20,[0,220,70],false); 
    platforms[32] = new Platform(3164,210,345,20,[0,220,70],false); 
    platforms[33] = new Platform(3479,157,345,20,[0,220,70],false); 
    platforms[34] = new Platform(3785,114,345,20,[0,220,70],false); 
    platforms[35] = new Platform(4063,157,345,20,[0,220,70],false); 
    platforms[36] = new Platform(4439,251,345,20,[0,220,70],false); 
    platforms[37] = new Platform(4769,367,345,20,[0,220,70],false); 
    platforms[38] = new Platform(5286,381,345,20,[0,220,70],false); 
    platforms[39] = new Platform(5645,329,345,30,[0,220,70],false); 
    platforms[40] = new Platform(5996,326,345,75,[0,220,70],false); 
    platforms[41] = new Platform(6340,275,345,125,[0,220,70],false); 
    platforms[42] = new Platform(612,111,15,15,[150,150,150],true); 
    platforms[43] = new Platform(44,371,15,15,[100,100,100],true); 

  }
}
//platforms

