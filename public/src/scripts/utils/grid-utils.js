function Grid(data, width, height){
	this.data = data;
	
	this.width = width;
	this.height = height;
	
	this.getRaw = function(x, y){
		return this.data[x + y * width];
	}; 
	
	this.setRaw = function(x, y, value){
		this.data[x + y * width] = value;
	};
}


//Saving this for later :D
function QuadTree(data, width, height){
	this.data = new Int16Array(data);
	
	this.width = width;
	this.height = height;
	
	this.depth;
	
	this.get = function(x, y){
		var p = 0;
		var d = this.data;
		for (var i = 1; i < mx; i++){
			p += 4 * d[p + (x << (i-mx)) + 2*(y << (i-mx))];
		}
	}
}