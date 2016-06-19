(function(){

var PIXEL_SHADER_VERT;

function PixelShader(code){
  this.code = code;
  // this.vbo;
  // this.program;
}
PixelShader.prototype.createBuffer = function(){
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
PixelShader.prototype.createProgram = function(){
  this.program = WGLU.programFromScripts(
    [{
      code: this.code,
      type: GL.FRAGMENT_SHADER
    },
    {
      code: PIXEL_SHADER_VERT,
      type: GL.VERTEX_SHADER
    }]
  );

  GL.useProgram(this.program);

  var a_position = GL.getAttribLocation(this.program, "a_position");
  GL.enableVertexAttribArray(a_position);
  GL.vertexAttribPointer(a_position, 2, GL.FLOAT, false, 0, 0);
};
PixelShader.prototype.init = function () {
  this.createBuffer();
  this.createProgram();
};
PixelShader.prototype.useProgram = function(){
  GL.useProgram(this.program);
};
PixelShader.prototype.bindBuffer = function(){
  GL.bindBuffer(GL.ARRAY_BUFFER, this.vbo);
};
PixelShader.prototype.drawBuffer = function(){
  GL.drawArrays(GL.TRIANGLES, 0, 6);
};
PixelShader.prototype.uniformLocation = function(name){
  return GL.getUniformLocation(this.program, name);
};

window.PixelShader = PixelShader;

PIXEL_SHADER_VERT = `
attribute vec2 a_position;

void main(){
  gl_Position = vec4(a_position, 1.0, 1.0);
}
`;

})();
