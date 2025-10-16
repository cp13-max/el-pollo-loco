let level1;
function setLevel1() {
    level1 = new Level(
   
        [
            new Chicken(540, 330),
            new Chicken(760, 330),
            new Chicken(940, 330),
            new Chicken(1280, 330),
            new Chicken(1780, 330),
            
        ],
        [   
            new Endboss(2880 - 300, 100) 
        ],
        [
            new Bottle(300, 330),
            new Bottle(700, 330),
            new Bottle(1000, 330),
            new Bottle(1800, 330),
            new Bottle(1900, 330)
        ],
        [
            new Coin(400, 355),
            new Coin(1100, 355),
            new Coin(1100, 155),
            new Coin(1400, 355),
            new Coin(1700, 355),
            new Coin(1700, 155),
            new Coin(1800, 155),
            new Coin(1900, 355),
            new Coin(1900, 155),
            new Coin(1950, 355),
        ],
        2,
        canvasWidth
    )
    defaultStatusLoaded = true
}
 

