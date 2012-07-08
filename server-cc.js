var util        = require("util"),
    CommandController = require("./generic-cc.js").CommandController;

// @see https://github.com/robhawkes/mozilla-festival/blob/master/game.js
var cc = new CommandController();
cc.io = require("socket.io");
cc.socket = null;

cc.init = function () {
    this.genericInit();
    socket = cc.io.listen(8000);
    socket.configure(function() {
        socket.set("transports", ["websocket"]);
        socket.set("log level", 2);
    });
    socket.sockets.on("connection", this.onSocketConnection);
};

cc.onSocketConnection = function (client) {
    util.log("New player has connected: " + client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move", onMove);
    client.on("remove player", onRemovePlayer);
};

function onClientDisconnect () {
    util.log("client disconnect");
};

function onNewPlayer () {
    util.log("new player");
};

function onMove (params) {
    util.log("move");
    cc.move(params.capId, params.x, params.y);
};

function onRemovePlayer () {
    util.log("remove player");
};

cc.init();
