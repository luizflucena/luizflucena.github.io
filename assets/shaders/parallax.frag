#ifdef GL_ES
    precision mediump float;
    precision highp sampler2D;
#endif

void pixelateUV(inout vec2 uv, vec2 res) {
    uv = (floor(uv*res) + 0.5)/res;
}

void tileUV(inout vec2 uv, float scale, out ivec2 tile_pos) {
    uv *= scale;

    float ix = floor(uv.x);
    float iy = floor(uv.y);

    uv = fract(uv);

    tile_pos = ivec2(int(ix), int(iy));
}
void tileUV(inout vec2 uv, float scale) {
    ivec2 outvec = ivec2(0);
    tileUV(uv, scale, outvec);
}

uniform sampler2D uLayer0;
uniform sampler2D uLayer1;
uniform sampler2D uLayer2;
uniform sampler2D uLayer3;
uniform vec2 uRes;
uniform vec2 uPlayerPos;
uniform vec2 uParallaxSpeed;

varying vec2 vTexCoord;

void main() {
    vec4 result = vec4(0.);

    vec4 layers[4];
    vec2 uvs[4];

    for(int i = 0; i < 4; ++i) {
        uvs[i] = vTexCoord + vec2(uPlayerPos.x * uParallaxSpeed.x, uPlayerPos.y * -uParallaxSpeed.y) * float(i) * 1e-4;
        pixelateUV(uvs[i], uRes);
        tileUV(uvs[i], 1.);
    }

    layers[0] = texture2D(uLayer0, uvs[0]);
    layers[1] = texture2D(uLayer1, uvs[1]);
    layers[2] = texture2D(uLayer2, uvs[2]);
    layers[3] = texture2D(uLayer3, uvs[3]);

    for(int i = 0; i < 4; ++i) {
        result = mix(result, layers[i], layers[i].w);
    }

    // result = vec4(vec3(uvs[3].x), 1.);

    gl_FragColor = result;
}