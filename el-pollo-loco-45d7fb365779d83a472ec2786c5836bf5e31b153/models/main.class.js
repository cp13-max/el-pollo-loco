class Main extends MovableObject {
    x = 120;
    y = 135;
    height = 300;
    width = 100;
    speed = 5;
    idleTimeStart = 0;
    hasIdleTimeStarted = false;
    controlsAndAnimas;
    world;

    SOUND_WALKING = new Audio('sounds/walking-outside.mp3');
    SOUND_JUMPING = new Audio('sounds/jump2.mp3');
    SOUND_JUMPING_GROUND = new Audio('sounds/fallingOnGround.mp3');
    SOUND_JUMPING_ENEMY = new Audio('sounds/jumpOnEnemy.mp3');
    SOUND_GAME_OVER = new Audio('sounds/gameOver.mp3');
    SOUND_VICTORY = new Audio('sounds/victory.mp3');
    SOUND_DAMAGE = new Audio('sounds/damage.mp3');
    SOUND_SWOOSH = new Audio('sounds/swoosh2.mp3');
    SOUND_BOTTLE_BREAK = new Audio('sounds/bottleBreak.mp3');
    SOUND_COLLECT = new Audio('sounds/collect.mp3');

    offset = {
        top: 130,
        right: 25,
        bottom: 15,
        left: 25,
    };

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png',
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png',
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ];

    constructor(level_end) {
        super();
        this.loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.animate(level_end);
        this.applyGravity(2);
        this.saveDefaultStatus(defaultHero, this.x, this.y);
        this.controlsAndAnimas = this.controlsAndAnimations();
    }

    damageThrowBack() {
        let throwBack = setInterval(() => {
            this.throwBack();
        }, 60);
        setTimeout(() => {
            clearInterval(throwBack);
        }, 500);
    }

    throwBack() {
        if (this.otherDirection) {
            this.x += 0.5;
        } else {
            this.x -= 0.5;
        }
    }

    animate(level_end) {
        setInterval(() => {
            if (!isGamePaused) {
                if (this.world.keyboard.RIGHT && this.x < level_end) {
                    this.moveRight();
                }
                if (this.world.keyboard.LEFT && this.x > 120) {
                    this.moveLeft();
                }

                this.world.camera_x = -this.x + 120;
            }
        }, 1000 / 60);
    }

    controlsAndAnimations() {
        return setInterval(() => {
            if (!isGamePaused) {
                if (this.isDead()) {
                    this.deathAnima();
                } else {
                    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.SPACE) {
                        this.hasIdleTimeStarted = false;
                    }
                    if (this.isHurt()) {
                        this.playAnimation(this.IMAGES_HURT);
                    }
                    if (this.world.keyboard.SPACE & !this.isAirborne()) {
                        this.jump();

                        this.playSound(this.SOUND_JUMPING);
                        setTimeout(() => {
                            this.resetSound(this.SOUND_JUMPING);
                        }, 500);
                    }

                    if (this.isAirborne()) {
                        this.playAnimation(this.IMAGES_JUMPING);
                    }
                    if (
                        this.world.keyboard.RIGHT & !this.isAirborne() ||
                        this.world.keyboard.LEFT & !this.isAirborne()
                    ) {
                        this.playSound(this.SOUND_WALKING);
                        this.playAnimation(this.IMAGES_WALKING);
                    }

                    if (!this.world.keyboard.RIGHT & !this.world.keyboard.LEFT || this.isAirborne()) {
                        this.resetSound(this.SOUND_WALKING);
                    }

                    if (
                        !this.world.keyboard.RIGHT &
                        !this.world.keyboard.LEFT &
                        !this.world.keyboard.SPACE &
                        !this.isAirborne() &
                        !this.isHurt()
                    ) {
                        if (this.isIdle() == 'long idle') {
                            this.playAnimation(this.IMAGES_LONG_IDLE);
                        } else if (this.isIdle() == 'idle') {
                            this.playAnimation(this.IMAGES_IDLE);
                        } else {
                            this.loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
                        }

                        if (!this.hasIdleTimeStarted) {
                            this.idleTimeStart = new Date().getTime();
                        }
                        this.hasIdleTimeStarted = true;
                    }
                }
            }
        }, 100);
    }

    isIdle() {
        let timespan = new Date().getTime() - this.idleTimeStart;
        timespan /= 1000;

        if (timespan > 10) {
            return 'long idle';
        }
        if (timespan > 5) {
            return 'idle';
        }
    }

    deathAnima() {
        this.playAnimation(this.IMAGES_DEAD);
        this.playAnimation(this.IMAGES_DEAD);
        this.damageThrowBack();
        this.resetSound(this.SOUND_WALKING);
        this.y += 20;
        setTimeout(() => {
            clearInterval(this.controlsAndAnimas);
        }, 1000);
    }

    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }

    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = true;
    }

    jump() {
        this.speedY = 30;
    }
}
