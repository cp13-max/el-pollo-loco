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
        this.checkItemCollision = this.itemCollisionCheck();
        this.checkBottles = this.bottleCheck();
        this.checkHeroPosition = this.HeroPositionCheck();
        this.checkForEnemyCollision();
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
     * an interval that checks if bottlethrowbutton(F) is pressed.
     * in that case bottle is thrown.
     * @returns
     */
    bottleCheck() {
        return setInterval(() => {
            if (this.keyboard.F) {
                if (this.heroHasBottles()) {
                    this.main.playSound(this.main.SOUND_SWOOSH, 1);
                    setTimeout(() => {
                        this.main.resetSound(this.main.SOUND_SWOOSH);
                    }, 400);
                    this.throwBottle();
                    this.temporarilyDisableBottleCheck();
                }
            }
        }, 100);
    }

    /**
     * an interval that checks if player collides with the two stage items (bottle, coin)
     * @returns
     */
    itemCollisionCheck() {
        return setInterval(() => {
            this.checkHeroCoinCollision();
            this.checkHeroBottleCollision();
        }, 1000 / 60);
    }

    /**
     * for each enemy an interval is set, that checks if player collides with that enemy.
     * either enemy dies or player takes a hit.
     */
    checkForEnemyCollision() {
        this.enemies.forEach((enemy) => {
            let interval = setInterval(() => {
                if (this.main.isColliding(enemy) && enemy.isAlive) {
                    if (this.main.isAirborne() && this.main.isFalling()) {
                        this.enemyDies(enemy);
                    } else {
                        this.heroTakesHit();
                        this.main.playSound(this.main.SOUND_DAMAGE, 1);
                        setTimeout(() => {
                            this.main.resetSound(this.main.SOUND_DAMAGE);
                        }, 500);
                    }
                }
            }, 1000 / 60);
            this.CollisionIntervals.push(interval);
        });
        this.boss.forEach((boss) => {
            let interval = setInterval(() => {
                if (this.main.isColliding(boss)) {
                    this.heroTakesHit();
                    this.main.playSound(this.main.SOUND_DAMAGE, 1);
                    setTimeout(() => {
                        this.main.resetSound(this.main.SOUND_DAMAGE);
                    }, 500);
                }
            }, 1000 / 60);
            this.CollisionIntervalsBoss.push(interval);
        });
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
     * checks if player collides with a coin.
     * in that case coin is collected and removed from stage
     */
    checkHeroCoinCollision() {
        this.coins.forEach((coin) => {
            if (this.main.isColliding(coin)) {
                this.main.collectCoin();
                let newCollectSound = new Audio('sounds/collect.mp3');
                if (musicIsmute) {
                    newCollectSound.volume = 0;
                }
                this.main.playSound(newCollectSound, 1);
                this.coinBar.setBarPercentage(this.main.coins);
                this.removeObjectFromGame(this.coins, coin);
            }
        });
    }

    /**
     * checks if player collides with bottles.
     * in that case bottle is collected and removed from stage
     */
    checkHeroBottleCollision() {
        this.bottles.forEach((bottle) => {
            if (this.main.isColliding(bottle)) {
                this.main.collectBottle();
                let newCollectSound = new Audio('sounds/collect.mp3');
                if (musicIsmute) {
                    newCollectSound.volume = 0;
                }
                this.main.playSound(newCollectSound, 1);
                this.bottleBar.setBarPercentage(this.main.bottles);
                this.removeObjectFromGame(this.bottles, bottle);
            }
        });
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
            this.checkBottles = this.bottleCheck();
        }, 500);
    }

    /**
     * calls multiple functions when player is hit
     */
    heroTakesHit() {
        if (!this.main.isHurt()) {
            this.main.getHit();
            this.main.damageThrowBack();
        }
        this.main.hasIdleTimeStarted = false;
        this.healthBar.setBarPercentage(this.main.health);
        if (this.main.isDead()) {
            setTimeout(() => {
                gameIsOver = true;
                this.loadGameOverScreen();
            }, 1000);
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
        this.checkForBottleEnemyCollision(newBottle);
        newBottle.throwBottle(this.main.otherDirection);
        this.main.looseBottle();
        this.bottleBar.setBarPercentage(this.main.bottles);
    }

    /**
     * sets for each enemy an inteval which checks if thrown bottle is colliding with them
     * @param {object} bottle
     */
    checkForBottleEnemyCollision(bottle) {
        let interval = setInterval(() => {
            this.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    this.bottleBreaks(bottle);
                    clearInterval(interval);
                    this.enemyDies(enemy);
                }
            });

            this.boss.forEach((boss) => {
                if (bottle.isColliding(boss)) {
                    this.bottleBreaks(bottle);
                    clearInterval(interval);
                    boss.life -= 20;
                    this.bossHealth[0].setBarPercentage(boss.life);

                    if (boss.life <= 0) {
                        this.enemyDies(boss);
                        this.bossHealth = [];
                    }
                }
            });
        }, 1000 / 60);
    }

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
     * mutes all music in game
     */
    muteAllMusic() {
        // musicIsmute = true
        this.GAME_MUSIC.volume = 0;
        this.main.SOUND_VICTORY.volume = 0;
        this.main.SOUND_WALKING.volume = 0;
        this.main.SOUND_JUMPING.volume = 0;
        this.main.SOUND_JUMPING_ENEMY.volume = 0;
        this.main.SOUND_DAMAGE.volume = 0;
        this.main.SOUND_BOTTLE_BREAK.volume = 0;
        this.main.SOUND_COLLECT.volume = 0;
        this.main.SOUND_SWOOSH.volume = 0;
        if (this.boss[0]) {
            this.boss[0].SOUND_CLUCKING.volume = 0;
        }
    }

    /**
     * sets(unmutes) all music in game to a certain value
     */
    unMuteAllMusic() {
        this.GAME_MUSIC.volume = 0.1;
        this.main.SOUND_VICTORY.volume = 0.5;
        this.main.SOUND_WALKING.volume = 1;
        this.main.SOUND_JUMPING.volume = 1;
        this.main.SOUND_JUMPING_ENEMY.volume = 1;
        this.main.SOUND_DAMAGE.volume = 1;
        this.main.SOUND_BOTTLE_BREAK.volume = 1;
        this.main.SOUND_COLLECT.volume = 1;
        this.main.SOUND_SWOOSH.volume = 1;
        if (this.boss[0]) {
            this.boss[0].SOUND_CLUCKING.volume = 0.5;
        }
    }

    /**
     * draws all objects in the game
     */
    drawWorld() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.clouds);
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.main);
        this.addObjectsToMap(this.throwableBottles);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.boss);
        this.addObjectsToMap(this.bossHealth);
        this.addObjectsToMap(this.bottles);
        this.addObjectsToMap(this.coins);

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

    /*
     * resets the game to default status
     */
    resetGame() {
        this.resetAllObjects();
        this.resetSounds();
        if (gameIsOver) {
            this.removeGameOverScreen();
        }
        gameIsOver = false;
    }

    /**
     * resets all objects to default status
     */
    resetAllObjects() {
        this.resetObjects('enemies');
        this.resetObjects('bottles');
        this.resetObjects('coins');
        this.resetObjects('hero');
        this.resetObjects('clouds');
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

    /**
     * resets single objects/all objects from an array to default status
     * @param {array} objects
     */
    resetObjects(objects) {
        switch (objects) {
            case 'enemies':
                this.resetEnemies();
                break;

            case 'bottles':
                this.resetBottles();
                break;

            case 'coins':
                this.resetCoins();
                break;

            case 'clouds':
                this.resetClouds();
                break;

            case 'hero':
                this.resetHero();
                break;
            default:
                break;
        }
    }

    /**
     * removes game over screen if game is reseted
     */
    removeGameOverScreen() {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('start-screen').src = 'img/9_intro_outro_screens/game_over/game over!.png';

        document.getElementById('restart-button').style.display = 'none';
    }

    /**
     * reset all enemies to default status
     */
    resetEnemies() {
        this.resetChicken();
        this.resetBoss();
    }

    /**
     * resets all non-boss enemies to default status
     */
    resetChicken() {
        this.enemies.forEach((enemy) => {
            enemy.clearStoppableIntervals();
        });
        this.enemies = [];
        this.CollisionIntervals.forEach(clearInterval);
        this.CollisionIntervals = [];
        this.enemies = [
            new Chicken(540, 330),
            new ChickenSmall(760, 350),
            new Chicken(940, 330),
            new ChickenSmall(1280, 350),
            new Chicken(1780, 330),
        ];
    }

    /**
     * resets the boss to default status
     */
    resetBoss() {
        this.boss.forEach((boss) => {
            boss.clearStoppableIntervals();
            boss.resetSound(boss.SOUND_CLUCKING);
        });
        this.boss = [];
        this.CollisionIntervalsBoss.forEach(clearInterval);

        this.boss.push(new Endboss(2880 - 300, 100));
        this.checkForEnemyCollision();
    }

    /**
     * resets all bottles(items)
     */
    resetBottles() {
        this.bottles = [];
        for (let index = 0; index < this.amountOfBottles; index++) {
            const coordinates = defaultBottles[index];
            this.bottles.push(new Bottle(coordinates[0], coordinates[1]));
        }
    }

    /**
     * resets all coins(items)
     */
    resetCoins() {
        this.coins = [];
        for (let index = 0; index < this.amountOfCoins; index++) {
            const coordinates = defaultCoins[index];
            this.coins.push(new Coin(coordinates[0], coordinates[1]));
        }
    }

    /**
     * reset all clouds(backgroundobjects)
     */
    resetClouds() {
        this.clouds = [];
        for (let index = 0; index < this.amountOfClouds; index++) {
            const coordinates = defaultClouds[index];
            this.clouds.push(new Cloud(coordinates[0]));
        }
    }

    /**
     * resets the plyer character
     */
    resetHero() {
        this.main.x = 120;
        this.main.y = 135;
        this.main.otherDirection = false;
        this.main.health = 100;
        this.healthBar.setBarPercentage(this.main.health);
        this.main.bottles = 0;
        this.bottleBar.setBarPercentage(this.main.bottles);
        this.main.coins = 0;
        this.coinBar.setBarPercentage(this.main.coins);
        clearInterval(this.main.movementAnimas);
        this.main.movementAnimas = this.main.movementAnimations();
    }

    /**
     * loads game over screen if player dies
     */
    loadGameOverScreen() {
        document.getElementById('start-screen').style.display = 'inline';
        document.getElementById('start-screen').src = 'img/9_intro_outro_screens/game_over/game over!.png';

        document.getElementById('restart-button').style.display = 'inline';
    }

    /**
     * loads victory screen if boss dies
     */
    loadVictoryScreen() {
        this.main.resetSound(this.GAME_MUSIC);
        this.main.playSound(this.main.SOUND_VICTORY, 0.5);
        document.getElementById('start-screen').style.display = 'inline';
        document.getElementById('start-screen').src = 'img/9_intro_outro_screens/win/won_2.png';

        document.getElementById('restart-button').style.display = 'inline';
    }
}
