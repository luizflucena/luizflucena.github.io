class SpriteSheet {
    constructor(rows, columns, spriteResolution = 16) {
        this.rows = rows
        this.columns = columns
        this.spriteResolution = spriteResolution
        this.images = []
    }

    getSpriteIndex(x, y) {
        return (x - 1) + (y - 1) * this.columns
    }

    getSprite(x, y) {
        return this.images[this.getSpriteIndex(x, y)]
    }
}

class GameAnimation {
    constructor(spriteSheet, framePause, from, to) {
        this.spriteSheet = spriteSheet
        this.spriteResolution = spriteSheet.spriteResolution
        // Número de frames do jogo entre cada mudança de frame da animação.
        this.framePause = framePause
        this.from = from || 0
        this.to = to || this.spriteSheet.images.length - 1

        this._currentSpriteIndex = this.from
        this._frameCount = 0
        this._paused = false
    }

    get length() {
        return this.to - this.from + 1
    }

    // A animação só é atualizada quando pedimos o sprite atual
    get currentSprite() {
        const images = this.spriteSheet.images

        if(this._paused || gameIsPaused) return images[this._currentSpriteIndex];

        if(this._frameCount >= this.framePause) {
            if(this._currentSpriteIndex === this.to)
                this._currentSpriteIndex = this.from
            else
                this._currentSpriteIndex += 1

            this._frameCount = 0
        }
        
        this._frameCount += 1

        return images[this._currentSpriteIndex]
    }

    // Quando digo AnimationFrame, é o número do quadro da animação tendo como 0 o
    // primeiro sprite da animação, em vez do primeiro sprite da sprite sheet inteira
    get currentAnimationFrame() {
        return this._currentSpriteIndex - this.from
    }

    setAnimationFrame(frameIndex) {
        this._currentSpriteIndex = this.from + frameIndex % this.length
    }

    pause() {
        this._paused = !this._paused
    }
}

function sliceSpriteSheet(name, fullImage, rowCount, columnCount) {
    const spriteWidth = fullImage.width/columnCount
    const spriteHeight = fullImage.height/rowCount
    const sheet = new SpriteSheet(rowCount, columnCount, spriteWidth)

    for(let y = 0; y < rowCount; ++y)
    for(let x = 0; x < columnCount; ++x) {
        const img = fullImage.get(x*spriteWidth, y*spriteHeight, spriteWidth, spriteHeight)
        img.loadPixels()

        let empty = true
        // A imagem não está vazia caso algum de seus pixels não seja transparente
        // (canal alpha != 0)
        for (let i = 3; i < img.pixels.length; i += 4) {
            if(img.pixels[i] !== 0) {
                empty = false
                break;
            }
        }

        if(!empty)
            sheet.images.push(img)
    }

    spriteSheets[name] = sheet
}