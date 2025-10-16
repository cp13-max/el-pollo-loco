class Level {
    enemies;
    endboss;
    bottles;
    coins;
    clouds = [];
    backgroundObjects = [];
    level_end

    constructor(enemies, endboss, bottles, coins, length, width){
        this.enemies = enemies;
        this.endboss = endboss
        this.bottles = bottles;
        this.coins = coins;
        this.level_end = (length * canvasWidth) * 2 - 600;

        this.clouds.push(new Cloud(width * (-1)))
        this.backgroundObjects.push(new BackgroundObject('img/5_background/layers/air.png', width * (-1)))
        this.backgroundObjects.push(new BackgroundObject('img/5_background/layers/3_third_layer/2.png', width * (-1)))
        this.backgroundObjects.push(new BackgroundObject('img/5_background/layers/2_second_layer/2.png', width * (-1)))
        this.backgroundObjects.push(new BackgroundObject('img/5_background/layers/1_first_layer/2.png', width * (-1)))

        for (let index = 0; index < length; index++) {
            
            this.clouds.push(new Cloud(width * index))
            this.backgroundObjects.push(new BackgroundObject('img/5_background/layers/air.png', width * 2 * index))
            this.backgroundObjects.push(new BackgroundObject('img/5_background/layers/3_third_layer/1.png', width * 2 * index))
            this.backgroundObjects.push(new BackgroundObject('img/5_background/layers/2_second_layer/1.png', width * 2 * index))
            this.backgroundObjects.push(new BackgroundObject('img/5_background/layers/1_first_layer/1.png', width * 2 * index))
    
            this.clouds.push(new Cloud(width * (index + 1)))
            this.backgroundObjects.push(new BackgroundObject('img/5_background/layers/air.png', width * (index * 2 + 1)))
            this.backgroundObjects.push(new BackgroundObject('img/5_background/layers/3_third_layer/2.png', width * (index * 2 + 1)))
            this.backgroundObjects.push(new BackgroundObject('img/5_background/layers/2_second_layer/2.png', width * (index * 2 + 1)))
            this.backgroundObjects.push(new BackgroundObject('img/5_background/layers/1_first_layer/2.png', width * (index * 2 + 1)))
        
            this.clouds.push(new Cloud(width * (index + 2)))
        }
       
}}