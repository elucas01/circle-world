(function(){

if (!GL) return;
if (!WGLU) return;

function Chunk(x, y, width, height){
	Sprite.call(this, null, x, y, width, height);
}
Chunk.prototype = Object.create(Sprite.prototype);
Chunk.prototype.init = function(pixelshader){
	pixelshader.useProgram();
  pixelshader.bindBuffer();

  var loc = pixelshader.unifomLocation("u_samplePos");
  GL.uniform2f(loc, this.x, this.y);

	this.fbo = GL.createFramebuffer();
  GL.bindFramebuffer(GL.FRAMEBUFFER, this.fbo);
  fbo.width = this.width * 0.25;
  fbo.height = this.height * 0.25;

	this.texture = GL.createTexture();
	GL.bindTexture(GL.TEXTURE_2D, this.texture);

	GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
	GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
	GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
	GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);

	GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, this.width * 0.25, this.height * 0.25, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
  GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this.texture, 0);

  pixelshader.drawBuffer();
  GL.bindFramebuffer(GL.FRAMEBUFFER, null);
};


window.Chunk = Chunk;

});
