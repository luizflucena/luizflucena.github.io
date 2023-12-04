class Trash extends GameObject {
    constructor(x, y, callback = () => {}) {
        super(Vector2.create(x*100, y*100))

        this.hasBeenDisposed = false
        this.type = undefined
        const rand = Math.floor(Math.random() * 5) + 1 // Número aleatório de 1 a 5
        this.typeIndex = rand - 1
        switch (rand) {
            case 1:
                this.type = 'plastic'
                this.sprite = spriteSheets.trash.getSprite(1, 1)
                break;

            case 2:
                this.type = 'paper'
                this.sprite = spriteSheets.trash.getSprite(2, 1)
                break;

            case 3:
                this.type = 'metal'
                this.sprite = spriteSheets.trash.getSprite(3, 1)
                break;

            case 4:
                this.type = 'glass'
                this.sprite = spriteSheets.trash.getSprite(4, 1)
                break;

            case 5:
                this.type = 'organic'
                this.sprite = spriteSheets.trash.getSprite(5, 1)
                break;
        }

        this.physics.tag = 'trash'
        this.physics.enabled = true
        this.physics.dynamic = true
        this.setPickupCallback(callback)
    }

    dispose() {
        this.hasBeenDisposed = true
    }

    setPickupCallback(action = () => {}) {
        this.physics.setCollisionCallback(() => {
            action()
            if(!sounds.sfx.trash.isPlaying())
                sounds.sfx.trash.play()
            this.disable()
        })
    }
}