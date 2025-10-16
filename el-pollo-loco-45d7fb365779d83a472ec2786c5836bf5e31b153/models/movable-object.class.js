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

    isColliding(object) {
        return (
            this.x + this.width - this.offset.right > object.x + object.offset.left &&
            this.x + this.offset.left < object.x + object.width - object.offset.right &&
            this.y + this.height - this.offset.bottom > object.y + object.offset.top &&
            this.y + this.offset.top < object.y + object.height - object.offset.bottom
        );
    }

    isJumpingOn(object) {
        return (
            this.x + this.width - this.offset.right > object.x + object.offset.left &&
            this.x + this.offset.left < object.x + object.width - object.offset.right &&
            this.y + this.height - this.offset.bottom < object.y + object.offset.top &&
            this.y + this.offset.top < object.y + object.height - object.offset.bottom
        );
    }

    getHit() {
        if (!this.isHurt()) {
            this.health -= 20;
            if (this.health < 0) {
                this.health = 0;
            } else {
                this.lastHit = new Date().getTime();
            }
        }
    }

    collectCoin() {
        this.coins += 10;
    }

    collectBottle() {
        this.bottles += 20;
    }

    looseBottle() {
        this.bottles -= 20;
    }

    isHurt() {
        let timespan = new Date().getTime() - this.lastHit;
        timespan = timespan / 1000;
        return timespan < 1;
    }

    isDead() {
        return this.health == 0;
    }

    playAnimation(images) {
        if (!isGamePaused) {
            let i = this.currentImage % images.length;
            this.img = this.imageCache[images[i]];
            this.currentImage++;
        }
    }

    applyGravity(acceleration) {
        setInterval(() => {
            if (!isGamePaused) {
                if (this.isAirborne() || this.speedY > 0) {
                    this.y -= this.speedY;
                    this.speedY -= acceleration;
                }
            }
        }, 1000 / 25);
    }

    isAirborne() {
        if (!(this instanceof ThrowableBottle)) {
            return this.y < 135;
        } else {
            return true;
        }
    }

    autoMove(speed) {
        // return setInterval(() => {
        this.x -= speed;
        // }, 1000/60);
    }

    playSound(sound) {
        sound.play();
    }

    resetSound(sound) {
        sound.pause();
        sound.currentTime = 0;
    }

    pauseSound(sound) {
        sound.pause();
    }
}
