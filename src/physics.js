// @ts-nocheck
const defaultGravity = 9.8 * 4
const minVelocity = 1e-2 // Velocidades abaixo disso são arredondadas pra 0

var allPhysicsObjects = []
class PhysicsObject {
    constructor(parentObject, tag = '') {
        this.parentObject = parentObject
        this.tag = tag
        this.ignoredTags = []

        this.enabled = false // Se colisões envolvendo o objeto serão calculadas
        this.dynamic = false // Se o objeto deve ser afetado pela física ou permanecer estático
        this.trigger = false

        this._onCollision = () => {}
        this._onCollisionEnter = () => {}
        this._onCollisionExit = () => {}
        this._collisionEnterFlag = false
        this._isCollidingWithPlayer = false // Só funciona se for usada setCollisionCallback()

        this.grounded = false // Se o objeto está no chão

        this.hitbox = new Hitbox()
        this.gravity = defaultGravity
        this.friction = 0.25
        this.horizontalDrag = 0

        this.velocity = Vector2.zero

        allPhysicsObjects.push(this)
    }

    reset() {
        this.velocity = Vector2.zero
    }

    // action(physicsObject, parentObject, HitInfo)
    setCollisionCallback(action = (phisObj, parentObj, hit) => {}) {
        this._onCollision = action
    }
    setCollisionEnterCallback(action = (phisObj, parentObj, hit) => {}) {
        this._onCollisionEnter = (phisObj, parentObj, hit) => {
            if(phisObj.tag !== 'player') return;

            if(this._collisionEnterFlag === false)
                action(phisObj, parentObj, hit)

            this._collisionEnterFlag = true
        }
    }
    setCollisionExitCallback(action = (phisObj, parentObj, hit) => {}) {
        this._onCollisionExit = action
    }

    applyForce(x, y) {
        this.velocity.x += x
        this.velocity.y += y
    }

    ignoreTag(tag) {
        this.ignoredTags.push(tag)
    }

    isTagIgnored(tag) {
        for(let i = 0; i < this.ignoredTags.length; ++i)
            if(tag === this.ignoredTags[i]) return true;

        return false
    }

    updatePosition(objPosition) {
        if(!this.enabled || !this.dynamic || this.trigger) return

        this.velocity.y -= this.gravity * deltaTimeSeconds

        // Resistência do ar
        const drag = this.horizontalDrag
        if(Math.abs(this.velocity.x) > minVelocity)
            this.velocity.x -= Math.sign(this.velocity.x) * Math.min(drag, Math.abs(this.velocity.x))

        // Testar colisões com todas as hitbox da cena
        this.grounded = false
        for(let i = 0; i < allPhysicsObjects.length; ++i) {
            const obj = allPhysicsObjects[i]

            if(obj === this || !obj.enabled) continue;

            const hit = this.hitbox.testCollisionAABB(obj, this.velocity)
            if(hit.hasHit) {
                if(this.tag === 'player') obj._isCollidingWithPlayer = true
                obj._onCollisionEnter(this, this.parentObject, hit)
                obj._onCollision(this, this.parentObject, hit)
                if(obj.trigger || this.isTagIgnored(obj.tag)) continue;

                const normalDotGravity = hit.normal.y * Math.sign(this.gravity)

                // Compensar velocidade
                this.velocity.sub(hit.overshoot)

                // Atrito
                const friction = Math.min(this.friction, obj.friction)
                if(Math.abs(this.velocity.x) > minVelocity)
                    this.velocity.x -= Math.sign(this.velocity.x) * normalDotGravity * Math.min(friction, Math.abs(this.velocity.x))

                // Ângulo entre vetores unitários = arccos(v1 . v2)
                // Se o ângulo da superfície está entre -45 e 45 graus, o objeto está no chão
                if(Math.abs(Math.acos(normalDotGravity)) <= PI/4)
                    this.grounded = true
            } else {
                if(this.tag === 'player') {
                    obj._isCollidingWithPlayer = false

                    if(obj._collisionEnterFlag) {
                        obj._onCollisionExit(this, this.parentObject, hit)
                        obj._collisionEnterFlag = false
                    }
                        
                }
            }
        }

        if(Math.abs(this.velocity.x) < minVelocity) this.velocity.x = 0
        if(Math.abs(this.velocity.y) < minVelocity) this.velocity.y = 0

        objPosition.add(this.velocity.x*normalizedDeltaTime, this.velocity.y*normalizedDeltaTime)
        this.hitbox.transformHitbox(objPosition, 1)
    }
}

