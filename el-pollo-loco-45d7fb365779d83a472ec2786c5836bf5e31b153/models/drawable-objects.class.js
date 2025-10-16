class DrawableObject {
    x;
    y;
    width;
    height;
    img;
    imageCache = {};
    currentImage = 0;
    intervalIDs = []

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

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
    
    saveDefaultStatus(array, posX, posY) {
        if (!defaultStatusLoaded) {
            array.push([posX, posY])
        }
        
    }
    
    setStoppableInterval(func, time) {
        let id = setInterval(func, time);
        this.intervalIDs.push(id)
    }

    setSelfDeletingInterval(func,time1, time2) {
        let id = setInterval(func, time1);
        setTimeout(() => {
            clearInterval(id)
        }, time2);
    }
    
    clearStoppableIntervals() {
        this.intervalIDs.forEach(clearInterval)
    }
}
