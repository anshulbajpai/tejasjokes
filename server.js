var http = require('http');
var fs = require('fs');
var qs = require('querystring');

var Content = function() {
	this.picture = fs.readFileSync('tejas.jpg');
	
	var template = 	fs.readFileSync('template.html', {"encoding":"utf8"});

	var jokesTxt = fs.readFileSync('jokes.txt', {"encoding":"utf8"});
	var jokes = jokesTxt.split("\n");		
	
	var generateRandomNumber = function() {
		return Math.floor(Math.random()*10) % jokes.length;
	};

	this.html = function() {
		return template.replace("{PLACEHOLDER}", jokes[generateRandomNumber()]);
	};

	this.add = function(joke, callback) {
		fs.appendFile('jokes.txt', "\n" + joke, function (argument) {
			jokes.push(joke);
			callback();
		});		
	};
};

var content = new Content();

http.createServer(function (req, res) {
  if(req.url === "/tejas.jpg"){
  	res.writeHead(200, {'Content-Type': 'image/jpeg'});  
  	res.end(content.picture);		
  }
  else if(req.url === "/add" && req.method === "POST"){
  	var body = "";
  	req.on('data', function (data) {
  		body +=data;
	});
	req.on('end',function(){
		var params =  qs.parse(body);
		content.add(params.joke, function() {
	  		res.writeHead(302, {'Location': "/"});
		   	res.end();			
		});
	});
  }
  else{
  	res.writeHead(200, {'Content-Type': 'text/html'});  
  	res.end(content.html());		
  }  
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');