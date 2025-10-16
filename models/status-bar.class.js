class StatusBar extends DrawableObject {
    

    IMAGES = [
        
    ];

    percentages;

    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.width = 200;
        this.height = 70;
    }

    setBarPercentage(percentages) {
        this.percentages = percentages;
        let path = this.IMAGES[this.setImage()];
        this.img = this.imageCache[path];
    }

    setImage() {
        if (this.percentages == 100) {
            return 0;
        } else if (this.percentages == 70 || this.percentages == 80 || this.percentages == 90) {
            return 1;
        } else if (this.percentages == 50 || this.percentages == 60) {
            return 2;
        } else if (this.percentages == 30  || this.percentages == 40) {
            return 3;
        } else if (this.percentages == 10 || this.percentages  == 20) {
            return 4;
        } else {
            return 5;
        }
    }
}
