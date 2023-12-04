#ifdef GL_ES
    precision mediump float;
#endif

// Atributos de geometria
attribute vec3 aPosition;
attribute vec2 aTexCoord;

// Matrizes de câmera
uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

varying vec4 vPos;
varying vec2 vTexCoord;

void main() {
    vPos = vec4(aPosition, 1.0);
    vTexCoord = vec2(aTexCoord.x, 1. - aTexCoord.y);

    gl_Position = uProjectionMatrix * uModelViewMatrix * vPos;
}