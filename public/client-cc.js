/**
Client Command Controller
Inherits from Generic Command Controller (/generic-cc.js)

    On user command:
        Generic behavior
        Forwards the command to the server
    On server command:
        Generic behavior
        Calls the graphic controller
*/

// @see https://github.com/robhawkes/mozilla-festival/blob/master/public/js/game.js
var cc = new CommandController();

/*
 * TODO:
 * 1. Here (client-cc.js) define a ClientCommandController constructor
 *      that inherits from CommandController (generic-cc.js)
 * 2. On gc.js, create an instance of ClientCommandController named cc
 *
 */

cc.socket = null;
cc.localPlayer = null;
cc.remotePlayers = null;

cc.init = function () {
    this.genericInit();
    socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
    cc.remotePlayers = [];
    
    socket.on("update", onUpdate);
    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("game is full", onGameIsFull);
    socket.on("not your cap", onNotYourCap);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    socket.on("remove player", onRemovePlayer);
};

cc.playerById = function (id) {
    var i, max;
    for (i = 0, max = cc.remotePlayers.length; i < max; i++) {
        if (cc.remotePlayers[i].id == id)
            return cc.remotePlayers[i];
    };

    return false;
};

function onSocketConnected() {
    console.log("Connected to socket server");
    socket.emit("new player", {});
}

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
}

function onGameIsFull () {
    console.log("Game is full");
}

function onNotYourCap () {
    console.log("Not your cap");
}

function onNewPlayer(data) {
    console.log("New player connected: " + data.id);
    var newPlayer = new User(data.id);
    newPlayer.team = data.team;
    cc.remotePlayers.push(newPlayer);
    console.log(cc.remotePlayers);
}

function onMovePlayer(data) {

}

function onRemovePlayer(data) {
    var removePlayer = cc.playerById(data.id);

    if (!removePlayer) {
        console.log("Player not found: " + data.id);
        return;
    };

    cc.remotePlayers.splice(cc.remotePlayers.indexOf(removePlayer), 1);
    console.log(cc.remotePlayers);
}

/**
 * Run command
 * There is no command prediction; just forward to the server
 */
cc.run = function (cmd, params) {
    // socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
    console.log("run", cmd, params);    
    socket.emit(cmd, params);
}

function onUpdate (params) {
    console.log("update", params);
    cc.setStatus(params);
    gc.onModelUpdate();
}
