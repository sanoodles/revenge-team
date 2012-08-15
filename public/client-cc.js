/**
Client Command Controller
Inherits from Generic Command Controller (/generic-cc.js)

    On user command:
        Forwards the command to the server
    On server response:
        Updates the local model
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

/**
 * Status of the ongoing turn
 *
 * "": command not sent
 * "command sent": command sent, waiting for server to response with an
 *                  update of the game state
 */
cc.turnStatus = null;

cc.playerById = function (id) {
    var i, max;
    for (i = 0, max = cc.remotePlayers.length; i < max; i++) {
        if (cc.remotePlayers[i].id == id)
            return cc.remotePlayers[i];
    };

    return false;
};


cc.init = function () {
    this.genericInit();
    cc.socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
    cc.remotePlayers = [];
    cc.commandSent = false;
    
    cc.socket.on("connect", onSocketConnected);
    cc.socket.on("console.log", onConsoleLog);
    cc.socket.on("game is full", onGameIsFull);
    cc.socket.on("already commanded", onAlreadyCommanded);
    cc.socket.on("new player", onNewPlayer);
    cc.socket.on("not your cap", onNotYourCap);
    cc.socket.on("update", onUpdate);
    cc.socket.on("turn end", onTurnEnd);
    cc.socket.on("remove player", onRemovePlayer);
    cc.socket.on("disconnect", onSocketDisconnect);
};

/**
 * Run command
 * There is no command prediction; just forward to the server
 */
cc.run = function (cmd, params) {
    // socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
    console.log("run", cmd, params);    
    cc.socket.emit(cmd, params);
    cc.turnStatus = "command sent";
}

function onSocketConnected () {
    console.log("Connected to socket server");
    cc.socket.emit("new player", {});
}

/**
 * Console.logs stuff from the server
 */
function onConsoleLog (stuff) {
    console.log("Server says:", stuff);
}

/**
 * Receives an update of the status of the game
 */
function onUpdate (status) {
    console.log("update", status);
    cc.setStatus(status);
    gc.onModelUpdate();
}

function onGameIsFull () {
    console.log("Game is full");
}

function onAlreadyCommanded () {
    console.log("Already commanded");
}

function onNewPlayer(data) {
    console.log("New player connected: " + data.id);
    var newPlayer = new User(data.id);

    newPlayer.setTeam(data.team);
    cc.remotePlayers.push(newPlayer);
    console.log("remotePlayers: ", cc.remotePlayers.map(function (u) { return u.getStatus() }));
}

function onNotYourCap () {
    console.log("Not your cap");
}

/**
 * Receives the event that the ongoing turn has finished
 * @param params.status The status of the game at the end of the turn
 */
function onTurnEnd (params) {
    console.log("turn end", params);
    cc.setStatus(params.status);
    cc.turnStatus = "";
    gc.onTurnEnd();
}

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
}

function onRemovePlayer(data) {
    console.log("remove player", data);
    
    var removePlayer = cc.playerById(data.id);

    if (!removePlayer) {
        console.log("Player not found: " + data.id);
        return;
    };

    cc.remotePlayers.splice(cc.remotePlayers.indexOf(removePlayer), 1);
    console.log(cc.remotePlayers);
}
