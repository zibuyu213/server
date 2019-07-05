//express_demo.js 文件
var fs = require('fs');
var express = require('express');
var app = express();


function setFile(url,data){
    fs.writeFileSync(url,JSON.stringify(data));
}

function getFile(url){
    return JSON.parse(fs.readFileSync(url));
}

let weishou = [
    {name:'九尾',num:9},
    {name:'八尾',num:8},
    {name:'七尾',num:7},
    {name:'六尾',num:6},
    {name:'五尾',num:5},
    {name:'四尾',num:4},
    {name:'三尾',num:3},
];
setFile('./aaa.txt',weishou);
app.get('/weishou', function (req, res) {

    res.send(JSON.stringify(getFile('./aaa.txt')));
})
app.get('/', function (req, res) {
   res.send('Hello World');
})
var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
