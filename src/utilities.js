// @ts-nocheck

class Vector2 {
    static create(x, y) {
        return new p5.Vector(x, y)
    }

    static get zero() { return new p5.Vector(0, 0) }
    static get one() { return new p5.Vector(1, 1) }
    static get right() { return new p5.Vector(1, 0) }

    static lerp(from, to, value) {
        from.x = from.x + (to.x - from.x) * value
        from.y = from.y + (to.y - from.y) * value

        return from
    }
}

function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min)
}

// Retorna o número, ainda com o sinal, de menor módulo
function minAbs(a, b, c) {
    if(arguments.length === 2) {
        const x = Math.abs(a)
        const y = Math.abs(b)

        return Math.min(x, y) === x ? a : b
    }

    if(arguments.length === 3) {
        const x = Math.abs(a)
        const y = Math.abs(b)
        const z = Math.abs(c)

        const min = Math.min(x, y, z)

        if(min === x)
            return a
        else if(min === y)
            return b
        else
            return c
    }

    const abs = [...arguments]
    abs.forEach((n, i) => abs[i] = Math.abs(n))
    const i = abs.indexOf(Math.min(...abs))

    return arguments[i]
}

function multiText(textArgs = [], font, string) {
    let current = 'font'
    let offset = 0
    let argsFrom1 = textArgs.slice(1)
    let size = undefined

    for (const key in arguments) {
        if(key == 0) continue;

        if(current === 'font') {
            textFont(arguments[key])

            current = 'string'
        } else {
            if(typeof arguments[key] === 'number') {
                push()

                size = arguments[key]
                textSize(size)

                continue;
            }

            text(arguments[key], textArgs[0] + offset, ...argsFrom1)

            offset += textWidth(arguments[key])

            if(size !== undefined) {
                pop()
                size = undefined
            }

            current = 'font'
        }
    }
}