//To Do: Key and Rock must not appear at place of gems (careful!)
//To DO: Write subclass for 3rd gems
//To DO: Write action after 3 gems were collected

/*
 * This is some important data, which isn't available otherwise
 */
var data = {
    ROW1: 465,
    ROW2: 382,
    ROW3: 299,
    ROW4: 216,
    ROW5: 133,
    ROW6: 50,
    TILE_HEIGHT: 83,
    ENEMY_GAP: 78,
    PLAYER_GAP: 63,
    ROCK_GAP: 70,
    KEY_GAP: 58,
    GEM_GAP: 57,
    WIDTH: 505,
    HEIGHT: 606,
    COL1: 0,
    COL2: 505 / 5,
    COL3: 2 * (505 / 5),
    COL4: 3 * (505 / 5),
    COL5: 4 * (505 / 5),
    BOY_WIDTH: 101,
    BOY_WIDTH_LESS: 69,
    ENEMY_WIDTH: 101,
    ROCK_WIDTH: 101,
    KEY_WIDTH: 101,
    GEM_WIDTH: 101
};

/*
 * The class Enemy, which takes care of the bugs
 * Parameter row: defines the row in which the bug appears
 * Parameter speed: defines the speed of the bug
 */
var Enemy = function(row, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    switch (row) {
        case 1:
            this.y = data.ROW3 - data.ENEMY_GAP;
            break;
        case 2:
            this.y = data.ROW4 - data.ENEMY_GAP;
            break;
        case 3:
            this.y = data.ROW5 - data.ENEMY_GAP;
            break;
    }
    this.speed = speed;
};

/*
 * This method updates the enemy's position, required method for game
 * Parameter: dt, a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    if (this.x > 505) {
        this.x = 0;
    }
    //collision code (the value of 20 is a correction for optimization)
    else if ((player.x > this.x || player.x + data.BOY_WIDTH_LESS > this.x) && (player.x < this.x + data.ENEMY_WIDTH - 20 || player.x + data.BOY_WIDTH_LESS < this.x + data.ENEMY_WIDTH - 20) && this.y === player.y - (data.ENEMY_GAP - data.PLAYER_GAP)) {
        player.gameReset();
        for (var i = 0; i < allEnemies.length; i++) {
            allEnemies[i].gameReset();
        }
        player.subScore();
    }
    else {
        this.x = this.x + (this.speed * dt);
    }
};

/*
 * This method renders the bugs
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * This gameReset method is currently turned off!
 */
Enemy.prototype.gameReset = function() {
    //this.x = 0;
};

/*
 * This method adds speed to the bugs
 */
Enemy.prototype.addSpeed = function(maxSpeed) {
    var newSpeed = this.speed * (Math.random() / 1000 + 1);
    var maximumSpeed = maxSpeed + Math.floor((Math.random() * 10) + 1);
    this.speed = Math.min(newSpeed, maximumSpeed);
};

/*
 * The class Player, which takes care of the player
 */
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = data.WIDTH / 2 - data.BOY_WIDTH / 2;
    this.y = data.ROW1 - data.PLAYER_GAP;
    this.score = 0;
    this.keys = 0;
    this.gemBlue = false;
    this.gemGreen = false;
};

/*
 * This method changes the image of the player, the speed of the bugs and
 * displays a rock and a key when player reaches certain points
 */
Player.prototype.update = function() {
    switch (this.score) {
        case 5:
            this.sprite = 'images/char-cat-girl.png';
            for (var i = 0; i < allEnemies.length; i++) {
                allEnemies[i].addSpeed(30);
            }
            if (rock.y === 1000) {
                rock.appear();
                key.appear();
            }
            break;
        case 10:
            this.sprite = 'images/char-horn-girl.png';
            for (var i = 0; i < allEnemies.length; i++) {
                allEnemies[i].addSpeed(35);
            }
            if (rock.y === 1000) {
                rock.appear();
                key.appear();
            }
            break;
        case 15:
            this.sprite = 'images/char-pink-girl.png';
            for (var i = 0; i < allEnemies.length; i++) {
                allEnemies[i].addSpeed(40);
            }
            if (rock.y === 1000) {
                rock.appear();
                key.appear();
            }
            break;
        case 20:
            this.sprite = 'images/char-princess-girl.png';
            for (var i = 0; i < allEnemies.length; i++) {
                allEnemies[i].addSpeed(45);
            }
            if (rock.y === 1000) {
                rock.appear();
                key.appear();
            }
            break;
    }
};

