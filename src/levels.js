const allLevels = []
// Apenas para a lógica de cada nível, o conteúdo está em scenes.js
class Level {
    constructor() {
        this.required = 1
        this.isComplete = false
        this.isLocked = true

        allLevels.push(this)
    }

    complete() {
        this.isComplete = true
        setCurrentScene(scenes.levelSelect)
    }

    unlock() {
        this.isLocked = false
    }
}