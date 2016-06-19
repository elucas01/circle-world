(function(){

var SPRITE_SHADER_VERT;
var SPRITE_SHADER_FRAG;

//A rendering class that is in charge of drawing sprites

function Camera(x, y, width, height){
  AABB.call(this, x, y, width, height);

  this.sprites = [];
}
Camera.prototype = Object.create(AABB.prototype);
Camera.prototype.createBuffer = function(){
  this.vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, this.vbo);

  GL.bufferData(
    GL.ARRAY_BUFFER,
    new Float32Array([
      -1,-1, 1,-1, -1,1, 1,-1, -1,1, 1,1
      //0,0, 1,0, 0,1, 1,0, 0,1, 1,1
    ]),
    GL.STATIC_DRAW
  );
};
Camera.prototype.createProgram = function(){
  this.program = WGLU.programFromScripts(
    [{
      code: SPRITE_SHADER_FRAG,
      type: GL.FRAGMENT_SHADER
    },
    {
      code: SPRITE_SHADER_VERT,
      type: GL.VERTEX_SHADER
    }]
  );

  GL.useProgram(this.program);

  var a_position = GL.getAttribLocation(this.program, "a_position");
  GL.enableVertexAttribArray(a_position);
  GL.vertexAttribPointer(a_position, 2, GL.FLOAT, false, 0, 0);
};
Camera.prototype.init = function(){
  this.createBuffer();
  this.createProgram();

  this.u_matrix = GL.getUniformLocation(this.program, "u_matrix");
};
Camera.prototype.add = function(sprite){
  this.sprites.push(sprite);
};
Camera.prototype.render = function(sprite){
  sprite.uniforms(this);

  GL.drawArrays(GL.TRIANGLES, 0, 6);
};
Camera.prototype.draw = function(){
  GL.bindBuffer(GL.ARRAY_BUFFER, this.vbo);
  GL.useProgram(this.program);

  var sprs = this.sprites;
  for (var i = 0; i < sprs.length; i++){
    this.render(sprs[i]);
  }
};

window.Camera = Camera;

SPRITE_SHADER_VERT = `
attribute vec2 a_position;
varying vec2 v_textureCoord;
uniform mat3 u_matrix;

void main(){
  gl_Position = vec4(vec3(a_position, 1.0) * u_matrix, 1.0);
  v_textureCoord = a_position * 0.5 + 0.5;
}
`;
SPRITE_SHADER_FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

uniform sampler2D u_sampler;

varying vec2 v_textureCoord;

void main() {
   gl_FragColor = texture2D(u_sampler, v_textureCoord);
}
`;

})();