/*
 * This method renders the player, the score and info about the key
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = 'blue';
    ctx.fillText(this.score + ' points', 410, 575);
    if (this.keys === 1) {
        ctx.fillText('You have a key!', 25, 575);
    }
    if (this.hasGemBlue()) {
        ctx.save();
        ctx.scale(0.3, 0.3);
        ctx.drawImage(Resources.get(gemBlue.sprite), 750, 1770);
        ctx.restore();
    }
    if (this.hasGemGreen()) {
        ctx.save();
        ctx.scale(0.3, 0.3);
        ctx.drawImage(Resources.get(gemGreen.sprite), 800, 1770);
        ctx.restore();
    }
};

/*
 * This method handles the input of the player
 * Parameter: key, a key which was pressed by the user
 */
Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            if (this.x >= data.WIDTH / 5) {
                this.x = this.x - (data.WIDTH / 5);
            }
            break;
        case 'up':
            if (this.y < data.ROW5) {
                this.gameReset();
                for (var i = 0; i < allEnemies.length; i++) {
                    allEnemies[i].gameReset();
                }
                this.addScore();
            }
            else {
                this.y = this.y - data.TILE_HEIGHT;
            }
            break;
        case 'right':
            if (this.x < (data.WIDTH / 5) * 4) {
                this.x = this.x + (data.WIDTH / 5);
            }
            break;
        case 'down':
            if (this.y < data.ROW1 - data.PLAYER_GAP) {
                this.y = this.y + data.TILE_HEIGHT;
            }
            break;
    }
};

/*
 * This method resets the position of the player image
 */
Player.prototype.gameReset = function() {
    this.x = data.WIDTH / 2 - data.BOY_WIDTH / 2;
    this.y = data.ROW1 - data.PLAYER_GAP;
};

/*
 * This method adds points to the score
 */
Player.prototype.addScore = function() {
    this.score = this.score + 1;
};

/*
 * This method subtracts points from the score
 */
Player.prototype.subScore = function() {
    this.score = this.score - 1;
};

/*
 * This method adds a key
 */
Player.prototype.addKey = function() {
    this.keys = this.keys + 1;
};

/*
 * This method subtracts a key
 */
Player.prototype.subKey = function() {
    this.keys = this.keys - 1;
};

/*
 * This method checks if player has a blue Gem.
 * Returns true if player has a blue Gem, false if not.
 */
Player.prototype.hasGemBlue = function() {
    return this.gemBlue;
};

/*
 * This method changes the boolean value of this.gemBlue.
 */
Player.prototype.changeGemBlue = function() {
    this.gemBlue = !this.gemBlue;
};

/*
 * This method checks if player has a green Gem.
 * Returns true if player has a green Gem, false if not.
 */
Player.prototype.hasGemGreen = function() {
    return this.gemGreen;
};

/*
 * This method changes the boolean value of this.gemGreen.
 */
Player.prototype.changeGemGreen = function() {
    this.gemGreen = !this.gemGreen;
};

/*
 * The class Rock, which takes care of a rock
 */
var Rock = function() {
    this.sprite = 'images/Rock.png';
    this.x = this.randomX();
    this.y = this.randomY();
};

/*
 * This method takes care of the collision between player and rock
 * The player gets resetted when colliding without key
 * The rock vanishes, when the player has a key
 */
