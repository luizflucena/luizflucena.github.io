/* -------------------------------------------------------------------------- */
/*                                 ECO SPRINT                                 */
/* -------------------------------------------------------------------------- */

const baseWidth = 1280, baseHeight = 720
// Para manter o tamanho relativo dos objetos no canvas consistente,
// independente da resolução
var scaleProportionality, invScaleProportionality
var canvas
function setup() {
	const largura = windowWidth > 1280 ? 1280 : windowWidth
	const altura = largura * baseHeight/baseWidth
	scaleProportionality = baseHeight/altura
	invScaleProportionality = 1/scaleProportionality

	frameRate(300)
	canvas = createCanvas(largura, altura, WEBGL)
	angleMode(DEGREES)
	colorMode(RGB, 1)
	noStroke()
	textFont(fonts.extrabold)
	rectMode(CENTER)

	setupSound()

	setupGui()
	setupButtonListeners()
	setupPauseMenu()

	setupPlayer()
	setupCamera()

	setupAllScenes()
	setCurrentScene(scenes.menu) // Definir a cena inicial
}

var deltaTimeSeconds
var normalizedDeltaTime
function draw() {
	deltaTimeSeconds = gameIsPaused ? 0 : deltaTime * 1e-3
	normalizedDeltaTime = gameIsPaused ? 0 : deltaTime * 0.075

	background(128/255, 206/255, 237/255)

	drawCurrentScene()
}

function keyPressed() {
	// Tecla esc
	if(keyCode === 27) pauseToggle()


	return false
}