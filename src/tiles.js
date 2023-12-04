const tileSize = 100
const tileRes = 16

class Tile {
    constructor(x, y, texture = textures.tiles.sand) {
        this.position = Vector2.create(x, y)
        this.worldPosition = Vector2.create(x * tileSize, y * tileSize)
        this.texture = texture
    }

    draw() {
        shaders.pixelated.setUniform('uTexture', this.texture)
        square(this.worldPosition.x, this.worldPosition.y, tileSize)

        // this.physics.hitbox.draw()
    }
}

class Tilemap {
    constructor() {
        this.tiles = []

        this.colliders = []
    }

    addHitbox(minX, minY, maxX, maxY) {
        const physicsObj = new PhysicsObject(this)

        physicsObj.friction = 0.5

        if(typeof minX === 'number')
            physicsObj.hitbox.set(minX, minY, maxX, maxY)
        else
            physicsObj.hitbox.transformHitbox(minX, 1)
        
        this.colliders.push(physicsObj)

        return physicsObj.hitbox
    }

    addTile(x, y, texture, hasOwnHitbox = true) {
        for (let i = 0; i < this.tiles.length; ++i) {
            if(x === this.tiles[i].position.x && y === this.tiles[i].position.y) {
                this.tiles[i] = new Tile(x, y, texture)
                return;
            }
        }

        const tile = new Tile(x, y, texture)

        if(hasOwnHitbox)
            this.addHitbox(tile.worldPosition)

        this.tiles.push(tile)
    }

    // fonte: https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
    tileLineFill(x1, x2, y1, y2, thickness, texture, addHitbox = true) {
        const yOffset = y1 > y2 ? -1 : 1

        const dx = x2 - x1
        const dy = (y2 - y1) * yOffset
        let D = 2*dy - dx
        let y = y1

        const halfTile = tileSize/2
        let minX = x1*tileSize - halfTile, maxX
        let minY, maxY

        for (let x = x1; x <= x2; ++x) {
            if(D > 0) {
                minY = y*tileSize + halfTile*-Math.sign(thickness)
                maxY = (y + thickness)*tileSize + halfTile*-Math.sign(thickness)
                maxX = x*tileSize - halfTile
                if(minY > maxY) {
                    const aux = minY
                    minY = maxY
                    maxY = aux
                }
                if(addHitbox && x !== x1) this.addHitbox(minX, minY, maxX, maxY)
                minX = maxX

                y += yOffset
                D -= 2*dx
            }

            D += 2*dy

            for (let t = 0; t < Math.abs(thickness); ++t) {
                this.addTile(x, y + t * Math.sign(thickness), texture, false)
            }
        }

        minY = y*tileSize + halfTile*-Math.sign(thickness)
        maxY = (y + thickness)*tileSize + halfTile*-Math.sign(thickness)
        if(minY > maxY) {
            const aux = minY
            minY = maxY
            maxY = aux
        }
        maxX = x2*tileSize + halfTile
        if(addHitbox) this.addHitbox(minX, minY, maxX, maxY)
    }

    enableAllColliders() {
        for(let i = 0; i < this.colliders.length; ++i) {
            const collider = this.colliders[i]

            collider.enabled = true
        }
    }

    disableAllColliders() {
        for(let i = 0; i < this.colliders.length; ++i) {
            const collider = this.colliders[i]

            collider.enabled = false
        }
    }

    draw() {
        rectMode(CENTER)
        shader(shaders.pixelated)
        shaders.pixelated.setUniform('uSpriteRes', [tileRes, tileRes])

        for(let i = 0; i < this.tiles.length; ++i) {
            if(orthoScale <= 2*scaleProportionality + 1e-2) {
                if(
                    Math.abs(mainCam.eyeX - this.tiles[i].worldPosition.x) < 1400 &&
                    Math.abs(mainCam.eyeY - this.tiles[i].worldPosition.y) < 800
                )
                    this.tiles[i].draw()
            } else {
                if(
                    Math.abs(mainCam.eyeX - this.tiles[i].worldPosition.x) < 2000 &&
                    Math.abs(mainCam.eyeY - this.tiles[i].worldPosition.y) < 1200
                )
                    this.tiles[i].draw()
            }
        }

        resetShader()

        // for(let i = 0; i < this.colliders.length; ++i) {
        //     this.colliders[i].hitbox.draw()
        // }
    }
}