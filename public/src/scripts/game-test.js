var Game = {
	View: function(canvas){
		this.canvas = canvas;
	},
	Element: function(){
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;

		this.init = function(image, x, y, w, h){

		};
	}
};

function GameElement(image, x, y, width, height){
	Sprite.call(this, image, x, y, width, height);
	this.x2 = x + width;
	this.y2 = y + height;
}
GameElement.prototype = Object.create(Sprite.prototype);
GameElement.prototype.touch = function(that){
	return  this.x2 < other.x &&
			this.y2 < other.y &&
			this.x > other.x2 &&
			this.y > other.y2;
};

function GamePhysicsElement(image, x, y, width, height){
	GameElement.call(this, image, x, y, width, height);
	this.vx = 0;
	this.vy = 0;

	this.mass = 1;
}
GamePhysicsElement.prototype = Object.create(GameElement.prototype);
GamePhysicsElement.prototype.update = function(){
	this.x += this.vx;
	this.y += this.vy;
};
GamePhysicsElement.prototype.applyForce = function(fx, fy){
	this.vx += fx;
	this.vy += fy;
};
GamePhysicsElement.prototype.collideX = function(that){
	if (!this.touch(that)) return;

	var e1 = Math.max(this.x, that.x);
	var e2 = Math.min(this.x + this.width, that.x + that.width);

	var overlap = Math.abs(e2 - e1);
	var ptime = overlap / Math.abs(this.vx - this.vy);

	this.x -= this.vx * ptime;
	that.x -= that.vx * ptime;

	var m = this.mass * this.vx + that.mass * that.vx;

	this.vx = (that.mass * (that.vx - this.vx) + m) / (this.mass + that.mass);
	that.vx = (this.mass * (this.vx - that.vx) + m) / (this.mass + that.mass);

	this.x += this.vx * ptime;
	that.x += that.vx * ptime;
};
GamePhysicsElement.prototype.collide = function(){

};
