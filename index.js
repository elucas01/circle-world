/**
 * Circle World (to be named much better later) 
**/

var fs = require("fs");
var express = require("express");

var app = express();

app.use(express.static('./public'));

app.get("/", function(request, result){
	result.write("<!DOCTYPE html> <html>Hello...<br>This is line 2</html>");
	result.end();
});

app.get("/favicon.ico", function(req, res){
	fs.readFile("./public/favicon.ico", function(err, content){
		res.end(content);
	});
});

app.listen(8123);
