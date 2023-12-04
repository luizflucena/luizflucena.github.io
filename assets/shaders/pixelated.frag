#ifdef GL_ES
    precision mediump float;
#endif

void pixelateUV(inout vec2 uv, vec2 res) {
    uv = (floor(uv*res) + 0.5)/res;
}

uniform sampler2D uTexture;
uniform vec2 uSpriteRes;

varying vec4 vPos;
varying vec2 vTexCoord;

void main() {
    vec2 uv = vTexCoord;
    pixelateUV(uv, uSpriteRes);

    gl_FragColor = texture2D(uTexture, uv);
}