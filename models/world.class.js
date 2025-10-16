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

    HeroPositionCheck() {
        return setInterval(() => {
            if (this.main.x > 2009) {
                clearInterval(this.checkHeroPosition);
                this.boss[0].alertAnimation();
            }
        }, 1000 / 60);
    }

    bottleCheck() {
        return setInterval(() => {
            if (this.keyboard.F) {
                if (this.heroHasBottles()) {
                    this.main.playSound(this.main.SOUND_SWOOSH);
                    setTimeout(() => {
                        this.main.resetSound(this.main.SOUND_SWOOSH);
                    }, 400);
                    this.throwBottle();
                    this.temporarilyDisableBottleCheck();
                }
            }
        }, 100);
    }

    itemCollisionCheck() {
        return setInterval(() => {
            this.checkHeroCoinCollision();
            this.checkHeroBottleCollision();
        }, 1000 / 60);
    }

    checkForEnemyCollision() {
        this.enemies.forEach((enemy) => {
            let interval = setInterval(() => {
                if (this.main.isColliding(enemy) && enemy.isAlive) {
                    if (this.main.isAirborne()) {
                        this.enemyDies(enemy);
                    } else {
                        this.heroTakesHit();
                        this.main.playSound(this.main.SOUND_DAMAGE);
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
                    this.main.playSound(this.main.SOUND_DAMAGE);
                    setTimeout(() => {
                        this.main.resetSound(this.main.SOUND_DAMAGE);
                    }, 500);
                }
                
            }, 1000 / 60);
            this.CollisionIntervalsBoss.push(interval)
        });
    }

    enemyDies(enemy) {
        enemy.isAlive = false;
        enemy.clearStoppableIntervals();
        enemy.deathAnima();

        if (enemy instanceof Chicken) {
            this.main.playSound(this.main.SOUND_JUMPING_ENEMY);
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

    checkHeroCoinCollision() {
        this.coins.forEach((coin) => {
            if (this.main.isColliding(coin)) {
                this.main.collectCoin();
                let newCollectSound = new Audio('sounds/collect.mp3')
                if (isMusicMute) {
                    newCollectSound.volume = 0
                }
                this.main.playSound(newCollectSound);
                this.coinBar.setBarPercentage(this.main.coins);
                this.removeObjectFromGame(this.coins, coin);
            }
        });
    }

    checkHeroBottleCollision() {
        this.bottles.forEach((bottle) => {
            if (this.main.isColliding(bottle)) {
                this.main.collectBottle();
                let newCollectSound = new Audio('sounds/collect.mp3')
                if (isMusicMute) {
                    newCollectSound.volume = 0
                }
                this.main.playSound(newCollectSound);
                this.bottleBar.setBarPercentage(this.main.bottles);
                this.removeObjectFromGame(this.bottles, bottle);
            }
        });
    }

    removeObjectFromGame(array, object) {
        let index = array.indexOf(object);
        array.splice(index, 1);
    }

    temporarilyDisableBottleCheck() {
        clearInterval(this.checkBottles);
        setTimeout(() => {
            this.checkBottles = this.bottleCheck();
        }, 500);
    }

    heroTakesHit() {
        this.main.getHit();
        this.main.hasIdleTimeStarted = false;
        this.main.damageThrowBack();
        this.healthBar.setBarPercentage(this.main.health);
        if (this.main.isDead()) {
            setTimeout(() => {
                gameIsOver = true;
                this.loadGameOverScreen();
            }, 1000);
        }
    }

    bottleBreaks(bottle) {
        this.main.playSound(this.main.SOUND_BOTTLE_BREAK);
        setTimeout(() => {
            this.main.resetSound(this.main.SOUND_BOTTLE_BREAK);
        }, 300);

        bottle.breakBottle();
        bottle.isBottleBroken = true;

        setTimeout(() => {
            this.removeObjectFromGame(this.throwableBottles, bottle);
        }, 360);
    }

    heroHasBottles() {
        return this.bottleBar.percentages > 0;
    }

    throwBottle() {
        let newBottle = new ThrowableBottle(this.main.x, this.main.y);
        this.throwableBottles.push(newBottle);
        this.checkForBottleEnemyCollision(newBottle);
        newBottle.throwBottle(this.main.otherDirection);
        this.main.looseBottle();
        this.bottleBar.setBarPercentage(this.main.bottles);
    }

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
                    boss.hitsTaken++;

                    if (boss.hitsTaken >= 3) {
                        this.enemyDies(boss);
                    }
                }
            });
        }, 1000 / 60);
    }

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

    setWorld() {
        this.main = new Main(this.level_length);
        this.main.world = this;
        this.GAME_MUSIC.loop = true;
        this.GAME_MUSIC.play();
    }

    muteAllMusic() {
        this.GAME_MUSIC.volume = 0;
        this.main.SOUND_VICTORY.volume = 0;
        this.main.SOUND_WALKING.volume = 0;
        this.main.SOUND_JUMPING.volume = 0;
        this.main.SOUND_JUMPING_ENEMY.volume = 0;
        this.main.SOUND_DAMAGE.volume = 0;
        this.main.SOUND_BOTTLE_BREAK.volume = 0;
        this.main.SOUND_COLLECT.volume = 0;
        this.main.SOUND_SWOOSH.volume = 0;
        this.boss[0].SOUND_CLUCKING.volume = 0;
    }

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
        this.boss[0].SOUND_CLUCKING.volume = 0.5;
    }

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
        this.addObjectsToMap(this.bottles);
        this.addObjectsToMap(this.coins);

        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(() => {
            self.drawWorld();
        });
    }

    addToMap(object) {
        if (object instanceof HealthBar || object instanceof CoinBar || object instanceof BottleBar) {
            object.x = -this.camera_x;
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

    addObjectsToMap(objects) {
        try {
            objects.forEach((e) => {
                this.addToMap(e);
            });
        } catch (error) {
            console.log(error);
        }
    }

    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x = object.x * -1;
    }

    reflipImage(object) {
        object.x = object.x * -1;
        this.ctx.restore();
    }

    resetGame() {
        this.resetAllObjects();
        this.resetSounds();
        if (gameIsOver) {
            this.removeGameOverScreen();
        }
        gameIsOver = false;
    }

    resetAllObjects() {
        this.resetObjects('enemies');
        this.resetObjects('bottles');
        this.resetObjects('coins');
        this.resetObjects('hero');
        this.resetObjects('clouds');
        clearInterval(this.checkHeroPosition);
        this.checkHeroPosition = this.HeroPositionCheck();
    }

    resetSounds() {
        this.main.resetSound(this.main.SOUND_VICTORY);
        this.main.resetSound(this.GAME_MUSIC);
        this.main.playSound(this.GAME_MUSIC);
    }

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

    removeGameOverScreen() {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('start-screen').src = 'img/9_intro_outro_screens/game_over/game over!.png';

        document.getElementById('restart-button').style.display = 'none';
    }

    resetEnemies() {
        this.enemies.forEach((enemy) => {
            enemy.clearStoppableIntervals();
        });
        this.enemies = [];
        this.CollisionIntervals.forEach(clearInterval);
        this.CollisionIntervals = [];
        for (let index = 0; index < this.amountOfEnemies; index++) {
            const coordinates = defaultEnemies[index];
            this.enemies.push(new Chicken(coordinates[0], coordinates[1]));
        }

        this.boss.forEach((boss) => {
            boss.clearStoppableIntervals();
            boss.resetSound(boss.SOUND_CLUCKING);
        });
        this.boss = [];
        this.CollisionIntervalsBoss.forEach(clearInterval)
        
        this.boss.push(new Endboss(2880 - 300, 100));
        this.checkForEnemyCollision();
    }

    resetBottles() {
        this.bottles = [];
        for (let index = 0; index < this.amountOfBottles; index++) {
            const coordinates = defaultBottles[index];
            this.bottles.push(new Bottle(coordinates[0], coordinates[1]));
        }
    }

    resetCoins() {
        this.coins = [];
        for (let index = 0; index < this.amountOfCoins; index++) {
            const coordinates = defaultCoins[index];
            this.coins.push(new Coin(coordinates[0], coordinates[1]));
        }
    }

    resetClouds() {
        this.clouds = [];
        for (let index = 0; index < this.amountOfClouds; index++) {
            const coordinates = defaultClouds[index];
            this.clouds.push(new Cloud(coordinates[0]));
        }
    }

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
        clearInterval(this.main.controlsAndAnimas);
        this.main.controlsAndAnimas = this.main.controlsAndAnimations();
    }

    loadGameOverScreen() {
        document.getElementById('start-screen').style.display = 'inline';
        document.getElementById('start-screen').src = 'img/9_intro_outro_screens/game_over/game over!.png';

        document.getElementById('restart-button').style.display = 'inline';
    }

    loadVictoryScreen() {
        this.main.resetSound(this.GAME_MUSIC);
        this.main.playSound(this.main.SOUND_VICTORY);
        document.getElementById('start-screen').style.display = 'inline';
        document.getElementById('start-screen').src = 'img/9_intro_outro_screens/win/won_2.png';

        document.getElementById('restart-button').style.display = 'inline';
    }
}
