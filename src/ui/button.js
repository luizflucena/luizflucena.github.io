var _buttonMode = 'corner'
function buttonMode(mode) {
    _buttonMode = mode
}

function setupButtonListeners() {
    canvas.elt.addEventListener('click', () => {
        for (let i = 0; i < allButtons.length; ++i) {
            const button = allButtons[i]
            
            if(button.enabled && button.mouseOver()) {
                button.onClick()

                break;
            }
        }
    })
}

var allButtons = []
class Button {
    constructor(text = '', x = 0, y = 0, width = 300, height = 100, functions = {}) {
        if(_buttonMode === 'center') {
            x -= width/2
            y -= height/2
        }

        this.enabled = false

        this.position = Vector2.create(x, y)
        this._originalPosition = this.position.copy()
        this.size = Vector2.create(width, height)
        this._originalSize = this.size.copy()
        this.borderRadius = 10

        this.onClick = () => { sounds.sfx.click.play() }
        this.mouseIsPressed = () => {}
        this.onHover = () => {}
        this.onNotHover = () => {}
        this.onDraw = () => {}
        this.setCallbacks(functions)

        this.color = [1]
        this.texture = undefined
        this.imageOverlay = {
            image: undefined,
            size: undefined,
            padding: 0,
            offsetX: 0,
            offsetY: 0
        }

        this.text = {
            text: text,
            font: fonts.extrabold,
            size: 60,
            color: [0],
            offsetX: 0,
            offsetY: 0,
            align: CENTER
        }

        this.hitbox = new Hitbox(x, y, x + width, y + height)

        this.cache = {}

        allButtons.push(this)
    }

    get originalPosition() {
        return this._originalPosition
    }

    get originalSize() {
        return this._originalSize
    }

    setPosition(x, y) {
        if(_buttonMode === 'center') {
            x -= this.size.x/2
            y -= this.size.y/2
        }

        this.position.x = x
        this.position.y = arguments.length === 2 ? y : this.position.y
    }

    setCallbacks(functions = {}) {
        if(functions.onClick) this.onClick = () => { functions.onClick(this); sounds.sfx.click.play() }
        if(functions.mouseIsPressed) this.mouseIsPressed = () => { functions.mouseIsPressed(this) }
        if(functions.onHover) this.onHover = () => { functions.onHover(this) }
        if(functions.onNotHover) this.onNotHover = () => { functions.onNotHover(this) }
        if(functions.onDraw) this.onDraw = () => { functions.onDraw(this) }
    }

    extendLeftAnimation(speed, amount) {
        const anim = deltaTimeSeconds * speed

        this.size.x = Math.min(this.size.x + anim, this.originalSize.x + amount)
        this.position.x = Math.max(this.position.x - anim, this.originalPosition.x - amount)
    }
    contractToOriginal(speed) {
        const anim = deltaTimeSeconds * speed

        this.size.x = Math.max(this.size.x - anim, this.originalSize.x)
        this.position.x = Math.min(this.position.x + anim, this.originalPosition.x)
    }

    updateHitbox() {
        this.hitbox.set(this.position.x, this.position.y, this.position.x + this.size.x, this.position.y + this.size.y)
    }

    mouseOver() {
        return this.hitbox.testCollisionPoint(guiMouseX, guiMouseY).hasHit
    }

    draw() {
        if(!this.enabled) return;

        this.onDraw()

        if(this.mouseOver()) {
            this.onHover()

            if(mouseIsPressed) this.mouseIsPressed()
        }
        else {
            this.onNotHover()
        }

        push()
        rectMode(CORNER)
        
        fill(...this.color)
        if(this.texture !== undefined) texture(this.texture)
        rect(this.position.x, this.position.y, this.size.x, this.size.y,
            this.borderRadius, this.borderRadius, this.borderRadius, this.borderRadius)
            
        textFont(this.text.font)
        textSize(this.text.size)
        textAlign(this.text.align, CENTER)
        fill(...this.text.color)

        text(this.text.text, this.position.x + this.text.offsetX, this.position.y + this.text.offsetY, this.size.x, this.size.y)

        pop()

        if(this.imageOverlay.image !== undefined) {
            const p = this.imageOverlay.padding
            const offX = this.imageOverlay.offsetX
            const offY = this.imageOverlay.offsetY
            const size = this.imageOverlay.size
            image(this.imageOverlay.image, this.position.x + p/2 + offX, this.position.y + p/2 + offY, (size || this.size.x - p), (size || this.size.y - p))
        }

        // this.hitbox.draw()
    }
}