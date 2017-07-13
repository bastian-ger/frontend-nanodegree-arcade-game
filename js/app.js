// some important data
var data = {
    row1: 465,
    row2: 382,
    row3: 299,
    row4: 216,
    row5: 133,
    row6: 50,
    tileHeight: 83,
    enemyGap: 78,
    playerGap: 63
};

// Enemies our player must avoid
var Enemy = function(row, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = 0;
    switch (row) {
      case 1:
          this.y = data.row3 - data.enemyGap;
          break;
      case 2:
          this.y = data.row4 - data.enemyGap;
          break;
      case 3:
          this.y = data.row5 - data.enemyGap;
          break;
    }
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (this.x > 505) {
        this.x = 0;
    }
    else {
        this.x = this.x + (this.speed * dt);
    }
// this.y MUST be added! >>>>>>>>>>>>>>>>>>>
    if (player.x > this.x && player.x < this.x + this.sprite.width) {
        player.gameReset();
        enemy.gameReset();
    }
};
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.gameReset = function() {
    this.x = 0;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.sprite = 'char-boy.png';
    this.x = data.width / 2 - (this.sprite.width / 2);
    this.y = data.row1 - data.playerGap;
};

Player.prototype.update = function(dt) {
    // see Karol's recommendations
};

Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            if (this.x >= data.width / 5) {
                this.x = this.x - (data.width / 5);
            }
            break;
        case 'up':
            if (this.y < data.row5 - data.playerGap) {
                this.gameReset();
                for (var i = 0; i < allEnemies.length; i++) {
                    allEnemies[i].gameReset();
                }
            }
            else {
                this.y = this.y - data.tileHeight;
            }
            break;
        case 'right':
            if (this.x <= (data.width / 5) * 4) {
                this.x = this.x + (data.width / 5);
            }
            break;
        case 'down':
            if (this.y <= data.height.row1 - data.playerGap) {
                  this.y = this.y + data.tileHeight;
            }
            break;
    }
};

Player.prototype.gameReset = function() {
    this.x = data.width / 2 - (this.sprite.width / 2);
    this.y = data.row1 - data.playerGap;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var enemy1 = new Enemy(1, 3);
var enemy2 = new Enemy(2, 10);
var enemy3 = new Enemy(3, 15);

var allEnemies = [enemy1, enemy2, enemy3];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
