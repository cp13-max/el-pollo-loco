class Cloud extends MovableObject{
    y = 15
    width = 600
    height = 200
    speed = .22

    constructor(range) {
        super().loadImage('img/5_background/layers/4_clouds/1.png')
        this.x = (Math.random() * 500) + range;
        this.animate();
        this.saveDefaultStatus(defaultClouds, range)
    }
    
    animate() {
        
        setInterval(() => {
            if (!isGamePaused) {
            this.autoMove(1)
        }}, 100);
        
    }
}