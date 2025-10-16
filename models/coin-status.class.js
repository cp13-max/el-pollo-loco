class CoinBar extends StatusBar {
    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png'
    ]

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setBarPercentage(0);
        this.x = 0;
        this.y = 50;
        this.width = 200;
        this.height = 70;
    }
}