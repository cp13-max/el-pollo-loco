class HealthBar extends StatusBar {
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setBarPercentage(100);
        this.x = 0;
        this.y = 0;
        this.width = 200;
        this.height = 70;
    }
}