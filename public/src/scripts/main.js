var view, renderer;

function loop(){
	renderer.draw();
	/*
	renderer.sprites[0].force(0, 10);
	//renderer.sprites[1].force(-10, 0);

	for (var i = 0; i < renderer.sprites.length; i++){
		renderer.sprites[i].update();
		for (var j = i + 1; j < renderer.sprites.length; j++){
			renderer.sprites[i].collide(renderer.sprites[j]);
		}
	}*/


	window.requestAnimationFrame(function(){
		window.setTimeout(loop, 30);
	});
}

window.onload = function(){
	view = new GameView();
	view.attachToCanvas("game-canvas");

	renderer = view.createSpriteRenderer();
	renderer.init();

	var texture = view.createTexture();

	Load.image("./assets/textest.png", function(image){
		texture.load(image);
		texture.init();

		var player = new Sprite(texture, 64, 64, 64, 64);
		renderer.add(player);

		var world = new World(32, 2, 2);
		world.random();
		world.generateSprites(renderer, texture);

		loop();
	});
};

window.onresize = function(){
	view.resize();
};