Rock.prototype.update = function() {
    if (player.keys === 0) {
        if ((player.x > this.x || player.x + data.BOY_WIDTH_LESS > this.x) && (player.x < this.x + data.ROCK_WIDTH - 20 || player.x + data.BOY_WIDTH_LESS < this.x + data.ROCK_WIDTH - 20) && this.y === player.y - (data.ROCK_GAP - data.PLAYER_GAP)) {
            player.gameReset();
            for (var i = 0; i < allEnemies.length; i++) {
                allEnemies[i].gameReset();
            }
            player.subScore();
        }
    }
    else {
        if ((player.x > this.x || player.x + data.BOY_WIDTH_LESS > this.x) && (player.x < this.x + data.ROCK_WIDTH - 20 || player.x + data.BOY_WIDTH_LESS < this.x + data.ROCK_WIDTH - 20) && this.y === player.y - (data.ROCK_GAP - data.PLAYER_GAP)) {
            this.vanish();
            player.subKey();
            if (player.hasGemBlue() === false) {
                gemBlue.appear();
            }
            if (player.hasGemBlue() && player.hasGemGreen() === false) {
                gemGreen.appear();
            }
        }
    }
};

/*
 * This method renders the rock
 */
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * This method returns a random x position for the rock image
 */
Rock.prototype.randomX = function() {
    var randomX = Math.floor((Math.random() * 5) + 1);
    switch (randomX) {
        case 1:
            randomNumX = data.COL1;
            break;
        case 2:
            randomNumX = data.COL2;
            break;
        case 3:
            randomNumX = data.COL3;
            break;
        case 4:
            randomNumX = data.COL4;
            break;
        case 5:
            randomNumX = data.COL5;
            break;
    }
    return randomNumX;
};

/*
 * This method returns a random y position for the rock image
 */
Rock.prototype.randomY = function() {
    var randomY = Math.floor((Math.random() * 3) + 1);
    switch (randomY) {
        case 1:
            randomNumY = data.ROW3 - data.ROCK_GAP;
            break;
        case 2:
            randomNumY = data.ROW4 - data.ROCK_GAP;
            break;
        case 3:
            randomNumY = data.ROW5 - data.ROCK_GAP;
            break;
    }
    return randomNumY;
};

/*
 * This method makes the rock disappear
 */
Rock.prototype.vanish = function() {
    this.y = 1000;
};

/*
 * This method makes the rock appear
 */
Rock.prototype.appear = function() {
    this.x = this.randomX();
    while (this.x === gemBlue.x || this.x === gemGreen.x) {
      this.x = this.randomX();
    }
    this.y = this.randomY();
    while (this.y === gemBlue.y || this.y === gemGreen.y) {
      this.y = this.randomY();
    }
};

/*
 * The class Key, which takes care of a key
 */
var Key = function() {
    this.sprite = 'images/Key.png';
    this.x = this.randomX();
    this.y = this.randomY();
};

/*
 * This method takes care of the collision between key and player
 */
Key.prototype.update = function() {
    if ((player.x > this.x || player.x + data.BOY_WIDTH_LESS > this.x) && (player.x < this.x + data.KEY_WIDTH - 20 || player.x + data.BOY_WIDTH_LESS < this.x + data.KEY_WIDTH - 20) && this.y === player.y - (data.KEY_GAP - data.PLAYER_GAP)) {
        player.addKey();
        this.vanish();
    }
};

/*
 * This method renders the key
 */
Key.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 * This method returns a random x position for the image of the key
 */
Key.prototype.randomX = function() {
    var randomX = Math.floor((Math.random() * 5) + 1);
    switch (randomX) {
        case 1:
            randomNumX = data.COL1;
            break;
        case 2:
            randomNumX = data.COL2;
            break;
        case 3:
            randomNumX = data.COL3;
            break;
        case 4:
            randomNumX = data.COL4;
            break;
        case 5:
            randomNumX = data.COL5;
            break;
    }
    return randomNumX;
};

/*
 * This method returns a random y position for the image of the key
 */
Key.prototype.randomY = function() {
    var randomY = Math.floor((Math.random() * 3) + 1);
    switch (randomY) {
        case 1:
            randomNumY = data.ROW3 - data.KEY_GAP;
            break;
        case 2:
            randomNumY = data.ROW4 - data.KEY_GAP;
            break;
        case 3:
            randomNumY = data.ROW5 - data.KEY_GAP;
            break;
    }
    return randomNumY;
};

