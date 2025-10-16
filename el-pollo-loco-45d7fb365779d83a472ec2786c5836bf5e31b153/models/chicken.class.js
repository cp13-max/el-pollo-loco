class Chicken extends MovableObject {
    width = 120;
    height = 100;
    offset = {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5,
    };

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];
    IMAGES_DEAD = ['img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];

    constructor(x, y) {
        super();
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_WALKING);
        this.x = x;
        this.y = y;
        this.speed = 5 + Math.random() * 10; // 5 + Math.random() * 10
        this.saveDefaultStatus(defaultEnemies, x, y);
        this.setStoppableInterval(this.animate.bind(this), 100);
    }

    animate() {
        if (!isGamePaused) {
            this.moveAnima();
            this.autoMove(this.speed);
        }
    }

    moveAnima() {
        this.playAnimation(this.IMAGES_WALKING);
    }

    deathAnima() {
        this.playAnimation(this.IMAGES_DEAD);
    }

    
}
