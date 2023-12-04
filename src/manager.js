var gameIsPaused = false
var gameIsPausable = false
var pauseMenuButtons = []

function setupPauseMenu() {
    const spacing = 30

    buttonMode(CENTER)
    const home = new Button('', 0, 0, 100, 100, {
        onClick: () => {
            pauseToggle()
            setCurrentScene(scenes.menu)
        }
    })
    home.imageOverlay.image = textures.home
    home.imageOverlay.padding = 40
    pauseMenuButtons.push(home)

    const mute = new Button('', 0, 0, 100, 100, {
        onClick: () => {
            if(sounds.music.wanko05.isPlaying())
                sounds.music.wanko05.pause()
            else
                sounds.music.wanko05.play()
        },

        onDraw: (b) => {
            if(sounds.music.wanko05.isPlaying())
                b.imageOverlay.image = textures.audio_off
            else
                b.imageOverlay.image = textures.audio_on
        }
    })
    mute.imageOverlay.padding = 40
    pauseMenuButtons.push(mute)

    pauseMenuButtons.forEach((b, i) => {
        if(gameIsPaused)
            b.enabled = true

        b.setPosition(i*(100 + spacing) - (pauseMenuButtons.length - 1)*(50 + spacing/2))
        b.updateHitbox()
        b.setCallbacks({
            onHover: (b) => {
                b.color = [0.9]
            },

            onNotHover: (b) => {
                b.color = [1]
            }
        })

        b.text.offsetY = -7
        b.text.size = 45
        b.color = [1]
    })
}

function pauseToggle() {
    if(!gameIsPausable) return;

    if(gameIsPaused) {
        gameIsPaused = false
        pauseMenuButtons.forEach((b) => {
            b.enabled = false
        })
    } else {
        gameIsPaused = true
        pauseMenuButtons.forEach((b) => {
            b.enabled = true
        })
    }
}

function drawPauseMenu() {
    if(!gameIsPaused || !gameIsPausable) return;

    drawGui(() => {
        rectMode(CENTER)

        fill(0, 0.7)
        rect(0, 0, baseWidth, baseHeight)

        fill(1)
        textAlign(CENTER, CENTER)
        textSize(50)
        text('Jogo pausado', 0, -130)

        for (let i = 0; i < pauseMenuButtons.length; i++) {
            const b = pauseMenuButtons[i];
            
            b.draw()
        }
    })
}