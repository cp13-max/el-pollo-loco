class BossHealth extends StatusBar {
    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/green/green100.png',
        'img/7_statusbars/2_statusbar_endboss/green/green80.png',
        'img/7_statusbars/2_statusbar_endboss/green/green60.png',
        'img/7_statusbars/2_statusbar_endboss/green/green40.png',
        'img/7_statusbars/2_statusbar_endboss/green/green20.png',
        'img/7_statusbars/2_statusbar_endboss/green/green0.png'
    ]

    constructor(){
        super();
        this.loadImages(this.IMAGES);
        this.setBarPercentage(100);
        this.x = 2580;
        this.y = 100;
        this.width = 200;
        this.height = 70;
    }
}