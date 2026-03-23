class ChickenSmall extends Chicken {
    width = 80;
    height = 80;
     IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];
    IMAGES_DEAD = ['img/3_enemies_chicken/chicken_small/2_dead/dead.png'];

     constructor(x, y) {
        super();
        this.loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_WALKING);
        this.x = x;
        this.y = y;
        
        this.saveDefaultStatus(defaultEnemies, x, y);
        this.setStoppableInterval(this.animate.bind(this), 100);
    }

}