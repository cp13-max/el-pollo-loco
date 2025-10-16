class BackgroundObject extends MovableObject{
    
    y = 0;
    width = 720.6;
    height = 480

    constructor(imagePath, x) {
        super();
        this.loadImage(imagePath)
        this.x = x
    }
}