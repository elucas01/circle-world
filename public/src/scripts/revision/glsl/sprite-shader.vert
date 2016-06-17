attribute vec2 a_position;
varying vec2 v_textureCoord;
uniform mat3 u_texMatrix;

void main(){
  gl_Position = vec4(vec3(a_position, 1.0) * u_texMatrix, 1.0);
  v_textureCoord = a_position;
}
