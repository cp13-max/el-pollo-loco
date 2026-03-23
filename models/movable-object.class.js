class MovableObject extends DrawableObject {
    speed;
    otherDirection = false;
    speedY = 0;

    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };
    health = 100;
    bottles = 0;
    coins = 0;
    lastHit = 0;
    gamePaused = false;
    isAlive = true;

    constructor() {
        super();
    }

    /**
     * checks if an object is colliding with another object
     * @param {object} object
     * @returns boolean
     */
    isColliding(object) {
        return (
            this.x + this.width - this.offset.right > object.x + object.offset.left &&
            this.x + this.offset.left < object.x + object.width - object.offset.right &&
            this.y + this.height - this.offset.bottom > object.y + object.offset.top &&
            this.y + this.offset.top < object.y + object.height - object.offset.bottom
        );
    }

    FrontOrRear(object){
        if (this.x + this.width - this.offset.right > object.x + object.offset.left &&
            this.x + this.width - this.offset.right < object.x + object.width/2 + object.offset.left
        ) {
            return('front')
        }

    if (this.x + this.offset.left < object.x + object.width - object.offset.right &&
        this.x + this.offset.left > object.x + object.width/2 - object.offset.right
    ) {
            return('rear')
    }
    }
    /**
     * checks if player character is jumping on enemies/colliding from above
     * @param {object} object
     * @returns boolean
     */
    isJumpingOn(object) {
        return (
            this.x + this.width - this.offset.right > object.x + object.offset.left &&
            this.x + this.offset.left < object.x + object.width - object.offset.right &&
            this.y + this.height - this.offset.bottom < object.y + object.offset.top &&
            this.y + this.offset.top < object.y + object.height - object.offset.bottom
        );
    }

    /**
     * reduces life of player after taking a hit
     */
    getHit() {
        this.health -= 20;
        if (this.health < 0) {
            this.health = 0;
        }
        this.lastHit = new Date().getTime();
    }

    /**
     * updates coin counter/bar after coin is collected
     */
    collectCoin() {
        this.coins += 10;
    }

    /**
     * updates bottle counter/bar after bottle is collected
     */
    collectBottle() {
        this.bottles += 20;
    }

    /**
     * updates bottle counter/bar after bottle is thrown
     */
    looseBottle() {
        this.bottles -= 20;
    }

    /**
     * checks if player is hurt(invincible time)
     * @returns
     */
    isHurt() {
        let timespan = new Date().getTime() - this.lastHit;
        timespan = timespan / 1000;
        return timespan < 1;
    }

    wasRecentlyHit(){
        let timespan = new Date().getTime() - this.lastHit;
        timespan = timespan / 1000;
        return timespan < .5;
    }

    /**
     * checks if player is dead
     * @returns
     */
    isDead() {
        return this.health == 0;
    }

    /**
     * plays animation with images from an array
     * @param {array} images
     */
    playAnimation(images) {
        if (!gameIsPaused){
            let i = this.currentImage % images.length;
            this.img = this.imageCache[images[i]];
            this.currentImage++;
        }
    }

    /**
     * creates gravity effect on player character
     * @param {num} acceleration
     */
    applyGravity(acceleration) {
        setInterval(() => {
            if (!gameIsPaused) {
                if (this.isAirborne() || this.speedY > 0) {
                    this.y -= this.speedY;
                    this.speedY -= acceleration;
                }
            }
        }, 1000 / 25);
    }

    /**
     * checks if player is falling
     * @returns
     */
    isFalling() {
        return this.speedY < 0;
    }

    /**
     * checks if player is in the air
     * @returns
     */
    isAirborne() {
        if (!(this instanceof ThrowableBottle)) {
            return this.y < 135;
        } else {
            return true;
        }
    }

    /**
     * changes horizontal position(x) by a set amount
     * @param {num} speed
     */
    autoMove(speed) {
        // return setInterval(() => {
        this.x -= speed;
        // }, 1000/60);
    }

    /**
     * plays a given sound/music
     * @param {string} sound
     */
    playSound(sound, volume) {
        if (musicIsmute) {
            sound.volume = 0;
        } else {
            sound.volume = volume;
        }
        sound.play();
    }

    /**
     * resets a given sound/music
     * @param {string} sound
     */
    resetSound(sound) {
        sound.pause();
        sound.currentTime = 0;
    }

    /**
     * pauses a given sound/music
     * @param {string} sound
     */
    pauseSound(sound) {
        sound.pause();
    }
}
