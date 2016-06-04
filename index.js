/**
 * Circle World (to be named much better later) 
**/

var fs = require("fs");
var express = require("express");

var app = express();
/*
app.get("/", function(request, result){
	result.write("<!DOCTYPE html> <html>Hello...<br>This is line 2</html>");
	result.end();
});
*/
app.use(express.static('./public'));

app.get("/favicon.ico", function(req, res){
	fs.readFile("./public/favicon.ico", function(err, content){
		res.statusCode = 200;
		res.setHeader('Content-Length', content.length);
		res.setHeader('Content-Type', 'image/x-icon');
		res.setHeader("Cache-Control", "public, max-age=25");
		//res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
		res.end(content);
	});
});

app.listen(8123);
