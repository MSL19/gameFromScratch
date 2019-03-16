var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var playerArr = {};
var maxX = 1000;
var maxY = 1000;
class player{
  constructor(player_name){
    this.player_name = player_name;
    this.posX = getRandomInt(maxX);
    this.posY = getRandomInt(maxY);
    this.shoot = true;
    this.rocketPosX = null;
    this.rocketPosY = null;
    this.colorR = getRandomInt(255);
    this.colorG = getRandomInt(255);
    this.colorB = getRandomInt(255);
    this.alive = true;
    switch(getRandomInt(4)){
        case 0:
        this.direction = "up";
        break;
        case 1:
        this.direction = "down";
        break;
        case 2:
        this.direction = "right";
        break;
        case 3: 
        this.direction = "left";
        break;
    }

  }

  updatePos(x,y,Rx,Ry){
    this.posX = x;
    this.posY = y;
    this.rocketPosX = Rx;
    this.rocketPosY = Ry;
  }

  shoot(){
    this.shoot = false;
    this.rocketPosX = this.posX;
    this.rocketPosY = this.posY;
  }

  getPosX(){
      return posX;
  }

  kill(){
    this.alive = false;
  }

  checkLife(){
    return this.alive;
  }

  getDir(){
    return this.direction;
  }

  updateDir(dir){
    switch(dir){
    case 0:
        this.direction = "up";
        break;
        case 1:
        this.direction = "down";
        break;
        case 2:
        this.direction = "right";
        break;
        case 3: 
        this.direction = "left";
        break;
    }
  }
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

io.on('connection', function(socket){
  console.log("some kinds of connectio...");
  playerArr[socket.id] = new player(socket.id);
    socket.on('keyPress', function(keyy, playerArrC){
    
      switch (keyy) {
            case 37:
            console.log('Left key pressed');
                 playerArr[socket.id].updateDir(3);
               break;
            case 38:
            console.log('Up key pressed');
                 playerArr[socket.id].updateDir(0);
               break;
            case 39:
            playerArr[socket.id].updateDir(2);
            console.log('Right key pressed');
               break;
            case 40:
            playerArr[socket.id].updateDir(1);
                 console.log('Down key pressed');
               break;
         }
         io.emit('gameUpdate', playerArr)

    });
    socket.on("disconnect", function(){
      delete player[socket.id];
      io.emit("disconnect", socket.id);
    });

  });
  http.listen(port, function(){
    console.log('listening on *:' + port);
  });