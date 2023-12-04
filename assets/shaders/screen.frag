#ifdef GL_ES
    precision mediump float;
    precision highp sampler2D;
#endif

uniform sampler2D uScreenBuffer;

varying vec2 vTexCoord;

void main() {
    gl_FragColor = texture2D(uScreenBuffer, vTexCoord);
}