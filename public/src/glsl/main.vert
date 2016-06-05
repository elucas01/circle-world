attribute vec2 a_position;
uniform mat3 tex_matrix;

varying vec2 texCoord;

void main(){
	gl_Position = vec4(vec3(a_position, 1) * tex_matrix, 1);
    texCoord = a_position; 
}