var Game = {
	images: [],

	webgl_attributes: {
		alpha: false,
		depth: false,
		stencil: false,
		antialias: false,
		premultipliedAlpha: false,
		preserveDrawingBuffer: true,
		failIfMajorPerformanceCaveat: true
	},

	init: function(canvas){
		if (typeof canvas === "string"){
			canvas = document.getElementById(canvas);
		}
		this.canvas = canvas;

		this.gl = this.canvas.getContext('webgl', this.webgl_attributes) ||
				  this.canvas.getContext('experimental-webgl', this.webgl_attributes);
		if (!this.gl){
			throw new Error("Could not create WebGL context.");
		}

		this.canvas.addEventListener("click", function(){
			if (canvas.requestFullscreen) {
				canvas.requestFullscreen();
			}
			if (canvas.webkitRequestFullScreen) {
				canvas.webkitRequestFullScreen();
			}
			if (canvas.mozRequestFullScreen){
				canvas.mozRequestFullScreen();
			}
		});

		this.resize();
	},
	resize: function(){
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	},
	draw: function(){
		this.gl.clearColor(0, 0, 0, 0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.spriteGroup.draw();

		/*var spr = this.sprites;
		for (var i = 0; i < spr.length; i++){
			spr[i].updateMatrix(this.gl);
			spr[i].draw(this.gl);
		}

		var i,j;
		for (i = 0; i < spr.length; i++){
			for (j = i+1; j < spr.length; j++){
				spr[i].collideX(spr[j]);
			}
		}

		for (i = 0; i < spr.length; i++){
			spr[i].update();
		}*/


		window.requestAnimationFrame(function(){
			window.setTimeout(function(){
				Game.draw();
			}, 15);
		});
	}
};

window.onload = function(){
	Game.init("game-canvas");

	Load.image("./assets/textest.png", function(img){
		var g = new SpriteGroup(Game.gl);
		g.sprites.push({x: 0, y: 0, width: 64, height: 64});
		g.sprites.push({x: 384, y: 0, width: 64, height: 64});
		g.images.push(img);
		g.init();

		Game.spriteGroup = g;

		Game.draw();
	});
};
window.onresize = function(){
	Game.resize();
};

function GameElement(image, x, y, width, height){
	Sprite.call(this, image, x, y, width, height);
	this.x2 = x + width;
	this.y2 = y + height;
}
GameElement.prototype = Object.create(Sprite.prototype);
GameElement.prototype.touch = function(that){
	return  this.x2 < that.x &&
			this.y2 < that.y &&
			this.x > that.x2 &&
			this.y > that.y2;
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
