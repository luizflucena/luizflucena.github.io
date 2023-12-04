var shaders = { pixelated: undefined, screen: undefined, parallax: undefined }
var textures = { tiles: {}, spritesheets: {}, sprites: {}, bg: {} }
var spriteSheets = { player: undefined, trash: undefined }
var sounds = { music: {}, sfx: {} }
var fonts = { regular: undefined, bold: undefined, extrabold: undefined, keyboard: undefined }
function preload() {
    loadAndDefineShader('pixelated')
    loadAndDefineShader('screen')
    loadAndDefineShader('parallax')

    loadAndDefineImage('tiles/sand.png')
    loadAndDefineImage('tiles/teste.png')
    loadAndDefineImage('spritesheets/characters.png', (img) => {
        sliceSpriteSheet('player', img, 4, 23)
    })
    loadAndDefineImage('spritesheets/trash.png', (img) => {
        sliceSpriteSheet('trash', img, 1, 5)
    })
    loadAndDefineImage('bg/beach1.png')
    loadAndDefineImage('bg/beach2.png')
    loadAndDefineImage('bg/beach3.png')
    loadAndDefineImage('bg/beach4.png')
    loadAndDefineImage('bg/menu.png')
    loadAndDefineImage('sprites/umbrella.png')
    loadAndDefineImage('sprites/bins.png')
    // loadAndDefineImage('logo.png')
    loadAndDefineImage('logo_glow.png')
    loadAndDefineImage('gradient.png')
    loadAndDefineImage('gradient_inverse.png')
    loadAndDefineImage('check.png')
    loadAndDefineImage('lock.png')
    loadAndDefineImage('home.png')
    loadAndDefineImage('audio_off.png')
    loadAndDefineImage('audio_on.png')

    loadAndDefineSound('music/wanko05.mp3')
    loadAndDefineSound('sfx/ocean.mp3')
    loadAndDefineSound('sfx/jump.wav')
    loadAndDefineSound('sfx/jump2.wav')
    loadAndDefineSound('sfx/trash.wav')
    loadAndDefineSound('sfx/start.wav')
    loadAndDefineSound('sfx/click.wav')
    loadAndDefineSound('sfx/deny.wav')
    loadAndDefineSound('sfx/correct.mp3')
    loadAndDefineSound('sfx/incorrect.mp3')
    loadAndDefineSound('sfx/complete.mp3')
    loadAndDefineSound('sfx/plastic.mp3')
    loadAndDefineSound('sfx/paper.mp3')
    loadAndDefineSound('sfx/metal.mp3')
    loadAndDefineSound('sfx/glass.mp3')
    loadAndDefineSound('sfx/organic.wav')

    fonts.regular = loadFont('assets/fonts/Karla-Regular.ttf')
    fonts.bold = loadFont('assets/fonts/Karla-Bold.ttf')
    fonts.extrabold = loadFont('assets/fonts/Karla-ExtraBold.ttf')
    fonts.keyboard = loadFont('assets/fonts/212 Keyboard.otf')
}

/* -------------------------------------------------------------------------- */

function loadAndDefineImage(path, successCallback = () => {}) {
    const splitPath = path.split('/')
    const name = splitPath[splitPath.length - 1].split('.')[0]
    const obj = splitPath.length === 1 ? textures : textures[splitPath[0]]

    obj[name] = loadImage('assets/textures/' + path, successCallback)
}

function loadAndDefineSound(path, successCallback = () => {}) {
    const splitPath = path.split('/')
    const name = splitPath[splitPath.length - 1].split('.')[0]
    const obj = splitPath.length === 1 ? sounds : sounds[splitPath[0]]

    obj[name] = loadSound('assets/sounds/' + path, successCallback)
}

function loadAndDefineShader(name) {
    shaders[name] = loadShader('assets/shaders/' + name + '.vert', 'assets/shaders/' + name + '.frag')
}