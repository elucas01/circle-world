attribute vec2 a_position;
varying vec2 v_textureCoord;

void main(){
  gl_Position = vec4(a_position, 1.0, 1.0);
  v_textureCoord = a_position;
}
