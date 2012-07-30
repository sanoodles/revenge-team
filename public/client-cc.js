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
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    socket.on("remove player", onRemovePlayer);
};

cc.playerById = function (id) {
    var i;
    for (i = 0; i < cc.remotePlayers.length; i++) {
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

function onNewPlayer(data) {
    console.log("New player connected: " + data.id);
    var newPlayer = new User();
    newPlayer.id = data.id;
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
 */
cc.run = function (cmd, params) {
    // socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});

    switch (cmd) {
        case "move":
            this.move(params.capId, params.x, params.y);
            break;
        case "pass":
            this.pass(params.x, params.y);
            break;
    }
    
    socket.emit(cmd, params);
}

function onUpdate (params) {
    cc.setStatus(params);
    gc.onModelUpdate();
}
