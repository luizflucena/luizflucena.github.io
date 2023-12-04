class ParallaxBackground {
    constructor(parallaxLayers = [], parallaxSpeed = [1, 1]) {
        // 0 é a camada mais de trás
        this.parallaxLayers = parallaxLayers
        this.parallaxSpeed = parallaxSpeed
    }

    draw(referencePositionX, referencePositionY) {
        if(this.parallaxLayers.length === 0) return;

        shader(shaders.parallax)
        shaders.parallax.setUniform('uRes', [this.parallaxLayers[0].width, this.parallaxLayers[0].height])
        shaders.parallax.setUniform('uPlayerPos', [referencePositionX, referencePositionY])
        shaders.parallax.setUniform('uParallaxSpeed', this.parallaxSpeed)
        for(let i = 0; i < this.parallaxLayers.length; ++i)
            shaders.parallax.setUniform('uLayer' + i, this.parallaxLayers[i])

        square(0, 0, 400)

        resetShader()
    }
}