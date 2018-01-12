var http = require('http')
var url = require('url')
var path = require('path')
var fs = require('fs')
// var mime = require('./mime').types;

var server = http.createServer(function(req, res){
  var urlObj = url.parse(req.url,true)
  // console.log(urlObj);
  var filepath =path.join(__dirname,  decodeURI(urlObj.pathname));
  console.log(filepath);
  // console.log(filepath);
  fs.readFile(filepath, 'binary', function(err, file){
    if (err) {
      res.writeHead(404, 'Not Found')
      return res.end()
    } else {
      res.writeHead(200,'ok');
      res.write(file, 'binary');
      res.end();
    }
  })
})

server.listen(8080)