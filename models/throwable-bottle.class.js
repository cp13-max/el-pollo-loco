class ThrowableBottle extends MovableObject {
    height = 100;
    width = 100;
    speed = 10;
    offset = {
        top: 20,
        right: 40,
        bottom: 15,
        left: 40,
    };
    isBottleBroken = false;
    posY;
    posX;
    throwAnima

    IMAGES_BOTTLE_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    IMAGES_BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    constructor(x, y) {
        super();
        this.loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_BOTTLE_ROTATION);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.x = x + 20;
        this.y = y + 120;
        
    }

    /**
     * movement and gravity for this object(thrown bottle)
     * @param {*} direction 
     */
    motion(direction) {
        this.posX = setInterval(() => {
            if (!gameIsPaused) {
                if (direction) {
                    this.autoMoveLeft();
                } else {this.autoMoveRight();}
            
        }}, 1000/60);
        this.posY = setInterval(() => {
            if (!gameIsPaused) {
            this.y -= this.speedY;
            this.speedY -= 0.2;
    }}, 1000/60);
    }

    /**
     * move animation for this object
     * @param {*} direction 
     */
    throwBottle(direction) {
        
        this.throwAnima = setInterval(() => {
            
            this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
        }, 60);
        
        this.motion(direction);
    }

    /**
     * when thrown bottle breaks(hit enemy), movement is stopped and splash animation is played
     */
    breakBottle() {
        if (!this.isBottleBroken) {
            clearInterval(this.throwAnima)
            clearInterval(this.posX);
            clearInterval(this.posY);
            setInterval(() => {
                this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
            }, 60);
        }
    }

    /**
     * moves this object right along x-axis by set amount
     */
    autoMoveRight() {
        this.x += this.speed;
    }

    /**
     * moves this object left along x-axis by set amount
     */
    autoMoveLeft() {
        this.x -= this.speed;
    }
}
