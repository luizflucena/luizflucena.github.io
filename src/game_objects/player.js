class Player extends GameObject {
    constructor(position = Vector2.zero, scale = Vector2.one) {
        super(position, scale)

        this.physics.tag = 'player'
        this.physics.ignoreTag('trash')

        this.maxVelocity = 15
        this.acceleration = 60
        this.animations = { walk: undefined, run: undefined, idle: undefined }
        this.directionX = 1

        this._controlsLocked = false
    }

    lockControls() {
        this._controlsLocked = true
    }
    unlockControls() {
        this._controlsLocked = false
    }

    walkLeft() {
        if(this._controlsLocked || gameIsPaused) return;

        player.physics.applyForce(-this.acceleration * deltaTimeSeconds, 0)

        if(player.physics.velocity.x < -player.maxVelocity)
            player.physics.velocity.x = -player.maxVelocity
    }

    walkRight() {
        if(this._controlsLocked || gameIsPaused) return;

        player.physics.applyForce(this.acceleration * deltaTimeSeconds, 0)

        if(player.physics.velocity.x > player.maxVelocity)
            player.physics.velocity.x = player.maxVelocity
    }

    jump() {
        if(this._controlsLocked || gameIsPaused) return;

        if(this.physics.grounded) {
            this.physics.velocity.y = 20

            if(!sounds.sfx.jump.isPlaying())
                sounds.sfx.jump.play()
        }
    }
}

var player = new Player(Vector2.create(0, 200))

function setupPlayer() {
    player.physics.enabled = true
    player.physics.dynamic = true
    player.physics.friction = 0.3
    player.physics.hitbox.localMin.sub(0, 50)
    player.scale.set(2, 2)

    player.animations.walk = new GameAnimation(spriteSheets.player, 10,
        spriteSheets.player.getSpriteIndex(1, 3),
        spriteSheets.player.getSpriteIndex(4, 3)
    )
    player.animations.run = new GameAnimation(spriteSheets.player, 8,
        spriteSheets.player.getSpriteIndex(15, 3),
        spriteSheets.player.getSpriteIndex(18, 3)
    )
    player.animations.idle = spriteSheets.player.getSprite(1, 3)

    player.sprite = player.animations.idle
}

function drawPlayer() {
    if(keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        player.directionX = -1
        player.walkLeft()
	}
	if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        player.directionX = 1
        player.walkRight()
	}
    if(keyIsDown(UP_ARROW) || keyIsDown(87) || keyIsDown(32)) {
        player.jump()
    }

    if(player.physics.velocity.y < 0) {
        player.physics.gravity = 3 * defaultGravity
    } else {
        player.physics.gravity = 1.5 * defaultGravity
    }

    if(Math.sign(player.scale.x) !== player.directionX)
        player.scale.x *= -1

    // player.physics.hitbox.draw()
    player.draw()

    if(player.physics.velocity.x !== 0)
        if(Math.abs(player.physics.velocity.x) < player.maxVelocity - 1) {
            player.changeAnimation(player.animations.walk, {
                setFrame: player.animation === player.animations.run ?
                    player.animations.run.currentAnimationFrame + 1 : undefined
            })
        }
        else {
            player.changeAnimation(player.animations.run, {
                setFrame: player.animation === player.animations.walk ?
                    player.animations.walk.currentAnimationFrame + 1 : undefined
            })
        }
    else
        player.removeAnimation()
}