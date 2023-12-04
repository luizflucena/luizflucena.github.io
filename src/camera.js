var mainCam
const defaultOrthoScale = 2
var camSmoothness = Vector2.create(0.2, 0.5)

var cameraPosition = Vector2.zero

function setupCamera() {
	mainCam = createCamera()
	// Movendo a câmera pra que o ponto (0, 0) seja o canto inferior esquerdo da tela,
	// e para que o valor de y aumente no sentido para cima
	// @ts-ignore
	mainCam.camera(width/2, height/2, -20, width/2, height/2, 0, 0, -1, 0)
	setCamera(mainCam)
	setCameraOrthoScale(orthoScale)
}

var orthoScale = defaultOrthoScale
function setCameraOrthoScale(scale) {
	orthoScale = scale * scaleProportionality

	ortho(-width/2 * orthoScale, width/2 * orthoScale, -height/2 * orthoScale, height/2 * orthoScale)
}

var cameraIsLocked = false
function lockCameraOnPoint(x, y) {
	cameraFocusPoint.set(x, y)
	cameraIsLocked = true
}
function releaseCameraLock() {
	cameraIsLocked = false
}

var positionOfDirectionChange = 0
var directionBuffer = 1
var cameraAhead = 1
var cameraAheadBuffer = 1
var cameraFocusPoint = Vector2.zero
function drawCamera() {
	if(!cameraIsLocked)
		cameraFocusPoint.set(player.position)
	else
		cameraAhead = 0

	// Movimentação da câmera acompanhando o jogador
	mainCam.setPosition(
		lerp(mainCam.eyeX, cameraFocusPoint.x + cameraAhead, deltaTimeSeconds/camSmoothness.x),
		lerp(mainCam.eyeY, cameraFocusPoint.y, deltaTimeSeconds/camSmoothness.y),
		-20
	)

	if(player.directionX !== directionBuffer) {
		positionOfDirectionChange = player.position.x
		cameraAheadBuffer = cameraAhead
	}
	directionBuffer = player.directionX

	const signedDistFromDirectionChange = player.position.x - positionOfDirectionChange

	if(Math.sign(signedDistFromDirectionChange) > 0) {
		cameraAhead = Math.min(cameraAheadBuffer + signedDistFromDirectionChange/2, 400)
	} else {
		cameraAhead = Math.max(cameraAheadBuffer + signedDistFromDirectionChange/2, -400)
	}
}