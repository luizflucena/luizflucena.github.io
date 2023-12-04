// @ts-nocheck
function setupSound() {
    outputVolume(0.1)
    // outputVolume(0)

    sounds.music.wanko05.setLoop(true)
    sounds.music.wanko05.setVolume(0.8)
    // sounds.music.wanko05.setVolume(0)
    
    sounds.sfx.ocean.setLoop(true)
    // sounds.sfx.ocean.setVolume(0)

    sounds.sfx.trash.setVolume(0.7)
    sounds.sfx.paper.setVolume(3)
    sounds.sfx.organic.setVolume(0.6)

    sounds.sfx.incorrect.setVolume(1.5)
}