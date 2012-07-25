var util                = require("util"),
    CommandController   = require("./generic-cc.js").CommandController,
    field       = require('./public/models/model.field.js').field,
    Team        = require('./public/models/model.team.js').Team,
    Cap         = require('./public/models/model.cap.js').Cap,
    Ball        = require('./public/models/model.ball.js').Ball,
    PreviewBall = require('./public/models/model.ball.js').PreviewBall,
    app         = require('./public/models/model.app.js').app;

// @see https://github.com/robhawkes/mozilla-festival/blob/master/game.js
var cc = new CommandController();
cc.io = require("socket.io");
cc.socket = null;

cc.init = function () {
    this.genericInit();

    // random positions defined by the server
    app.caps[0].setPosition(field.getRandomX(), field.getRandomY());
    app.caps[1].setPosition(field.getRandomX(), field.getRandomY());
    app.caps[2].setPosition(field.getRandomX(), field.getRandomY());
    app.ball.setPosition(field.getRandomX(), field.getRandomY());
    
    socket = cc.io.listen(8000);
    socket.configure(function() {
        socket.set("transports", ["websocket"]);
        socket.set("log level", 2);
    });
    socket.sockets.on("connection", this.onSocketConnection);
};

cc.onSocketConnection = function (client) {
    util.log("New player has connected: " + client.id);
    this.emit("update", app.getStatus());
    client.on("disconnect", onClientDisconnect);
    client.on("move", onMove);
    client.on("remove player", onRemovePlayer);
};

function onClientDisconnect () {
    util.log("client disconnect");
};

function onMove (params) {
    util.log("move");
    cc.move(params.capId, params.x, params.y);
    this.broadcast.emit("update", app.getStatus());
};

function onRemovePlayer () {
    util.log("remove player");
};

cc.init();
