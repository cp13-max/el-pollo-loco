class Endboss extends MovableObject {
    walkingAnima;
    alertAnima;
    attackAnima;
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];
    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    SOUND_CLUCKING = new Audio('sounds/chicken-cluck.mp3');

    offset = {
        top: 65,
        right: 5,
        bottom: 15,
        left: 5,
    };
    hitsTaken = 0;
    con;
    constructor(x, y) {
        super();
        this.loadImage('img/4_enemie_boss_chicken/2_alert/G5.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.y = y;
        this.height = 350;
        this.width = 200;
        this.speed = 7;
    }

    animate() {
        if (!isGamePaused) {
            this.autoMove(this.speed);
        }
    }

    alertAnimation() {
        this.setMovement();
        this.setSelfDeletingInterval(() => this.playAnimation(this.IMAGES_WALKING), 500 / 4, 500);
        setTimeout(() => {
            this.setSelfDeletingInterval(() => this.playAnimation(this.IMAGES_ALERT), 500 / 4, 500);
            setTimeout(() => {
                this.setStoppableInterval(() => this.playAnimation(this.IMAGES_ATTACK), 100);
                this.playCluckingSound();
            }, 500);
        }, 500);
    }

    setMovement() {
        this.setStoppableInterval(this.animate.bind(this), 100);
    }

    playCluckingSound() {
        this.SOUND_CLUCKING.loop = true;
        this.playSound(this.SOUND_CLUCKING);
    }

    checkForPausedMusic() {
        if (isGamePaused) {
            this.pauseSound(this.SOUND_CLUCKING);
        } else {
            this.playSound(this.SOUND_CLUCKING);
        }
    }

    deathAnima() {
        this.currentImage = 0;
        this.resetSound(this.SOUND_CLUCKING);
        this.clearStoppableIntervals();
        this.setStoppableInterval(() => this.playAnimation(this.IMAGES_DEAD), 500 / 4);
        // this.setStoppableInterval(this.proximityMove.bind(this));
        setTimeout(() => {
            this.clearStoppableIntervals();
        }, 1000);
    }

    proximityMove() {
        console.log(this.speed);
        console.log(this.hitsTaken);
    }
}
