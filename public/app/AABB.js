(function(){
//Axis-Aligned Bounding Box

function AABB(x, y, width, height){
  this.x = x;
  this.y = y;

  this.width = width;
  this.height = height;
}
AABB.prototype.copy = function(that){
  this.x = that.x;
  this.y = that.y;
  this.width = that.width;
  this.height = that.height;
};
AABB.prototype.copySize = function(that){
  this.width = that.width;
  this.height = that.height;
};
AABB.prototype.copyPosition = function(that){
  this.x = that.x;
  this.y = that.y;
};

AABB.prototype.move = function(x, y){
  this.x += x;
  this.y += y;
};

/*AABB.prototype.overlaps = function(that){
    var dx = this.x - that.x,
        dy = this.y - that.y;
    return dy > - this.height &&
           dy < that.height &&
           dx > - this.width &&
           dx < that.width;
};*/
AABB.prototype.overlaps = function(that){
  return (this.y + this.height > that.y) &&
         (this.y < that.y + that.height) &&
         (this.x + this.width > that.x) &&
         (this.x < that.x + that.width);
};

AABB.prototype.lerp = function(that, factor){
  var cx = this.x + this.width * 0.5;
  var gcx = that.x + that.width * 0.5;
  var cy = this.y + this.height * 0.5;
  var gcy = that.y + that.height * 0.5;

  cx = gcx + (cx - gcx) * factor;
  cy = gcy + (cy - gcy) * factor;

  this.width = that.width + (this.width - that.width) * factor;
  this.height = that.height + (this.height - that.height) * factor;

  this.x = cx - this.width * 0.5;
  this.y = cy - this.height * 0.5;
};
AABB.prototype.matrixScaled = function(width, height){
	return [
		this.width / width, 0, this.width / width - 1 + this.x / width * 2,
		0, - this.height / height, -this.height/height + 1 - this.y / height * 2,
		0, 0, 1,
	];
};
AABB.prototype.matrixCamera = function(camera){
	return [
		this.width / camera.width, 0, this.width / camera.width - 1 + (this.x - camera.x) / camera.width * 2,
		0, - this.height / camera.height, -this.height / camera.height + 1 - (this.y - camera.y) / camera.height * 2,
		0, 0, 1,
	];
};/*
AABB.prototype.matrixScaled = function(width, height){
  console.log(this.x / width, this.y / height);
	return [
		this.width / width, 0, this.x / width,
		0, - this.height / height, - this.y / height,
		0, 0, 1,
	];
};*/
AABB.prototype.matrix = function(){
	return [
		this.width * 2, 0, this.x * 2 - 1,
		0, - this.height * 2, - this.y * 2 + 1,
		0, 0, 1,
	];
};

window.AABB = AABB;

})();
