#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float; 
#else
	precision mediump float;
#endif

uniform sampler2D image;

varying vec2 texCoord;

void main() {
   gl_FragColor = texture2D(image, texCoord);
}
