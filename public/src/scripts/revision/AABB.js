(function(){
//Axis-Aligned Bounding Box

function AABB(x, y, width, height){
  this.x = x;
  this.y = y;

  this.width = width;
  this.height = height;
};
AABB.prototype.overlaps = function(that){
    var dx = this.x - that.x,
        dy = this.y - that.y;
    return dy > - this.height &&
           dy < that.height &&
           dx > - this.width &&
           dx < that.width;
};
AABB.prototype.lerp = function(that, factor){
  var cx = this.x + this.width * 0.5;
  var gcx = that.x + that.width * 0.5;
  var cy = this.y + this.height * 0.5;
  var gcy = that.y + that.height * 0.5;

  cx = gcx + (cx - gcx) * scale;
  cy = gcy + (cy - gcy) * scale;

  this.width = that.width + (this.width - that.width) * scale;
  this.height = that.height + (this.height - that.height) * scale;

  this.x = cx - this.width * 0.5;
  this.y = cy - this.height * 0.5;
};
AABB.prototype.matrix = function(width, height){
	return [
		this.width / width * 2, 0, this.x / width * 2 - 1,
		0, - this.height / height * 2, - this.y / height * 2 + 1,
		0, 0, 1,
	];
}

window.AABB = AABB;

})