// Hitbox simples AABB
class Hitbox {
    // Dois pontos opostos da diagonal de um quadrado (min e max)
    constructor(minX = -50, minY = -50, maxX = 50, maxY = 50) {
        this.localMin = new p5.Vector(minX, minY)
        this.localMax = new p5.Vector(maxX, maxY)

        this.min = this.localMin.copy()
        this.max = this.localMax.copy()
    }

    set(minX, minY, maxX, maxY) {
        this.localMin.set(minX, minY)
        this.localMax.set(maxX, maxY)

        this.min = this.localMin.copy()
        this.max = this.localMax.copy()
    }

    // Para manter a posição e o tamanho da hitbox proporcionais ao objeto
    transformHitbox(position, scale) {
        const min = this.localMin
        const max = this.localMax

        let transformMatrix = p5.Matrix.identity()
        transformMatrix.translate(position.array())
        if(typeof scale === 'number') {
            transformMatrix.scale(scale, scale, scale)
        } else {
            transformMatrix.scale(scale)
        }

        const minTransformedArray = transformMatrix.multiplyVec4(min.x, min.y, min.z, 1.)
        const maxTransformedArray = transformMatrix.multiplyVec4(max.x, max.y, max.z, 1.)

        this.min.set(minTransformedArray[0], minTransformedArray[1], 0.)
        this.max.set(maxTransformedArray[0], maxTransformedArray[1], 0.)
    }

    // Testar contato com outra hitbox AABB
    //
    // O parâmetro offset projeta a posição do objeto para calcularmos uma colisão
    // que ainda não aconteceu. Pode ser um vetor velocidade, por exemplo
    testCollisionAABB(physicsObj, offset) {
        const otherHitbox = physicsObj.hitbox

        // Para utilizar o offset aqui, em vez de testarmos a colisão movendo esta
        // hitbox de acordo com o offset, movemos, na verdade, o hitbox do outro objeto
        // na direção oposta do offset. É assim porque eu me confundi
        let otherMin, otherMax
        if(offset instanceof p5.Vector) {
            otherMin = otherHitbox.min.copy().sub(offset.x, offset.y)
            otherMax = otherHitbox.max.copy().sub(offset.x, offset.y)
        } else {
            otherMin = otherHitbox.min
            otherMax = otherHitbox.max
        }

        const hit = new HitInfo()

        hit.hasHit =
            this.max.x >= otherMin.x &&
            this.min.x <= otherMax.x &&
            this.max.y >= otherMin.y &&
            this.min.y <= otherMax.y

        hit.overshoot.x = minAbs(this.max.x - otherMin.x, this.min.x - otherMax.x)
        hit.overshoot.y = minAbs(this.max.y - otherMin.y, this.min.y - otherMax.y)
        if(minAbs(hit.overshoot.x, hit.overshoot.y) === hit.overshoot.x) {
            hit.overshoot.y = 0
            hit.normal.set(-Math.sign(hit.overshoot.x), 0)
        } else {
            hit.overshoot.x = 0
            hit.normal.set(0, -Math.sign(hit.overshoot.y))
        }

        return hit
    }

    testCollisionPoint(x, y) {
        const hit = new HitInfo()

        hit.hasHit =
            x >= this.min.x && x <= this.max.x &&
            y >= this.min.y && y <= this.max.y

        return hit
    }

    // Representação visual da hitbox para debug
    draw() {
        const min = this.min
        const max = this.max

        push()
        // resetMatrix()
        noFill()
        stroke(0, 1, 0)

        beginShape()

        vertex(min.x, min.y)
        vertex(min.x, max.y)
        vertex(max.x, max.y)
        vertex(max.x, min.y)

        endShape(CLOSE)

        pop()
    }
}

// Contém todas as informações necessárias a respeito de uma colisão
class HitInfo {
    constructor() {
        this.hasHit = false // Se está colidindo ou não no momento
        this.overshoot = Vector2.zero // Quanto o objeto atravessou a hitbox (passou do ponto de colisão)
        this.normal = Vector2.zero // Vetor normal da superfície com a qual se colidiu
    }
}