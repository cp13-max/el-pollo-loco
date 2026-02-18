class DrawableObject {
    x;
    y;
    width;
    height;
    img;
    imageCache = {};
    currentImage = 0;
    intervalIDs = []

    /**
     * creates an image element
     * @param {string} path 
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * creates mutiple images from an array
     * @param {array} array 
     */
    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * draws an object (enemies, hero, items etc.)
     * @param {object} ctx 
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * shows the borders/frame of an object, helpful for collision detection.
     * turned off during game
     * @param {object} ctx 
     */
    drawFrame(ctx) {
        if (
            this instanceof Main ||
            this instanceof Chicken ||
            this instanceof Endboss ||
            this instanceof Bottle ||
            this instanceof Coin ||
            this instanceof ThrowableBottle
        ) {
            ctx.beginPath();
            ctx.lineWidth = '6';
            ctx.strokeStyle = 'red';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = '6';
            ctx.strokeStyle = 'blue';
            ctx.rect(
                this.x + this.offset.left,
                this.y + this.offset.top,
                this.width - this.offset.right - this.offset.left,
                this.height - this.offset.top - this.offset.bottom
            );
            ctx.stroke();
        }
    }
    
    /**
     * saves the default position of some objects in an array
     * @param {array} array 
     * @param {num} posX 
     * @param {num} posY 
     */
    saveDefaultStatus(array, posX, posY) {
        if (!defaultStatusLoaded) {
            array.push([posX, posY])
        }
        
    }
    
    /**
     * sets an interval and pushes it in array, so it can be cleared later
     * @param {function} func 
     * @param {num} time 
     */
    setStoppableInterval(func, time) {
        let id = setInterval(func, time);
        this.intervalIDs.push(id)
    }

    /**
     * sets an interval which clears itself after set time
     * @param {function} func 
     * @param {num} time1 
     * @param {num} time2 
     */
    setSelfDeletingInterval(func,time1, time2) {
        let id = setInterval(func, time1);
        setTimeout(() => {
            clearInterval(id)
        }, time2);
    }
    
    /**
     * clears all intervals in an array
     */
    clearStoppableIntervals() {
        this.intervalIDs.forEach(clearInterval)
    }
}
