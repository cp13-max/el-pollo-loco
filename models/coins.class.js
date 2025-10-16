class Coin extends DrawableObject {
    height = 100;
    width = 100;
    offset = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30,
    };

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage('img/8_coin/coin_2.png')
        this.saveDefaultStatus(defaultCoins, x, y)
    }

}
