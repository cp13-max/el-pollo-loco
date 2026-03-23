/**
 * resets the plyer character
 */
function resetHero(world) {
    world.main.x = 120;
    world.main.y = 135;
    world.main.otherDirection = false;
    world.main.health = 100;
    world.healthBar.setBarPercentage(world.main.health);
    world.main.bottles = 0;
    world.bottleBar.setBarPercentage(world.main.bottles);
    world.main.coins = 0;
    world.coinBar.setBarPercentage(world.main.coins);
    clearInterval(world.main.movementAnimas);
    world.main.movementAnimas = world.main.movementAnimations();
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
            if (world.main.isColliding(enemy) && enemy.isAlive) {
                if (world.main.isAirborne() && world.main.isFalling()) {
                    world.enemyDies(enemy);
                } else {
                    let position = world.main.FrontOrRear(enemy);

                    world.heroTakesHit(position);
                    world.main.playSound(world.main.SOUND_DAMAGE, 1);
                    setTimeout(() => {
                        world.main.resetSound(world.main.SOUND_DAMAGE);
                    }, 500);
                }
            }
        }, 1000 / 60);
        world.CollisionIntervals.push(interval);
    });
}

function checkForBoss(world) {
    world.boss.forEach((boss) => {
        let interval = setInterval(() => {
            if (world.main.isColliding(boss)) {
                let position = world.main.FrontOrRear(boss);
                world.heroTakesHit(position);
                world.main.playSound(world.main.SOUND_DAMAGE, 1);
                setTimeout(() => {
                    world.main.resetSound(world.main.SOUND_DAMAGE);
                }, 500);
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
                world.main.playSound(world.main.SOUND_SWOOSH, 1);
                setTimeout(() => {
                    world.main.resetSound(world.main.SOUND_SWOOSH);
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
        if (world.main.isColliding(coin)) {
            world.main.collectCoin();
            let newCollectSound = new Audio('sounds/collect.mp3');
            if (musicIsmute) {
                newCollectSound.volume = 0;
            }
            world.main.playSound(newCollectSound, 1);
            world.coinBar.setBarPercentage(world.main.coins);
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
        if (world.main.isColliding(bottle)) {
            world.main.collectBottle();
            let newCollectSound = new Audio('sounds/collect.mp3');
            if (musicIsmute) {
                newCollectSound.volume = 0;
            }
            world.main.playSound(newCollectSound, 1);
            world.bottleBar.setBarPercentage(world.main.bottles);
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
    world.addToMap(world.main);
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
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('start-screen').src = 'img/9_intro_outro_screens/game_over/game over!.png';
    document.getElementById('restart-return').style.display = 'none';
}

/**
 * loads game over screen if player dies
 */
function loadGameOverScreen() {
    document.getElementById('start-screen').style.display = 'inline';
    document.getElementById('start-screen').src = 'img/9_intro_outro_screens/game_over/game over!.png';

    document.getElementById('restart-return').style.display = 'flex';
}

/**
 * mutes all music in game
 */
function muteAllMusic(world) {
    world.GAME_MUSIC.volume = 0;
    world.main.SOUND_VICTORY.volume = 0;
    world.main.SOUND_WALKING.volume = 0;
    world.main.SOUND_JUMPING.volume = 0;
    world.main.SOUND_JUMPING_ENEMY.volume = 0;
    world.main.SOUND_DAMAGE.volume = 0;
    world.main.SOUND_BOTTLE_BREAK.volume = 0;
    world.main.SOUND_COLLECT.volume = 0;
    world.main.SOUND_SWOOSH.volume = 0;
    if (world.boss[0]) {
        world.boss[0].SOUND_CLUCKING.volume = 0;
    }
}

/**
 * sets(unmutes) all music in game to a certain value
 */
function unMuteAllMusic(world) {
    world.GAME_MUSIC.volume = 0.1;
    world.main.SOUND_VICTORY.volume = 0.5;
    world.main.SOUND_WALKING.volume = 1;
    world.main.SOUND_JUMPING.volume = 1;
    world.main.SOUND_JUMPING_ENEMY.volume = 1;
    world.main.SOUND_DAMAGE.volume = 1;
    world.main.SOUND_BOTTLE_BREAK.volume = 1;
    world.main.SOUND_COLLECT.volume = 1;
    world.main.SOUND_SWOOSH.volume = 1;
    if (world.boss[0]) {
        world.boss[0].SOUND_CLUCKING.volume = 0.5;
    }
}
