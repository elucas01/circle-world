(function(){

function Sprite(image, x, y, width, height){
  AABB.call(this, x, y, width, height);

  this.image = image;
}
Sprite.prototype = Object.create(AABB.prototype);
Sprite.prototype.init = function(){
  this.texture = GL.createTexture();
	GL.bindTexture(GL.TEXTURE_2D, this.texture);

	GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
	GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
	GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
	GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);

	GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, this.image);
};
Sprite.prototype.uniforms = function(camera){
  GL.uniformMatrix3fv(camera.u_matrix, false, this.matrixCamera(camera));

  GL.activeTexture(GL.TEXTURE0);
  GL.bindTexture(GL.TEXTURE_2D, this.texture);
};
Sprite.prototype.delete = function(){
  GL.deleteTexture(this.texture);
};

window.Sprite = Sprite;

})();
