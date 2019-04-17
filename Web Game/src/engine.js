class Engine {

    static state;
    static next;

    static transition;

    static transitionIndex;

    static menu;
    static game;

    static xx;

    static opening;

    constructor() {
        Engine.state = "menu";
        Engine.next = "game";

        Engine.transition = false;
        Engine.transitionIndex = 0;

        Engine.menu = new Menu(this);
        Engine.game = new Game(this);

        Engine.xx = false;

        Engine.opening = true;
    }

    transition(x) {
        if (x) {
            Engine.next = "game";
            Engine.xx = true;
        } else {
            if (Engine.state == "menu") {
                Engine.next = "game";
            } else {
                Engine.next = "menu";
            }
        }

        Engine.transitionIndex = 0 - WIDTH * SCALE;
        Engine.transition = true;
    }

    update() {
        if (!Engine.opening) {
            if (Engine.state == "menu") {
                Engine.menu.update(Engine.transition);

                if (MENU_SONG.paused) {
                    MENU_SONG.currentTime = 0;
                    MENU_SONG.play();
                    CAVE_SONG.pause();
                    WIND.pause();
                }
            } else if (Engine.state == "game") {
                Engine.game.update(Engine.transition);

                if (CAVE_SONG.paused) {
                    CAVE_SONG.currentTime = 0;
                    CAVE_SONG.play();
                    WIND.play();
                    MENU_SONG.pause();
                }
            }

            if (Engine.transition) {
                Engine.transitionIndex += WIDTH * 1 * SCALE / FPS;

                if (Engine.transitionIndex >= WIDTH * SCALE) {
                    Engine.transition = false;
                } else if (Engine.transitionIndex >= 0) {
                    if (Engine.xx) {
                        Engine.game.fakeReset();
                        Engine.xx = false;
                    } else {
                        Engine.state = Engine.next;
                    }
                }

                ctx.fillStyle = "black";

                ctx.fillRect(Engine.transitionIndex, 0, WIDTH * SCALE + 20, HEIGHT * SCALE);
            }


            ctx.fillStyle = "white";
            ctx.fillRect(WIDTH * SCALE, 0, WIDTH, HEIGHT);
            ctx.fillRect(0, HEIGHT * SCALE, WIDTH, HEIGHT);
        } else {
            ctx.fillStyle = "black";

            ctx.fillRect(0, 0, WIDTH * SCALE, HEIGHT * SCALE);

            ctx.drawImage(TEXTO, 0, 0, WIDTH * SCALE * 1, WIDTH * SCALE * 1);
        }
    }

    input(event) {
        if (Engine.state == "menu") {
            Engine.menu.input(event);
        } else if (Engine.state == "game") {
            Engine.game.input(event);
        }

        if (event.keyCode == 13) {
            Engine.opening = false;
        }
    }
}