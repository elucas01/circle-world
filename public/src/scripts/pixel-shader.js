var STATIC_VERTEX_SHADER = `/* @include glsl/pixel-shader.vert */`;

function PixelShader(gl){
  this.gl = gl;

  // this.vbo;
  // this.program;
}
PixelShader.prototype.createBuffer = function(){
  this.vbo = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);

  this.gl.bufferData(
    this.gl.ARRAY_BUFFER,
    new Float32Array([
      -1,-1, 1,-1, -1,1, 1,-1, -1,1, 1,1
    ]),
    this.gl.STATIC_DRAW
  );
};
PixelShader.prototype.createProgram = function(fragment){
  this.program = this.gl.programFromScripts(
    [{
      code: fragment,
      type: this.gl.FRAGMENT_SHADER
    },
    {
      code: STATIC_VERTEX_SHADER,
      type: this.gl.VERTEX_SHADER
    }]
  );

  this.gl.useProgram(this.program);

  var a_position = this.gl.getAttribLocation(this.program, "a_position");
  this.gl.enableVertexAttribArray(a_position);
  this.gl.vertexAttribPointer(a_position, 2, this.gl.FLOAT, false, 0, 0);
};
PixelShader.prototype.useProgram = function(){
  this.gl.useProgram(this.program);
};
PixelShader.prototype.bindBuffer = function(){
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
};
PixelShader.prototype.drawBuffer = function(){
  this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
};
