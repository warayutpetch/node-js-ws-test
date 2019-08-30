/**************************websocket_example.js*************************************************/

var bodyParser = require("body-parser");
const express = require('express'); //express framework to have a higher level of methods
const app = express(); //assign app variable the express class/method
var http = require('http');
var path = require("path");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const server = http.createServer(app); //create a server
app.use(express.static(__dirname + '/plugin'));
app.use('/css', express.static(__dirname + '/plugin'));
app.use('/jquery', express.static(__dirname + '/node_modules/plugin/justgage-1.2.2/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/plugin/bootstrap/'));
app.use('/water', express.static(__dirname + '/node_modules/plugin/Customizable-Liquid-Bubble-Chart-With-jQuery-Canvas/'));

//Store all JS and CSS in Scripts folder.

//***************this snippet gets the local ip of the node.js server. copy this ip to the client side code and add ':3000' *****
//****************exmpl. 192.168.56.1---> var sock =new WebSocket("ws://192.168.56.1:3000");*************************************
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
})

/**********************websocket setup**************************************************************************************/
//var expressWs = require('express-ws')(app,server);
const WebSocket = require('ws');
const s = new WebSocket.Server({ server ,clientTracking: false});
var connections = {};
//when browser sends get request, send html file to browser
// viewed at http://localhost:30000
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


//*************************************************************************************************************************
//***************************ws chat server********************************************************************************
s.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}

s.broadcast = function(data) {
    for(var i in wss.clients) {
      console.log(wss.clients[i]);
      ws.clients[i].send(data);
    }
  };
//app.ws('/echo', function(ws, req) {
s.on('connection', function (ws, req) {
    ws.id = s.getUniqueID();
    // ws.id = generateAnUniqueIdFunction();
    connections[ws.id] = ws;
    console.log('connections: ', connections);
    var user = [];



    ws.on('message', function (message) {
        if (message != 'ping') {
            console.log('message',message);
            var obj = JSON.stringify({ 'name': ws.id, 'message': message });
            console.log(ws.id + " : " + obj);
            if (message == 'list-all') {
                // ws.clients.forEach(function (client) { //broadcast incoming message to all clients (s.clients)
                //     if (client.readyState) { //except to the same client (ws) that sent this message
                //         client.send(JSON.stringify(user));
                //     }
                // });
            }else{
                // ws.clients.forEach(function (client) { //broadcast incoming message to all clients (s.clients)
                //     if (client != ws && client.readyState) { //except to the same client (ws) that sent this message
                //         client.send(obj);
                //     }
                // });
            }
  
        }


    });
    ws.on('close', function () {
        console.log("lost one client");

        delete connections[ws.id];
        delete ws.id;
    });
    //ws.send("new client connected");
    console.log("new client connected");


    setInterval(() => {
        s.broadcast('ping'); 
    }, 3000);
});
server.listen(3000, function () {

    console.log(process.env.PORT);
});