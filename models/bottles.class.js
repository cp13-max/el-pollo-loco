class Bottle extends DrawableObject {
    height = 100;
    width = 100;
    offset = {
        top: 20,
        right: 25,
        bottom: 10,
        left: 45,
    };

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png')
        this.saveDefaultStatus(defaultBottles, x, y)
    }

}
