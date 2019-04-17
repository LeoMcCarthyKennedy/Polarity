var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var engine = new Engine();

const FPS = 60;

const WIDTH = window.innerWidth * 0.7;
const HEIGHT = WIDTH * 0.8;

var SCALE = 1;

var VOLUME = 1;

// MENU

var MENU_BACKGROUND = new Image();
MENU_BACKGROUND.src = "src/art/background.png";

var MENU_CLOUDS = new Image();
MENU_CLOUDS.src = "src/art/clouds.png";

var MENU_ICE = new Image();
MENU_ICE.src = "src/art/ice.png";

var MENU_BERG = new Image();
MENU_BERG.src = "src/art/iceberg.png";

var MENU_SONG = new Audio();
MENU_SONG.src = "src/audio/menu.mp3";

MENU_SONG.loop = true;

// GAME

var BRICK = new Image();
BRICK.src = "src/art/ice.png";

var BRICK2 = new Image();
BRICK2.src = "src/art/ice2.png";

var SNOW = new Image();
SNOW.src = "src/art/snow.png";

var FOG = new Image();
FOG.src = "src/art/fog.png";

var FOOT = new Image();
FOOT.src = "src/art/footprint.png"

var EXIT = new Image();
EXIT.src = "src/art/exit.png";

var KEY = new Image();
KEY.src = "src/art/key.png";

var UP1 = new Image();
UP1.src = "src/art/up1.png";

var DOWN1 = new Image();
DOWN1.src = "src/art/down1.png";

var LEFT1 = new Image();
LEFT1.src = "src/art/left1.png";

var RIGHT1 = new Image();
RIGHT1.src = "src/art/right1.png";

var UP2 = new Image();
UP2.src = "src/art/up2.png";

var DOWN2 = new Image();
DOWN2.src = "src/art/down2.png";

var LEFT2 = new Image();
LEFT2.src = "src/art/left2.png";

var RIGHT2 = new Image();
RIGHT2.src = "src/art/right2.png";

var BEAR1 = new Image();
BEAR1.src = "src/art/bear1.png";

var BEAR2 = new Image();
BEAR2.src = "src/art/bear2.png";

var PORTAL1 = new Image();
PORTAL1.src = "src/art/portal1.png";

var PORTAL2 = new Image();
PORTAL2.src = "src/art/portal2.png";

var CAVE_SONG = new Audio();
CAVE_SONG.src = "src/audio/cavern.mp3";

CAVE_SONG.loop = true;

var WIND = new Audio();
WIND.src = "src/audio/wind.mp3";

WIND.loop = true;

var KEY1 = new Audio();
KEY1.src = "src/audio/key.mp3";

var BEAR = new Audio();
BEAR.src = "src/audio/bear.wav";

var EBEAR1 = new Image();
EBEAR1.src = "src/art/ebear1.png";

var EBEAR2 = new Image();
EBEAR2.src = "src/art/ebear2.png";

var TEXTO = new Image();
TEXTO.src = "src/art/text.png";

canvas.width = WIDTH;
canvas.height = HEIGHT;

ctx.textAlign = "center";

setInterval(engine.update, 1000 / FPS);

document.addEventListener("keydown", function (event) {
    engine.input(event);
});