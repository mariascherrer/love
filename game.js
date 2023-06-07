// Configuração do jogo
window.onload = function () {
    "use strict";
    var canvas = document.getElementById("gameCanvas");
    var context = canvas.getContext("2d");


    var w = document.getElementById("gameCanvas").offsetWidth;
    var h = document.getElementById("gameCanvas").offsetHeight;
    var terrainImageLoaded = false, houseImageLoaded = false, pokeballImageLoaded = false, playerImageLoaded = false;
    var objectSizes = 20;
    var speed = 20;
    var modifier = 100;
    var score = 0;
    //terrain image
    var terrainImage = new Image(600, 600);

    terrainImage.onload = function () {

        terrainImageLoaded = true;

        assetsLoaded();
    };
    terrainImage.src = "images/cenario.png";

    //house image
    var houseImage = new Image();
    houseImage.onload = function () {
        houseImageLoaded = true;
        assetsLoaded();
    };
    houseImage.src = "images/house.png";
     /**
     * Decide here if all the assets are ready to start updating
     * @function
     * @name assetsLoaded
     */
     function assetsLoaded() {
        if (terrainImageLoaded == true && houseImageLoaded == true && pokeballImageLoaded == true && playerImageLoaded == true) {
            pokeball.generatePosition();
            update();
        }
    }
    var playerImage = new Image();
    playerImage.onload = function () {
        pokeballImageLoaded = true;
        assetsLoaded();
    };
    playerImage.src = "images/player.png";

    //pokeball image
    var pokeballImage = new Image();
    pokeballImage.onload = function () {
        playerImageLoaded = true;
        assetsLoaded();
    };
    pokeballImage.src = "images/pokeball.png";

    /**
     * It will hold all the pockeball data like x and y axis position
     * sprite position and item distance is for determine which item is selected from the sprite - @todo future use for knowing on score which one player picked
     * Also hold the generate position function that generates random positions if there is no collision.
     * @Object
     * @name pokeball
     */
    var pokeball = {
        x: 0,
        y: 0,
        spritePosition: 0,
        spriteItemDistance: 33
    };
    pokeball.generatePosition = function () {

        do {
            pokeball.x = Math.floor(Math.random() * 20) + 1;
            pokeball.y = Math.floor(Math.random() * 10) + 4;
        } while (check_collision(pokeball.x, pokeball.y));

        pokeball.spritePosition = Math.floor(Math.random() * 4) + 0;// get position from 0-4
    };
 //pokeball-selection
 var pokePick = new Audio("sounds/pickup.mp3");
 pokePick.volume = 0.3;
    var house = {
        x: 0,
        y: 0,
        spritePosition: 0,
        spriteItemDistance: 33
    };
    house.generatePosition = function () {
        do {
            house.x = Math.floor(10);
            house.y = Math.floor(10);
        } while (check_collision(house.x, house.y));

        house.spritePosition = Math.floor(10);// get position from 0-4
    };
    // var player = {
    //     x: canvas.width / 2,
    //     y: canvas.height / 2,
    //     width: 50,
    //     height: 50,
    //     speed: 5

        
    // };
    var player = {
        x: Math.round((w / 2) / objectSizes),
        y: Math.round((h / 2) / objectSizes),
        currentDirection: "stand",
        direction: {
            "stand": {
                x: 0,
                y: 0
            },
            "down-1": {
                x: 17,
                y: 0
            },
            "down-2": {
                x: 34,
                y: 0
            },
            "up-1": {
                x: 125,
                y: 0
            },
            "up-2": {
                x: 142,
                y: 0
            },
            "left-1": {
                x: 69,
                y: 0
            },
            "left-2": {
                x: 87,
                y: 0
            },
            "right-1": {
                x: 160,
                y: 0
            },
            "right-2": {
                x: 178,
                y: 0
            }
        }
    };
    var isLeftPressed = false;
    var isRightPressed = false;
    var isUpPressed = false;
    var isDownPressed = false;
    function board() {
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(w - 100, h - 70, 100, 70);

        context.font = "18px Arial";
        context.fillStyle = "rgba(255, 255, 255, 1)";
        context.fillText("Você achou", w - 93, h - 45);

        context.font = "14px Arial";
        context.fillStyle = "rgba(255, 255, 255, 1)";
        context.fillText(score + " pokebolas", w - 85, h - 25);
    }

    // Funções de renderização e atualização do jogo
    function render() {
        context.drawImage(terrainImage, 0, 0);
        context.drawImage(houseImage, 80, 60);
        board();
        context.drawImage(pokeballImage, pokeball.spritePosition * pokeball.spriteItemDistance, 0, objectSizes, objectSizes, pokeball.x * objectSizes, pokeball.y * objectSizes, objectSizes, objectSizes);
        
        context.drawImage(playerImage, player.direction[player.currentDirection].x, player.direction[player.currentDirection].y, objectSizes - 2, objectSizes, player.x * objectSizes, player.y * objectSizes, objectSizes, objectSizes);
       
    
    }
    function check_collision(x, y) {
        var foundCollision = false;

        if (((x > 3 && x < 9) && y == 6) || ((x > 4 && x < 9) && (y == 5 || y == 4 || y == 3))) { //collision on house
            console.log("on house");
            foundCollision = true;
        }

        if ((x < 1 || x > 20) ||
            (y < 2 || y > 20) ||
            ((y > 0 && y < 4) && (x == 20 || x == 19)) || //right corner
            ((y > 0 && y < 4) && (x == 2 || x == 3)) || //left corner
            ((y > 18) && (x == 2 || x == 3)) || //left corner
            ((x > 17) && (y == 19 || y == 20)) || //left corner
            ((x > 19) && (y == 17 || y == 18)) //left corner 2
        ) {
            console.log("lost on the woods");
            foundCollision = true
        }

        return foundCollision;
    }


    function update() {

         /**
         * A temporary object to hold the current x, y so if there is a collision with the new coordinates to fallback here
         */
       
        if (isLeftPressed) {
            player.x -= speed/modifier;
            if (player.currentDirection == "stand") {
                player.currentDirection = "left-1";
            } else if (player.currentDirection == "left-1") {
                player.currentDirection = "left-2";
            } else if (player.currentDirection == "left-2") {
                player.currentDirection = "left-1";
            } else {
                player.currentDirection = "left-1";
            }
        }

        if (isRightPressed) {
            player.x += speed / modifier;
            if (player.currentDirection == "stand") {
                player.currentDirection = "right-1";
            } else if (player.currentDirection == "right-1") {
                player.currentDirection = "right-2";
            } else if (player.currentDirection == "right-2") {
                player.currentDirection = "right-1";
            } else {
                player.currentDirection = "right-1";
            }
        }

        if (isUpPressed) {
            player.y -= speed / modifier;
            if (player.currentDirection == "stand") {
                player.currentDirection = "up-1";
            } else if (player.currentDirection == "up-1") {
                player.currentDirection = "up-2";
            } else if (player.currentDirection == "up-2") {
                player.currentDirection = "up-1";
            } else {
                player.currentDirection = "up-1";
            }
        }

        if (isDownPressed) {
            player.y += speed/modifier;
            if (player.currentDirection == "stand") {
                player.currentDirection = "down-1";
            } else if (player.currentDirection == "down-1") {
                player.currentDirection = "down-2";
            } else if (player.currentDirection == "down-2") {
                player.currentDirection = "down-1";
            } else {
                player.currentDirection = "down-1";
            }
        }
       
       
        

        render();

    }
    
    // Funções para lidar com eventos de toque
    function handleTouchStart(event) {
        event.preventDefault();

        var buttonId = event.target.id;

        switch (buttonId) {
            case "leftButton":
                isLeftPressed = true;
                break;
            case "rightButton":
                isRightPressed = true;
                break;
            case "upButton":
                isUpPressed = true;
                break;
            case "downButton":
                isDownPressed = true;
                break;
        }

        console.log("y:", (player.y * objectSizes) / objectSizes);
        console.log("x", (player.x * objectSizes) / objectSizes);
        console.log("y-pk:", (pokeball.y * objectSizes) / objectSizes);
        console.log("x-pk", (pokeball.x * objectSizes) / objectSizes);
    }

    function handleTouchEnd(event) {
        event.preventDefault();

        var buttonId = event.target.id;

        switch (buttonId) {
            case "leftButton":
                isLeftPressed = false;
                break;
            case "rightButton":
                isRightPressed = false;
                break;
            case "upButton":
                isUpPressed = false;
                break;
            case "downButton":
                isDownPressed = false;
                break;
        }

        
    }

    // Associa os eventos de toque aos botões
    var buttons = document.getElementsByClassName("button_game");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("touchstart", handleTouchStart);
        buttons[i].addEventListener("touchend", handleTouchEnd);
    }

    // Loop principal do jogo
    function gameLoop() {
        var hold_player = {
            x: player.x,
            y: player.y
        };
        if (check_collision(player.x, player.y)) {
            player.x = hold_player.x;
            player.y = hold_player.y;
            console.log('1');
        }

        if (Math.round(player.x) == pokeball.x && Math.round(player.y) == pokeball.y) { // found a pokeball !! create a new one
            console.log('2');
            console.log("found a pokeball of " + pokeball.spritePosition + "! Bravo! ");
            pokePick.pause();
            pokePick.currentTime = 0;
            if (score < 6) {

                pokePick.play();
                score += 1;
                if (score === 1) {
                    swal('', 'Tu foi uma das melhores coisas de 2022, meu ano tava muito fudido, eu tava muito sozinha');
                }
                if (score === 2) {
                    swal('', 'Obrigado por ter me aceitado desse jeito');
                }
                if (score === 3) {
                    swal('', 'Procurei leitinho de várias marcas mas nenhum se compara ao seu');
                }
                if (score === 4) {
                    swal('', 'Você não é raiz de 16 mas sempre pode me deixar de 4');
                }
                if (score === 5) {
                    swal('', 'Te amo nerdola');
                }
                
                pokeball.generatePosition();
            }

            if (score === 6) {
                swal('', 'Acabou, seria mensagem de mais.Va até a porta da casinha');
                score += 1;
            }

        }
        if (Math.floor(player.x) == 6 && Math.floor(player.y) == 7 && score >= 6) {
            window.location.href = "form.html";
        }
        update();

        requestAnimationFrame(gameLoop);
    }

    // Inicia o jogo
    gameLoop();

};