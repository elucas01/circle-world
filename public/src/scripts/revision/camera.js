(function(){

if (!GL) return;
if (!WGLU) return;

//Will be a generalized version of ChunkRenderer, that also renders sprites.
//Chunks and sprites will be in charge of textures and uniforms.
//The Camera class will just draw the objects in the right positions.
function Camera(x, y, width, height){
  AABB.call(this, x, y, width, height);

  this.sprites = [];
}
Camera.prototype = Object.create(AABB.prototype);
Camera.prototype.createBuffer = function(){
  GL.activerTexture(GL.TEXTURE0);

  this.vbo = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, this.vbo);

  GL.bufferData(
    GL.ARRAY_BUFFER,
    new Float32Array([
      -1,-1, 1,-1, -1,1, 1,-1, -1,1, 1,1
    ]),
    GL.STATIC_DRAW
  );
};
Camera.prototype.createProgram = function(){
  this.program = WGLU.programFromScripts(
    [{
      code: ,
      type: GL.FRAGMENT_SHADER
    },
    {
      code: STATIC_VERTEX_SHADER,
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

const SPRITE_SHADER_VERT = "/* @include glsl/sprite-shader.vert */";
const SPRITE_SHADER_FRAG = "/* @include glsl/sprite-shader.frag */";

});
