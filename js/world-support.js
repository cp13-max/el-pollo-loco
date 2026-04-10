/**
 * resets the plyer character
 */
function resetHero(world) {
    world.hero.x = 120;
    world.hero.y = 135;
    world.hero.dead = false;
    world.hero.otherDirection = false;
    world.hero.health = 100;
    world.healthBar.setBarPercentage(world.hero.health);
    world.hero.bottles = 0;
    world.bottleBar.setBarPercentage(world.hero.bottles);
    world.hero.coins = 0;
    world.coinBar.setBarPercentage(world.hero.coins);
    clearInterval(world.hero.movementAnimas);
    world.hero.movementAnimas = world.hero.movementAnimations();
}

/**
 * reset all enemies to default status
 */
function resetEnemies(world) {
    resetChicken(world);
    resetBoss(world);
}

/**
 * resets all non-boss enemies to default status
 */
function resetChicken(world) {
    world.enemies.forEach((enemy) => {
        enemy.clearStoppableIntervals();
    });
    world.enemies = [];
    world.CollisionIntervals.forEach(clearInterval);
    world.CollisionIntervals = [];
    world.enemies = [
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
function resetBoss(world) {
    world.boss.forEach((boss) => {
        boss.clearStoppableIntervals();
        boss.resetSound(boss.SOUND_CLUCKING);
    });
    world.boss = [];
    world.CollisionIntervalsBoss.forEach(clearInterval);

    world.boss.push(new Endboss(2880 - 300, 100));
    world.checkForEnemyCollision();
}

/**
 * resets all bottles(items)
 */
function resetBottles(world) {
    world.bottles = [];
    for (let index = 0; index < world.amountOfBottles; index++) {
        const coordinates = defaultBottles[index];
        world.bottles.push(new Bottle(coordinates[0], coordinates[1]));
    }
}

/**
 * resets all coins(items)
 */
function resetCoins(world) {
    world.coins = [];
    for (let index = 0; index < world.amountOfCoins; index++) {
        const coordinates = defaultCoins[index];
        world.coins.push(new Coin(coordinates[0], coordinates[1]));
    }
}

/**
 * reset all clouds(backgroundobjects)
 */
function resetClouds(world) {
    world.clouds = [];
    for (let index = 0; index < world.amountOfClouds; index++) {
        const coordinates = defaultClouds[index];
        world.clouds.push(new Cloud(coordinates[0]));
    }
}

function checkForSmallEnemies(world) {
    world.enemies.forEach((enemy) => {
        let interval = setInterval(() => {
            if (world.hero.isColliding(enemy) && enemy.isAlive) {
                if (world.hero.isAirborne() && world.hero.isFalling()) {
                    world.enemyDies(enemy);
                } else {
                    let position = world.hero.FrontOrRear(enemy);

                    world.heroTakesHit(position);
                }
            }
        }, 1000 / 60);
        world.CollisionIntervals.push(interval);
    });
}

function checkForBoss(world) {
    world.boss.forEach((boss) => {
        let interval = setInterval(() => {
            if (world.hero.isColliding(boss)) {
                let position = world.hero.FrontOrRear(boss);
                world.heroTakesHit(position);
            }
        }, 1000 / 60);
        world.CollisionIntervalsBoss.push(interval);
    });
}

/**
 * an interval that checks if bottlethrowbutton(F) is pressed.
 * in that case bottle is thrown.
 * @returns
 */
function bottleCheck(world) {
    return setInterval(() => {
        if (world.keyboard.F) {
            if (world.heroHasBottles()) {
                world.hero.playSound(world.hero.SOUND_SWOOSH, 1);
                setTimeout(() => {
                    world.hero.resetSound(world.hero.SOUND_SWOOSH);
                }, 400);
                world.throwBottle();
                world.temporarilyDisableBottleCheck();
            }
        }
    }, 100);
}

/**
 * checks if player collides with a coin.
 * in that case coin is collected and removed from stage
 */
function checkHeroCoinCollision(world) {
    world.coins.forEach((coin) => {
        if (world.hero.isColliding(coin)) {
            world.hero.collectCoin();
            let newCollectSound = new Audio('sounds/collect.mp3');
            if (musicIsmute) {
                newCollectSound.volume = 0;
            }
            world.hero.playSound(newCollectSound, 1);
            world.coinBar.setBarPercentage(world.hero.coins);
            world.removeObjectFromGame(world.coins, coin);
        }
    });
}

/**
 * checks if player collides with bottles.
 * in that case bottle is collected and removed from stage
 */
function checkHeroBottleCollision(world) {
    world.bottles.forEach((bottle) => {
        if (world.hero.isColliding(bottle)) {
            world.hero.collectBottle();
            let newCollectSound = new Audio('sounds/collect.mp3');
            if (musicIsmute) {
                newCollectSound.volume = 0;
            }
            world.hero.playSound(newCollectSound, 1);
            world.bottleBar.setBarPercentage(world.hero.bottles);
            world.removeObjectFromGame(world.bottles, bottle);
        }
    });
}

function checkForBottleEnemyCollision(world, bottle) {
    let interval = setInterval(() => {
        world.enemies.forEach((enemy) => {
            if (bottle.isColliding(enemy)) {
                world.bottleBreaks(bottle);
                clearInterval(interval);
                world.enemyDies(enemy);
            }
        });

        world.boss.forEach((boss) => {
            if (bottle.isColliding(boss)) {
                world.bottleBreaks(bottle);
                clearInterval(interval);
                boss.life -= 20;
                world.bossHealth[0].setBarPercentage(boss.life);

                if (boss.life <= 0) {
                    world.enemyDies(boss);
                    world.bossHealth = [];
                }
            }
        });
    }, 1000 / 60);
}

function drawObjects(world) {
    world.addObjectsToMap(world.backgroundObjects);
    world.addObjectsToMap(world.clouds);
    world.addToMap(world.healthBar);
    world.addToMap(world.coinBar);
    world.addToMap(world.bottleBar);
    world.addToMap(world.hero);
    world.addObjectsToMap(world.throwableBottles);
    world.addObjectsToMap(world.enemies);
    world.addObjectsToMap(world.boss);
    world.addObjectsToMap(world.bossHealth);
    world.addObjectsToMap(world.bottles);
    world.addObjectsToMap(world.coins);
}

/**
 * removes game over screen if game is reseted
 */
function removeGameOverScreen() {
    toggleMobileBar();
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('start-screen').src = 'img/9_intro_outro_screens/game_over/game over!.png';
    document.getElementById('restart-return').style.display = 'none';
}

/**
 * mutes all music in game
 */
function muteAllMusic(world) {
    world.GAME_MUSIC.volume = 0;
    world.hero.SOUND_VICTORY.volume = 0;
    world.hero.SOUND_WALKING.volume = 0;
    world.hero.SOUND_JUMPING.volume = 0;
    world.hero.SOUND_JUMPING_ENEMY.volume = 0;
    world.hero.SOUND_DAMAGE.volume = 0;
    world.hero.SOUND_BOTTLE_BREAK.volume = 0;
    world.hero.SOUND_COLLECT.volume = 0;
    world.hero.SOUND_SWOOSH.volume = 0;
    if (world.boss[0]) {
        world.boss[0].SOUND_CLUCKING.volume = 0;
    }
}

/**
 * sets(unmutes) all music in game to a certain value
 */
function unMuteAllMusic(world) {
    world.GAME_MUSIC.volume = 0.1;
    world.hero.SOUND_VICTORY.volume = 0.5;
    world.hero.SOUND_WALKING.volume = 1;
    world.hero.SOUND_JUMPING.volume = 1;
    world.hero.SOUND_JUMPING_ENEMY.volume = 1;
    world.hero.SOUND_DAMAGE.volume = 1;
    world.hero.SOUND_BOTTLE_BREAK.volume = 1;
    world.hero.SOUND_COLLECT.volume = 1;
    world.hero.SOUND_SWOOSH.volume = 1;
    if (world.boss[0]) {
        world.boss[0].SOUND_CLUCKING.volume = 0.5;
    }
}
