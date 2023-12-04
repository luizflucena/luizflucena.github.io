class GameObject {
    constructor(
        position = Vector2.zero,
        scale = Vector2.one
    ) {
        this.enabled = true

        this.position = position
        this.scale = scale

        this.sprite = undefined
        this.animation = undefined

        this.physics = new PhysicsObject(this)
        // Inicializar a hitbox com a mesma posição e escala iniciais do objeto
        this.physics.hitbox.transformHitbox(this.position, this.scale)
    }

    disable() {
        this.enabled = false
        this.physics.enabled = false
    }

    enable() {
        this.enabled = true
        this.physics.enabled = true
    }

    // Opções:
    // Definir o frame atual da nova animação como o mesmo da animação fornecida
    // { setFrame: number }
    changeAnimation(newAnimation, options = {}) {
        if(this.animation === newAnimation) return;

        if(options.setFrame)
            newAnimation.setAnimationFrame(options.setFrame)
        else
            newAnimation.setAnimationFrame(0)

        this.animation = newAnimation
    }

    removeAnimation() {
        this.animation = undefined
    }

    draw() {
        if(!this.enabled) return;

        push()
        
        translate(this.position)
        scale(this.scale)
        if(this.animation !== undefined) {
            shader(shaders.pixelated)
            shaders.pixelated.setUniform('uTexture', this.animation.currentSprite)
            shaders.pixelated.setUniform('uSpriteRes', [this.animation.spriteResolution, this.animation.spriteResolution])
        } else if(this.sprite !== undefined) {
            shader(shaders.pixelated)
            shaders.pixelated.setUniform('uTexture', this.sprite)
            shaders.pixelated.setUniform('uSpriteRes', [this.sprite.width, this.sprite.height])
        }
        square(0, 0, 100)
        
        pop()
        
        // this.physics.hitbox.draw()
        this.physics.updatePosition(this.position)
    }
}