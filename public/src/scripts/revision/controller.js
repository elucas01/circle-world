(function(){

var keysheld = [];

window.onkeydown = function(event){
  keysheld[event.keyCode] = 1;
};

window.onkeyup = function(event){
  keysheld[event.keyCode] = 0;
};

function Controller(){
  this.keys = [];
}
Controller.prototype.addKey = function(code, x, y){
  this.keys.push({
    code: code,
    x: x,
    y: y
  });
};
Controller.prototype.direction = function(){
  var dir = {x: 0, y: 0};
  for (var i = 0; i < this.keys.length; i++){
    if (keysheld[this.keys[i].code] == 1){
      dir.x += this.keys[i].x;
      dir.y += this.keys[i].y;
    }
  }
  var m = Math.sqrt(dir.x * dir.x + dir.y * dir.y);

  if (m > 0.001){
    m = 1.0 / m;
    dir.x *= m;
    dir.y *= m;

    return dir;
  }

  return {x: 0, y: 0};
};

window.Controller = Controller;

})();
