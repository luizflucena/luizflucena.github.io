class TrashBin extends GameObject {
    constructor(x, y, callback = () => {}) {
        super(Vector2.create(x*100, y*100), Vector2.create(3, 1))

        this.sprite = textures.sprites.bins

        this.physics.enabled = true
        this.physics.trigger = true
        this.physics.setCollisionEnterCallback(callback)
    }
}