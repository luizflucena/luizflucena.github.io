#ifdef GL_ES
    precision mediump float;
#endif

attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
    vTexCoord = vec2(aTexCoord.x, 1. - aTexCoord.y);

    gl_Position = vec4(aPosition - vec3(0.5, 0.5, 0.), 0.5);
}