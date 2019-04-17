class Menu {

    static engine;

    static menu;    // 0 - main 1 - options 2 - credits
    static option;
    static memory;

    static transition;

    static gameScale;
    static volume;

    static cloudBuffer;

    constructor(e) {
        Menu.engine = e;

        Menu.menu = 0;
        Menu.option = 0;
        Menu.memory = 0;

        Menu.transition = false;

        Menu.volume = 100;
        Menu.gameScale = 100;

        Menu.cloudBuffer = 0;
    }

    update(t) {
        Menu.transition = t;

        this.draw();

        Menu.volume %= 110;
        Menu.gameScale %= 110;

        if (Menu.gameScale == 0) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            Menu.gameScale = 10;
        }

        SCALE = Menu.gameScale / 100;

        VOLUME = Menu.volume / 100;

        MENU_SONG.volume = VOLUME;
    }

    draw() {
        var font = (WIDTH * SCALE * 0.05) + "px Arial";
        var titleFont = (WIDTH * SCALE * 0.15) + "px Arial Header";

        var yBuffer = HEIGHT * SCALE * 0.1;

        ctx.drawImage(MENU_BACKGROUND, 0, 0, WIDTH * SCALE, HEIGHT * SCALE);

        ctx.drawImage(MENU_BERG, WIDTH * SCALE - Menu.cloudBuffer - WIDTH * SCALE * 0.1, HEIGHT * SCALE * 0.45, WIDTH * SCALE * 0.5, HEIGHT * SCALE * 0.5)

        ctx.drawImage(MENU_ICE, 0, 0, WIDTH * SCALE, HEIGHT * SCALE);

        ctx.drawImage(MENU_CLOUDS, Menu.cloudBuffer, 0, WIDTH * SCALE, HEIGHT * SCALE);
        ctx.drawImage(MENU_CLOUDS, Menu.cloudBuffer - WIDTH * SCALE, 0, WIDTH * SCALE, HEIGHT * SCALE);

        ctx.font = titleFont;

        var gradient = ctx.createLinearGradient(0, 0, WIDTH * SCALE, 0);

        gradient.addColorStop("0", " magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");

        ctx.fillStyle = gradient

        ctx.fillText("POLARITY", WIDTH * SCALE / 2, HEIGHT * SCALE * 0.2);

        ctx.font = font;

        Menu.cloudBuffer += 150 / FPS * SCALE;

        if (Menu.cloudBuffer >= WIDTH * SCALE) {
            Menu.cloudBuffer = 0;
        }

        if (Menu.menu == 0) {
            ctx.fillText("Play", WIDTH * SCALE / 2, HEIGHT * SCALE * 0.4 + yBuffer);
            ctx.fillText("Options", WIDTH * SCALE / 2, HEIGHT * SCALE * 0.5 + yBuffer);
            ctx.fillText("Credits", WIDTH * SCALE / 2, HEIGHT * SCALE * 0.6 + yBuffer);
        } else if (Menu.menu == 1) {
            ctx.fillText("Volume: " + Menu.volume + "%", WIDTH * SCALE / 2, HEIGHT * SCALE * 0.4 + yBuffer);
            ctx.fillText("Game Scale: " + Menu.gameScale + "%", WIDTH * SCALE / 2, HEIGHT * SCALE * 0.5 + yBuffer);
            ctx.fillText("Back", WIDTH * SCALE / 2, HEIGHT * SCALE * 0.6 + yBuffer);
        } else {
            font = (WIDTH * SCALE * 0.04) + "px Arial";

            ctx.font = font;

            ctx.fillText("Developed by: Leo M.K.", WIDTH * SCALE / 2, HEIGHT * SCALE * 0.4 + yBuffer);
            ctx.fillText("Music by: David Randall & Philip Dyer ", WIDTH * SCALE / 2, HEIGHT * SCALE * 0.5 + yBuffer);

            font = (WIDTH * SCALE * 0.05) + "px Arial";

            ctx.font = font;

            ctx.fillText("Back", WIDTH * SCALE / 2, HEIGHT * SCALE * 0.6 + yBuffer);
            ctx.fillText(">", WIDTH * SCALE * 0.35, HEIGHT * SCALE * 0.6 + yBuffer);
        }

        if (Menu.option < 0) {
            Menu.option = 0;
        } else if (Menu.option > 2) {
            Menu.option = 2;
        }

        switch (Menu.menu) {
            case 0:
                switch (Menu.option) {
                    case 0:
                        ctx.fillText(">", WIDTH * SCALE * 0.35, HEIGHT * SCALE * 0.4 + yBuffer);
                        break;
                    case 1:
                        ctx.fillText(">", WIDTH * SCALE * 0.35, HEIGHT * SCALE * 0.5 + yBuffer);
                        break;
                    case 2:
                        ctx.fillText(">", WIDTH * SCALE * 0.35, HEIGHT * SCALE * 0.6 + yBuffer);
                        break;
                }
                break;
            case 1:
                switch (Menu.option) {
                    case 0:
                        ctx.fillText(">", WIDTH * SCALE * 0.25, HEIGHT * SCALE * 0.4 + yBuffer);
                        break;
                    case 1:
                        ctx.fillText(">", WIDTH * SCALE * 0.25, HEIGHT * SCALE * 0.5 + yBuffer);
                        break;
                    case 2:
                        ctx.fillText(">", WIDTH * SCALE * 0.25, HEIGHT * SCALE * 0.6 + yBuffer);
                        break;
                }
                break;
        }
    }

    input(event) {
        if (!Menu.transition) {
            if (event.keyCode == 38) {
                Menu.option--;
            } else if (event.keyCode == 40) {
                Menu.option++;
            } else if (event.keyCode == 32) {
                switch (Menu.menu) {
                    case 0:
                        Menu.memory = Menu.option;

                        switch (Menu.option) {
                            case 0:
                                Menu.engine.transition(false);

                                break;
                            case 1:
                                Menu.menu = 1;
                                Menu.option = 0;
                                break;
                            case 2:
                                Menu.menu = 2;
                                Menu.option = 0;
                                break;
                        }

                        break;
                    case 1:
                        switch (Menu.option) {
                            case 0:
                                Menu.volume += 10;
                                break;
                            case 1:
                                Menu.gameScale += 10;
                                break;
                            case 2:
                                Menu.menu = 0;
                                Menu.option = Menu.memory;
                                break;
                        }
                        break;
                    case 2:
                        Menu.menu = 0;
                        Menu.option = Menu.memory;
                        break;
                }
            }
        }
    }
}