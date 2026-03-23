class World {
    enemies = [];
    boss = [];
    amountOfEnemies;
    bottles = [];
    amountOfBottles;
    coins = [];
    amountOfCoins;
    clouds = [];
    amountOfClouds;
    backgroundObjects = [];
    level_length;
    main = [];
    throwableBottles = [];
    CollisionIntervals = [];
    CollisionIntervalsBoss = [];
    GAME_MUSIC = new Audio('sounds/game-music-loop-1.mp3');
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthBar = new HealthBar();
    coinBar = new CoinBar();
    bottleBar = new BottleBar();
    bossHealth = [];
    checkItemCollision;
    checkBottles;
    checkHeroPosition;

    constructor(canvas, keyboard, level) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setLevel(level);
        this.setWorld();
        this.drawWorld();
        this.startCollisionChecks();
    }

    startCollisionChecks() {
        this.checkItemCollision = this.itemCollisionCheck();
        this.checkBottles = bottleCheck(this);
        this.checkHeroPosition = this.HeroPositionCheck();
        this.checkForEnemyCollision(this);
    }

    /**
     * an interval that checks for players position,
     * so bosses animation can be played if certain threshold is crossed.
     * clears itself afterwards.
     * @returns
     */
    HeroPositionCheck() {
        return setInterval(() => {
            if (this.main.x > 2009) {
                clearInterval(this.checkHeroPosition);
                this.boss[0].alertAnimation();
            }
        }, 1000 / 60);
    }

    /**
     * an interval that checks if player collides with the two stage items (bottle, coin)
     * @returns
     */
    itemCollisionCheck() {
        return setInterval(() => {
            checkHeroCoinCollision(this);
            checkHeroBottleCollision(this);
        }, 1000 / 60);
    }

    /**
     * for each enemy an interval is set, that checks if player collides with that enemy.
     * either enemy dies or player takes a hit.
     */
    checkForEnemyCollision() {
        checkForSmallEnemies(this);
        checkForBoss(this);
    }

    /**
     * plays deathanimations and removes defeated enemies from game.
     * in case of boss game ends in victory
     * @param {object} enemy
     */
    enemyDies(enemy) {
        enemy.isAlive = false;
        enemy.clearStoppableIntervals();
        enemy.deathAnimation();

        if (enemy instanceof Chicken) {
            this.main.playSound(this.main.SOUND_JUMPING_ENEMY, 1);
            setTimeout(() => {
                this.removeObjectFromGame(this.enemies, enemy);
            }, 500);
        }
        if (enemy instanceof Endboss) {
            setTimeout(() => {
                gameIsOver = true;
                this.removeObjectFromGame(this.boss, enemy);
                this.loadVictoryScreen();
            }, 1000);
        }
    }

    /**
     * removes objects from their corresponding arrays
     * @param {array} array
     * @param {object} object
     */
    removeObjectFromGame(array, object) {
        let index = array.indexOf(object);
        array.splice(index, 1);
    }

    /**
     * temporarly disables the function 'bottleCheck()', so that bottles cant be thrown in quick succsession
     */
    temporarilyDisableBottleCheck() {
        clearInterval(this.checkBottles);
        setTimeout(() => {
            this.checkBottles = bottleCheck(this);
        }, 500);
    }

    /**
     * calls multiple functions when player is hit
     */
    heroTakesHit(position) {
        if (!this.main.isHurt()) {
            this.main.getHit();
            this.main.damageThrowBack(position);
        }
        this.main.hasIdleTimeStarted = false;
        this.healthBar.setBarPercentage(this.main.health);
        if (this.main.isDead()) {
            setTimeout(() => {
                gameIsOver = true;
                loadGameOverScreen();
            }, 1200);
        }
    }

    /**
     * plays sound and animation of an breaking bottle after it collided with enemy and removes it afterwards from game
     * @param {object} bottle
     */
    bottleBreaks(bottle) {
        this.main.playSound(this.main.SOUND_BOTTLE_BREAK, 1);
        setTimeout(() => {
            this.main.resetSound(this.main.SOUND_BOTTLE_BREAK);
        }, 300);

        bottle.breakBottle();
        bottle.isBottleBroken = true;

        setTimeout(() => {
            this.removeObjectFromGame(this.throwableBottles, bottle);
        }, 360);
    }

    /**
     * checks if the palyer has bottles
     * @returns
     */
    heroHasBottles() {
        return this.bottleBar.percentages > 0;
    }

    /**
     * creates a new bottle(object) and throws it in current direction
     */
    throwBottle() {
        let newBottle = new ThrowableBottle(this.main.x, this.main.y);
        this.throwableBottles.push(newBottle);
        checkForBottleEnemyCollision(this, newBottle);
        newBottle.throwBottle(this.main.otherDirection);
        this.main.looseBottle();
        this.bottleBar.setBarPercentage(this.main.bottles);
    }

    /**
     * sets for each enemy an inteval which checks if thrown bottle is colliding with them
     * @param {object} bottle
     */

    /**
     * sets objects in level (enemies, items and backgroundobjects)
     * @param {object} level
     */
    setLevel(level) {
        this.enemies = level.enemies;
        this.boss = level.endboss;
        this.amountOfEnemies = this.enemies.length;
        this.bottles = level.bottles;
        this.amountOfBottles = this.bottles.length;
        this.coins = level.coins;
        this.amountOfCoins = this.coins.length;
        this.clouds = level.clouds;
        this.amountOfClouds = this.clouds.length;
        this.backgroundObjects = level.backgroundObjects;
        this.level_length = level.level_end;
    }

    /**
     * creates the player character and sets world music
     */
    setWorld() {
        this.main = new Main(this.level_length);
        this.main.world = this;
        this.bossHealth.push(new BossHealth());
        this.GAME_MUSIC.loop = true;
        this.GAME_MUSIC.play();
    }

    /**
     * draws all objects in the game
     */
    drawWorld() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);

        drawObjects(this);

        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(() => {
            self.drawWorld();
        });
    }

    /**
     * draws a single specific object
     * @param {object} object
     */
    addToMap(object) {
        if (object instanceof HealthBar || object instanceof CoinBar || object instanceof BottleBar) {
            object.x = -this.camera_x;
        }
        if (object instanceof BossHealth) {
            object.x = this.boss[0].x;
            object.y = this.boss[0].y - 15;
        }
        if (object.otherDirection) {
            this.flipImage(object);
        }
        object.draw(this.ctx);
        // object.drawFrame(this.ctx);

        if (object.otherDirection) {
            this.reflipImage(object);
        }
    }

    /**
     * draws all objects from a specific array (e.g clouds)
     * @param {array} objects
     */
    addObjectsToMap(objects) {
        try {
            objects.forEach((e) => {
                this.addToMap(e);
            });
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * changes the direction of all objects in game
     * @param {object} object
     */
    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x = object.x * -1;
    }

    /**
     * changes the direction all objects in game to normal
     * @param {object} object
     */
    reflipImage(object) {
        object.x = object.x * -1;
        this.ctx.restore();
    }

    /**
     * loads victory screen if boss dies
     */
    loadVictoryScreen() {
        this.main.resetSound(this.GAME_MUSIC);
        this.main.playSound(this.main.SOUND_VICTORY, 0.5);
        document.getElementById('start-screen').style.display = 'inline';
        document.getElementById('start-screen').src = 'img/9_intro_outro_screens/win/won_2.png';

        document.getElementById('restart-return').style.display = 'flex';
    }

    /*
     * resets the game to default status
     */
    resetGame() {
        this.resetAllObjects();
        this.resetSounds();
        if (gameIsOver) {
            removeGameOverScreen();
        }
        gameIsOver = false;
    }

    /**
     * resets all objects to default status
     */
    resetAllObjects() {
        resetEnemies(this);
        resetBottles(this);
        resetCoins(this);
        resetHero(this);
        resetClouds(this);
        this.bossHealth.push(new BossHealth());
        clearInterval(this.checkHeroPosition);
        this.checkHeroPosition = this.HeroPositionCheck();
    }

    /**
     * resets the game music
     */
    resetSounds() {
        this.main.resetSound(this.main.SOUND_VICTORY);
        this.main.resetSound(this.GAME_MUSIC);
        this.main.playSound(this.GAME_MUSIC, 0.1);
    }
}
