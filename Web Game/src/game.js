class Game {

    // 0 - Empty
    // 1 - Wall
    // 2 - Footprint
    // 3 - Bear
    // 4 - Enemy
    // 5 - Key
    // 6 - Portal
    // 10 - Exit

    static engine;

    static transition;

    static paused;
    static menuOption;

    static map;

    static mapSize;

    static playerX;
    static playerY;

    static cave;
    static score;

    static fogBufferX;
    static fogBufferY;

    static pseudoTime;
    static time;

    static reset;

    static keys;

    static jumps;

    static cubSave;

    static playerFace;

    static playerSprite;

    static bearSprite;

    static enemySprite;

    static animationTime;

    static portalSprite;

    static bearsArray;

    static lose;

    static enemyX;
    static enemyY;

    // 0 - Up
    // 1 - Down
    // 2 - Left
    // 3 - Right

    constructor(e) {
        Game.engine = e;

        Game.transition = false;
        Game.paused = false;

        Game.menuOption = 0;

        Game.map = [];

        Game.mapSize = 45;

        Game.playerX = 1;
        Game.playerY = 1;

        Game.cave = 1;
        Game.score = 0;

        Game.fogBufferX = 0;
        Game.fogBufferY = 0;

        Game.pseudoTime = 100;
        Game.time = 100;

        Game.reset = true;

        Game.keys = 0;
        Game.jumps = 0;
        Game.cubSave = 0;

        Game.lose = false;

        Game.playerFace = 1;
        Game.playerSprite = DOWN1;

        Game.portalSprite = PORTAL1;

        Game.animationTime = 0;

        Game.bearsArray = [];

        Game.enemyX = 0;
        Game.enemyY = 0;
    }

    generateMap(size) {
        for (var y = 0; y < size; y++) {
            Game.map[y] = [];
            for (var x = 0; x < size; x++) {
                Game.map[y][x] = 1;
            }
        }

        for (var x = 1; x < size - 1; x += 2) {
            if (x == 1) {
                for (var y = 1; y < size - 1; y++) {
                    Game.map[x][y] = 0;
                }
            } else {

                var start = 0;

                for (var y = 1; y < size - 1; y += 2) {
                    if (Math.random() >= 0.5 && y < size - 2) {
                        Game.map[x][y] = 0;
                        Game.map[x][y + 1] = 0;
                    } else {

                        var end = y;

                        Game.map[x][y] = 0;

                        var north = Math.round(Math.random() * (end - start) + start);

                        if (north % 2 == 0) {
                            north++;
                        }

                        Game.map[x - 1][north] = 0;

                        start = end + 1;
                    }

                }
            }
        }

        for (y = 0; y < size; y++) {
            for (x = 0; x < size; x++) {
                if ((x - 1) % 2 == 0 && (y - 1) % 2 == 0) {
                    if (Math.random() >= 0.97) {
                        if (Game.map[y][x] == 0 && (x != size - 1)) {
                            Game.map[y][x] = 5;
                        }
                    }
                } else if (Math.random() >= 0.96) {
                    if (Game.map[y][x] == 0 && (x != size - 1)) {
                        Game.map[y][x] = 3;
                    }
                }
            }
        }

        Game.map[size - 2][1] = 6;
        Game.map[size - 2][size - 2] = 10;

        this.spawnEnemy();
    }

    drawMap(size) {
        for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
                if (x > Game.playerX + 20 || x < Game.playerX - 20) {
                    continue;
                }

                if (y > Game.playerY + 15 || y < Game.playerY - 15) {
                    continue;
                }

                var scalar = Math.round(WIDTH * SCALE * 0.05);

                var pX = Game.playerX;
                var pY = Game.playerY + 4;

                if (Game.playerX - 10 <= 0) {
                    pX = 10;
                } else if (Game.playerX + 10 >= size) {
                    pX = size - 10;
                }

                if (Game.playerY - 4 <= 0) {
                    pY = 8;
                } else if (Game.playerY + 7 >= size) {
                    pY = size - 3;
                }

                var image = BRICK;

                if (y != size - 1) {
                    if (Game.map[y + 1][x] != 1) {
                        image = BRICK2;
                    }
                }

                if (x == Game.playerX && y == Game.playerY) {
                    switch (Game.map[y][x]) {
                        case 0:
                        case 2:
                        case 5:
                            ctx.drawImage(SNOW, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            ctx.drawImage(FOOT, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            break;
                        case 6:
                            ctx.drawImage(Game.portalSprite, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            break;
                        case 9:
                        case 10:
                            ctx.drawImage(SNOW, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            ctx.drawImage(EXIT, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            break;
                    }
                    ctx.drawImage(Game.playerSprite, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                } else {
                    switch (Game.map[y][x]) {
                        case 0:
                            ctx.drawImage(SNOW, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            break;
                        case 1:
                            ctx.fillStyle = "white";
                            ctx.fillRect(x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            ctx.drawImage(image, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            break;
                        case 2:
                            ctx.drawImage(SNOW, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            ctx.drawImage(FOOT, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            break;
                        case 3:
                            ctx.drawImage(SNOW, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            ctx.drawImage(Game.bearSprite, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            break;
                        case 5:
                            ctx.drawImage(SNOW, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            ctx.drawImage(KEY, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            break;
                        case 6:
                            ctx.drawImage(Game.portalSprite, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            break;
                        case 10:
                            ctx.drawImage(SNOW, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            ctx.drawImage(EXIT, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
                            break;
                    }
                }
            }
        }
    }

    drawMiniMap(size) {
        ctx.fillStyle = "blue";

        for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
                if (Game.playerX == x && Game.playerY == y) {
                    ctx.fillStyle = "red";
                    ctx.fillRect(WIDTH * SCALE * 0.015 + x * WIDTH * SCALE / 225, HEIGHT * SCALE * 0.7 + y * WIDTH * SCALE / 225, WIDTH * SCALE / 225, WIDTH * SCALE / 225);
                } else {
                    switch (Game.map[y][x]) {
                        case 1:
                            ctx.fillStyle = "blue";
                            ctx.fillRect(WIDTH * SCALE * 0.015 + x * WIDTH * SCALE / 225, HEIGHT * SCALE * 0.7 + y * WIDTH * SCALE / 225, WIDTH * SCALE / 225, WIDTH * SCALE / 225);
                            break;
                        case 3:
                            ctx.fillStyle = "green";
                            ctx.fillRect(WIDTH * SCALE * 0.015 + x * WIDTH * SCALE / 225, HEIGHT * SCALE * 0.7 + y * WIDTH * SCALE / 225, WIDTH * SCALE / 225, WIDTH * SCALE / 225);
                            break;
                        case 5:
                            ctx.fillStyle = "yellow";
                            ctx.fillRect(WIDTH * SCALE * 0.015 + x * WIDTH * SCALE / 225, HEIGHT * SCALE * 0.7 + y * WIDTH * SCALE / 225, WIDTH * SCALE / 225, WIDTH * SCALE / 225);
                            break;
                        case 6:
                            ctx.fillStyle = "magenta";
                            ctx.fillRect(WIDTH * SCALE * 0.015 + x * WIDTH * SCALE / 225, HEIGHT * SCALE * 0.7 + y * WIDTH * SCALE / 225, WIDTH * SCALE / 225, WIDTH * SCALE / 225);
                            break;
                        case 10:
                            ctx.fillStyle = "white";
                            ctx.fillRect(WIDTH * SCALE * 0.015 + x * WIDTH * SCALE / 225, HEIGHT * SCALE * 0.7 + y * WIDTH * SCALE / 225, WIDTH * SCALE / 225, WIDTH * SCALE / 225);
                            break;

                    }
                }
            }
        }
    }

    update(t) {
        if (Game.reset && !Game.transition) {
            Game.playerX = 1;
            Game.playerY = 1;

            Game.fogBufferX = 0;
            Game.fogBufferY = 0;

            Game.cave = 1;;
            Game.score = 0;

            Game.pseudoTime = 100;
            Game.time = 100;

            Game.reset = false;

            Game.lose = false;

            Game.keys = 0;
            Game.jumps = 5;
            Game.cubSave = 0;

            Game.bearsArray = null;
            Game.bearsArray = [];

            this.generateMap(Game.mapSize);
        }

        Game.transition = t;

        if (Game.map[Game.playerY][Game.playerX] == 3) {
            Game.map[Game.playerY][Game.playerX] = 2;

            if (Game.cubSave == 0) {
                Game.bearsArray.push([Game.playerY, Game.playerX]);
            } else {
                var y = Game.bearsArray[Game.bearsArray.length - 1][0];
                var x = Game.bearsArray[Game.bearsArray.length - 1][1];

                Game.bearsArray.push([y, x]);
            }

            Game.cubSave++;

            BEAR.play();
        }

        if (Game.map[Game.playerY][Game.playerX] == 5) {
            Game.keys++;
            Game.map[Game.playerY][Game.playerX] = 2;

            KEY1.play();
        }

        if (Game.map[Game.playerY][Game.playerX] == 10 && Game.keys >= 3) {
            Game.engine.transition(true);
            Game.map[Game.playerY][Game.playerX] = 9;
        }

        switch (Game.playerFace) {
            case 0:
                if (Math.round(Game.animationTime) % 2 == 0) {
                    Game.playerSprite = UP1;
                } else {
                    Game.playerSprite = UP2;
                }
                break;
            case 1:
                if (Math.round(Game.animationTime) % 2 == 0) {
                    Game.playerSprite = DOWN1;
                } else {
                    Game.playerSprite = DOWN2;
                }
                break;
            case 2:
                if (Math.round(Game.animationTime) % 2 == 0) {
                    Game.playerSprite = LEFT1;
                } else {
                    Game.playerSprite = LEFT2;
                }
                break;
            case 3:
                if (Math.round(Game.animationTime) % 2 == 0) {
                    Game.playerSprite = RIGHT1;
                } else {
                    Game.playerSprite = RIGHT2;
                }
                break;
        }

        if (Math.round(Game.animationTime) % 2 == 0) {
            Game.bearSprite = BEAR1;
            Game.portalSprite = PORTAL1;
            Game.enemySprite = EBEAR1;
        } else {
            Game.bearSprite = BEAR2;
            Game.portalSprite = PORTAL2;
            Game.enemySprite = EBEAR2;
        }

        if (Game.time <= 0) {
            Game.lose = true;
        }

        if (Game.enemyX == Game.playerX && Game.enemyY == Game.playerY) {
            Game.lose = true;
        }

        this.draw();
    }

    draw() {
        this.drawMap(Game.mapSize);

        this.drawBears();
        this.drawEnemy();

        ctx.globalAlpha = 0.8;

        ctx.drawImage(FOG, Game.fogBufferX, 0, WIDTH * SCALE, HEIGHT * SCALE);
        ctx.drawImage(FOG, Game.fogBufferX - WIDTH * SCALE, 0, WIDTH * SCALE, HEIGHT * SCALE);

        ctx.drawImage(FOG, 0, Game.fogBufferY, WIDTH * SCALE, HEIGHT * SCALE);
        ctx.drawImage(FOG, 0, Game.fogBufferY - HEIGHT * SCALE, WIDTH * SCALE, HEIGHT * SCALE);

        Game.fogBufferX += 150 / FPS * SCALE;
        Game.fogBufferY += 150 / FPS * SCALE;

        if (Game.fogBufferX >= WIDTH * SCALE) {
            Game.fogBufferX = 0;
        }

        if (Game.fogBufferY >= HEIGHT * SCALE) {
            Game.fogBufferY = 0;
        }

        ctx.globalAlpha = 1;

        var font = (WIDTH * SCALE * 0.05) + "px Arial";

        var gradient = ctx.createLinearGradient(0, 0, WIDTH * SCALE, 0);

        gradient.addColorStop("0", " magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");

        ctx.fillStyle = "black";
        ctx.fillRect(0, HEIGHT * SCALE * 0.68, WIDTH * SCALE * 10, WIDTH * SCALE * 10);

        ctx.fillStyle = "blue";
        ctx.fillRect(0, HEIGHT * SCALE * 0.68, WIDTH * SCALE * 10, WIDTH * SCALE * 0.005);

        ctx.fillStyle = gradient;
        ctx.font = font;

        ctx.textAlign = "left";

        ctx.fillText("Score: " + Game.score, WIDTH * SCALE * 0.25, HEIGHT * SCALE * 0.92);
        ctx.fillText("Cave: " + Game.cave, WIDTH * SCALE * 0.25, HEIGHT * SCALE * 0.84);
        ctx.fillText("Time: " + Game.time, WIDTH * SCALE * 0.25, HEIGHT * SCALE * 0.76);
        ctx.fillText("Keys: " + Game.keys, WIDTH * SCALE * 0.6, HEIGHT * SCALE * 0.76);
        ctx.fillText("Jumps: " + Game.jumps, WIDTH * SCALE * 0.6, HEIGHT * SCALE * 0.84);
        ctx.fillText("Bears: " + Game.cubSave, WIDTH * SCALE * 0.6, HEIGHT * SCALE * 0.92);

        ctx.textAlign = "center";

        this.drawMiniMap(Game.mapSize);

        if (Game.paused) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.8)";

            ctx.fillRect(0, 0, WIDTH * SCALE, HEIGHT * SCALE);

            ctx.fillStyle = "white";

            var font = (WIDTH * SCALE * 0.05) + "px Arial";

            ctx.font = font;

            ctx.fillText("Resume", WIDTH * SCALE / 2, HEIGHT * SCALE * 0.45);
            ctx.fillText("Quit", WIDTH * SCALE / 2, HEIGHT * SCALE * 0.55);

            switch (Game.menuOption) {
                case 0:
                    ctx.fillText(">", WIDTH * SCALE * 0.3, HEIGHT * SCALE * 0.45);
                    break;
                case 1:
                    ctx.fillText(">", WIDTH * SCALE * 0.3, HEIGHT * SCALE * 0.55);
                    break;
            }
        } else if (Game.lose) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.8)";

            ctx.fillRect(0, 0, WIDTH * SCALE, HEIGHT * SCALE);

            ctx.fillStyle = "white";

            var font = (WIDTH * SCALE * 0.05) + "px Arial";

            ctx.font = font;

            ctx.fillText("Score: " + Game.score, WIDTH * SCALE / 2, HEIGHT * SCALE * 0.3);
            ctx.fillText("Play Again", WIDTH * SCALE / 2, HEIGHT * SCALE * 0.45);
            ctx.fillText("Quit", WIDTH * SCALE / 2, HEIGHT * SCALE * 0.55);

            switch (Game.menuOption) {
                case 0:
                    ctx.fillText(">", WIDTH * SCALE * 0.3, HEIGHT * SCALE * 0.45);
                    break;
                case 1:
                    ctx.fillText(">", WIDTH * SCALE * 0.3, HEIGHT * SCALE * 0.55);
                    break;
            }
        } else if (!Game.transition && !Game.lose) {
            Game.pseudoTime -= 1 / FPS;
            Game.time = Math.round(Game.pseudoTime)

            Game.animationTime += 5 / FPS;
        }
    }

    input(event) {
        if (!Game.transition) {
            if (event.keyCode == 27 && !Game.lose) {
                Game.paused = !Game.paused;

                Game.menuOption = 0;
            }

            if (Game.paused) {
                if (event.keyCode == 38) {
                    Game.menuOption = 0;
                } else if (event.keyCode == 40) {
                    Game.menuOption = 1;
                } else if (event.keyCode == 32) {
                    if (Game.menuOption == 0) {
                        Game.paused = false;
                    } else {
                        Game.paused = false;

                        Game.engine.transition(false);

                        Game.reset = true;
                    }
                }
            } else if (Game.lose) {
                if (event.keyCode == 38) {
                    Game.menuOption = 0;
                } else if (event.keyCode == 40) {
                    Game.menuOption = 1;
                } else if (event.keyCode == 32) {
                    if (Game.menuOption == 0) {
                        Game.reset = true;
                    } else {
                        Game.engine.transition(false);

                        Game.reset = true;
                    }
                }
            } else if (!Game.lose) {
                if (event.keyCode == 32) {
                    if (Game.playerX == 1 && Game.playerY == Game.mapSize - 2) {
                        Game.playerX = Game.mapSize - 2;
                        Game.playerY = 1;
                    }
                } else if (event.keyCode == "37" && Game.map[Game.playerY][Game.playerX - 1] != 1) {
                    if (Game.map[Game.playerY][Game.playerX] != 10 && Game.map[Game.playerY][Game.playerX] != 6) {
                        Game.map[Game.playerY][Game.playerX] = 2;
                    }

                    this.updateBears();

                    Game.playerX--; // left

                    Game.playerFace = 2;

                } else if (event.keyCode == "37" && Game.playerX - 2 >= 1) {
                    if (Game.jumps > 0) {
                        if (Game.map[Game.playerY][Game.playerX - 2] != 1) {
                            if (Game.map[Game.playerY][Game.playerX] != 10 && Game.map[Game.playerY][Game.playerX] != 6) {
                                Game.map[Game.playerY][Game.playerX] = 2;
                            }

                            this.updateBears();

                            Game.playerX -= 2; // left

                            Game.playerFace = 2;

                            Game.jumps--;
                        }
                    }
                }

                if (event.keyCode == "38" && Game.map[Game.playerY - 1][Game.playerX] != 1) {
                    if (Game.map[Game.playerY][Game.playerX] != 10 && Game.map[Game.playerY][Game.playerX] != 6) {
                        Game.map[Game.playerY][Game.playerX] = 2;
                    }

                    this.updateBears();

                    Game.playerY--; // up

                    Game.playerFace = 0;
                } else if (event.keyCode == "38" && Game.playerY - 2 >= 1) {
                    if (Game.jumps > 0) {
                        if (Game.map[Game.playerY - 2][Game.playerX] != 1) {
                            if (Game.map[Game.playerY][Game.playerX] != 10 && Game.map[Game.playerY][Game.playerX] != 6) {
                                Game.map[Game.playerY][Game.playerX] = 2;
                            }

                            this.updateBears();

                            Game.playerY -= 2; // left

                            Game.playerFace = 0;

                            Game.jumps--;
                        }
                    }
                }

                if (event.keyCode == "39" && Game.map[Game.playerY][Game.playerX + 1] != 1) {
                    if (Game.map[Game.playerY][Game.playerX] != 10 && Game.map[Game.playerY][Game.playerX] != 6) {
                        Game.map[Game.playerY][Game.playerX] = 2;
                    }

                    this.updateBears();

                    Game.playerX++; // right

                    Game.playerFace = 3;

                } else if (event.keyCode == "39" && Game.playerX + 2 <= Game.mapSize - 1) {
                    if (Game.jumps > 0) {
                        if (Game.map[Game.playerY][Game.playerX + 2] != 1) {
                            if (Game.map[Game.playerY][Game.playerX] != 10 && Game.map[Game.playerY][Game.playerX] != 6) {
                                Game.map[Game.playerY][Game.playerX] = 2;
                            }

                            this.updateBears();

                            Game.playerX += 2; // left

                            Game.playerFace = 3;

                            Game.jumps--;

                        }
                    }
                }

                if (event.keyCode == "40" && Game.map[Game.playerY + 1][Game.playerX] != 1) {
                    if (Game.map[Game.playerY][Game.playerX] != 10 && Game.map[Game.playerY][Game.playerX] != 6) {
                        Game.map[Game.playerY][Game.playerX] = 2;
                    }

                    this.updateBears();

                    Game.playerY++; // down

                    Game.playerFace = 1;

                } else if (event.keyCode == "40" && Game.playerY + 2 >= 1) {
                    if (Game.jumps > 0) {
                        if (Game.map[Game.playerY + 2][Game.playerX] != 1) {
                            if (Game.map[Game.playerY][Game.playerX] != 10 && Game.map[Game.playerY][Game.playerX] != 6) {
                                Game.map[Game.playerY][Game.playerX] = 2;
                            }

                            this.updateBears();

                            Game.playerY += 2; // left

                            Game.playerFace = 1;

                            Game.jumps--;
                        }
                    }
                }
            }
        }
    }

    fakeReset() {
        Game.playerX = 1;
        Game.playerY = 1;

        Game.cave++;
        Game.score += 10;
        Game.score += (Game.keys - 3) * 10;
        Game.score += Game.cubSave * 100;

        Game.score += Game.time;

        Game.cubSave = 0;

        Game.fogBufferX = 0;
        Game.fogBufferY = 0;

        Game.pseudoTime = 100 - Game.cave * 3;
        Game.time = 100 - Game.cave * 3;

        Game.keys = 0;

        Game.jumps = 5;

        Game.lose = false;

        Game.bearsArray = null;
        Game.bearsArray = [];

        this.generateMap(Game.mapSize);
    }

    updateBears() {
        if (Game.cubSave != 0) {
            for (var i = Game.bearsArray.length - 1; i >= 0; i--) {
                if (i != 0) {
                    Game.bearsArray[i][0] = Game.bearsArray[i - 1][0];
                    Game.bearsArray[i][1] = Game.bearsArray[i - 1][1];
                } else {
                    Game.bearsArray[0][0] = Game.playerY;
                    Game.bearsArray[0][1] = Game.playerX;
                }
            }
        }

        this.updateEnemy();
    }

    drawBears() {
        var scalar = Math.round(WIDTH * SCALE * 0.05);

        var pX = Game.playerX;
        var pY = Game.playerY + 4;

        if (Game.playerX - 10 <= 0) {
            pX = 10;
        } else if (Game.playerX + 10 >= Game.mapSize) {
            pX = Game.mapSize - 10;
        }

        if (Game.playerY - 4 <= 0) {
            pY = 8;
        } else if (Game.playerY + 7 >= Game.mapSize) {
            pY = Game.mapSize - 3;
        }

        for (var i = 0; i < Game.bearsArray.length; i++) {
            var y = Game.bearsArray[i][0];
            var x = Game.bearsArray[i][1];

            ctx.drawImage(Game.bearSprite, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
        }
    }

    spawnEnemy() {
        var e = 0;

        while (e != 1) {
            var x = Math.round(Math.random() * (Game.mapSize - 1));
            var y = Math.round(Math.random() * (Game.mapSize - 1));

            if ((x - 1) % 2 != 0 || (y - 1) % 2 != 0) {
                continue;
            }

            Game.enemyX = x;
            Game.enemyY = y;

            e++;
        }
    }

    updateEnemy() {
        var y = Game.enemyY;
        var x = Game.enemyX;

        var mock = [];

        for (var k = 0; k < Game.mapSize; k++) {
            mock[k] = Game.map[k].slice();
        }

        this.findPath(x, y, mock);

        if (mock[y][x + 1] == 99) {
            Game.enemyX++;
            return;
        }

        if (mock[y][x - 1] == 99) {
            Game.enemyX--;
            return;
        }

        if (mock[y + 1][x] == 99) {
            Game.enemyY++;
            return;
        }

        if (mock[y - 1][x] == 99) {
            Game.enemyY--;
            return;
        }
    }

    drawEnemy() {
        var scalar = Math.round(WIDTH * SCALE * 0.05);

        var pX = Game.playerX;
        var pY = Game.playerY + 4;

        if (Game.playerX - 10 <= 0) {
            pX = 10;
        } else if (Game.playerX + 10 >= Game.mapSize) {
            pX = Game.mapSize - 10;
        }

        if (Game.playerY - 4 <= 0) {
            pY = 8;
        } else if (Game.playerY + 7 >= Game.mapSize) {
            pY = Game.mapSize - 3;
        }

        var y = Game.enemyY;
        var x = Game.enemyX;

        ctx.drawImage(Game.enemySprite, x * scalar - pX * scalar + WIDTH * SCALE / 2, y * scalar - pY * scalar + HEIGHT * SCALE / 2, scalar, scalar);
    }

    findPath(x, y, array) {
        if (x == Game.playerX && y == Game.playerY) {
            return true;
        }

        if (array[y][x] == 1) {
            return false;
        }

        if (array[y][x] == 99) {
            return false;
        }

        array[y][x] = 99;

        if (this.findPath(x, y - 1, array) == true) {
            return true;
        }

        if (this.findPath(x + 1, y, array) == true) {
            return true;
        }

        if (this.findPath(x, y + 1, array) == true) {
            return true;
        }

        if (this.findPath(x - 1, y, array) == true) {
            return true;
        }

        array[y][x] = 0;

        return false;
    }
}