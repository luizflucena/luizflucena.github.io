class Umbrella extends GameObject {
    constructor(x, y) {
        super(Vector2.create(x*100, y*100 + 100), Vector2.create(3, 3))

        this.sprite = textures.sprites.umbrella

        this.physics.tag = 'umbrella'
        this.physics.enabled = true
        this.physics.trigger = true
        this.physics.setCollisionCallback((ctx, player, hit) => {
            const normalDotGravity = hit.normal.y * Math.sign(ctx.gravity)

            // Ângulo entre vetores unitários = arccos(v1 . v2)
            if(Math.abs(Math.acos(normalDotGravity)) <= PI/4 && ctx.velocity.y < -20) {
                // ctx.velocity.y = 36
                ctx.velocity.y = Math.min(Math.abs(ctx.velocity.y), 36)

                if(!sounds.sfx.jump2.isPlaying())
                    sounds.sfx.jump2.play()
            }
        })

        this.physics.hitbox.set(-50, -10, 50, 35)
        this.physics.hitbox.transformHitbox(this.position, this.scale)
    }
}