/*
 * This method makes the key disappear
 */
Key.prototype.vanish = function() {
    this.y = 1100;
};

/*
 * This method makes the key appear
 */
Key.prototype.appear = function() {
    this.x = this.randomX();
    while (this.x === rock.x || this.x === gemBlue.x || this.x === gemGreen.x) {
        this.x = this.randomX();
    }
    this.y = this.randomY();
    while (this.y === rock.y || this.y === gemBlue.y || this.y === gemGreen.y) {
        this.y = this.randomY();
    }
};

/*
 * This is the super class for all 3 Gem subclasses
 */
var Gem = function() {
    this.x = 0;
    this.y = 1200;
};

Gem.prototype.randomX = function() {
    var randomX = Math.floor((Math.random() * 5) + 1);
    switch (randomX) {
        case 1:
            randomNumX = data.COL1;
            break;
        case 2:
            randomNumX = data.COL2;
            break;
        case 3:
            randomNumX = data.COL3;
            break;
        case 4:
            randomNumX = data.COL4;
            break;
        case 5:
            randomNumX = data.COL5;
            break;
          }
    return randomNumX;
};

Gem.prototype.randomY = function() {
    var randomY = Math.floor((Math.random() * 3) + 1);
    switch (randomY) {
        case 1:
            randomNumY = data.ROW3 - data.GEM_GAP;
            break;
        case 2:
            randomNumY = data.ROW4 - data.GEM_GAP;
            break;
        case 3:
            randomNumY = data.ROW5 - data.GEM_GAP;
            break;
    }
    return randomNumY;
};

Gem.prototype.update = function() {
    if ((player.x > this.x || player.x + data.BOY_WIDTH_LESS > this.x) && (player.x < this.x + data.GEM_WIDTH - 20 || player.x + data.BOY_WIDTH_LESS < this.x + data.GEM_WIDTH - 20) && this.y === player.y - (data.GEM_GAP - data.PLAYER_GAP)) {
        this.action();
        this.vanish();
    }
};

Gem.prototype.appear = function() {
    this.x = this.randomX();
    while (this.x === rock.x || this.x === key.x) {
        this.x = this.randomX();
    }
    this.y = this.randomY();
    while (this.y === rock.y || this.y === key.y) {
        this.y = this.randomY();
    }
};

Gem.prototype.vanish = function() {
    this.y = 1200;
};

/*
 * This is the class GemBlue, which is a subclass of Gem
 */
var GemBlue = function() {
    Gem.call(this);
    this.sprite = 'images/Gem Blue.png';
};

GemBlue.prototype = Object.create(Gem.prototype);

GemBlue.prototype.constructor = GemBlue;

GemBlue.prototype.render = function() {
    ctx.save();
    ctx.scale(1, 0.8);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y / 0.8);
    ctx.restore();
};

GemBlue.prototype.action = function() {
    player.changeGemBlue();
};


var GemGreen = function() {
    Gem.call(this);
    this.sprite = 'images/Gem Green.png';
};

GemGreen.prototype = Object.create(Gem.prototype);

GemGreen.prototype.constructor = GemGreen;

GemGreen.prototype.render = function() {
    ctx.save();
    ctx.scale(1, 0.8);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y / 0.8);
    ctx.restore();
};

GemGreen.prototype.action = function() {
    player.changeGemGreen();
};

/*
 * Instantiation of enemy objects
 * Enter the initial speed of all three enemies in the second place between the parentheses
 * in var enemy1, var enemy2 and var enemy3 or leave default values in place.
 * After changing the values, save this file and run index.html in your browser to start the game.
 */
var enemy1 = new Enemy(1, 20);
var enemy2 = new Enemy(2, 25);
var enemy3 = new Enemy(3, 30);

/*
 * Instantiation of all other objects
 * Do not change this!
 */
var allEnemies = [enemy1, enemy2, enemy3];
var player = new Player();
var rock = new Rock();
var key = new Key();
var gemBlue = new GemBlue();
var gemGreen = new GemGreen();

/*
 * This listens for key presses and sends the keys to
 * Player.handleInput() method.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
