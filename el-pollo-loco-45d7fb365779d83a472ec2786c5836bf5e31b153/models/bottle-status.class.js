class BottleBar extends StatusBar {
    IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',

        
    ]

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setBarPercentage(0);
        this.x = 0;
        this.y = 100;
        this.width = 200;
        this.height = 70;
    }
}