// @ts-nocheck
var guiBuffer
function setupGui() {
    guiBuffer = createFramebuffer( { format: FLOAT } )
    guiBuffer.draw(() => {
        ortho(
            -width/2 * scaleProportionality,
            width/2 * scaleProportionality,
            -height/2 * scaleProportionality,
            height/2 * scaleProportionality
        )
    })
}

// Posição do mouse no mundo do guiBuffer correspondente à sua posição no canvas
var guiMouseX, guiMouseY

// Executa a função especificada no buffer da GUI e, em seguida, desenha
// a GUI na tela, sobre todos os outros elementos. Utilizar só após todo o
// resto já ter sido desenhado
function drawGui(content = () => {}) {
    guiMouseX = (mouseX - width/2) * scaleProportionality
    guiMouseY = (mouseY - height/2) * scaleProportionality

    guiBuffer.draw(() => {
        clear()
        content()
    })

    shader(shaders.screen)
    shaders.screen.setUniform('uScreenBuffer', guiBuffer)
    square(0, 0, 100)
    resetShader()
}
