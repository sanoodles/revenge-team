var app         = require('./public/models/model.app.js').app
    Ball        = require('./public/models/model.ball.js').Ball,
    Cap         = require('./public/models/model.cap.js').Cap,
    CommandController   = require("./generic-cc.js").CommandController,
    field       = require('./public/models/model.field.js').field,
    User      = require('./public/models/model.user.js').User,
    PreviewBall = require('./public/models/model.ball.js').PreviewBall,
    Team        = require('./public/models/model.team.js').Team,
    util        = require("util");

// @see https://github.com/robhawkes/mozilla-festival/blob/master/game.js
var cc = new CommandController();
cc.io = require("socket.io");
cc.socket = null;
cc.players = null;

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

    cc.players = [];
};

cc.onSocketConnection = function (client) {
    util.log("New player has connected: " + client.id);
    this.emit("update", cc.getStatus());
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move", onMove);
    client.on("pass", onPass);
};

function onClientDisconnect () {
    util.log("client disconnect " + this.id);
    var removePlayer = cc.playerById(this.id);

    if (!removePlayer) {
        util.log("Player not found: " + this.id);
        return;
    };

    cc.players.splice(cc.players.indexOf(removePlayer), 1);
    this.broadcast.emit("remove player", {id: this.id});
    cc.players.forEach(function (x) { util.log(x.id) });
};

function onNewPlayer(params) {
    var newPlayer = new User();
    newPlayer.id = this.id;
    this.broadcast.emit("new player", {id: newPlayer.id});
    var i, existingPlayer;
    for (i = 0; i < cc.players.length; i++) {
        existingPlayer = cc.players[i];
        this.emit("new player", {id: existingPlayer.id});
    };
    cc.players.push(newPlayer);
    cc.players.forEach(function (x) { util.log(x.id) });
};

function onMove (params) {
    util.log("move");
    cc.move(params.capId, params.x, params.y);
    this.emit("update", cc.getStatus()); // to the sender
    this.broadcast.emit("update", cc.getStatus()); // to all the rest
};

function onPass (params) {
    util.log("pass");
    cc.pass(params.x, params.y);
    this.emit("update", cc.getStatus()); // to the sender
    this.broadcast.emit("update", cc.getStatus()); // to all the rest
};

cc.playerById = function (id) {
    var i;
    for (i = 0; i < cc.players.length; i++) {
        if (cc.players[i].id == id)
            return cc.players[i];
    };

    return false;
};


cc.init();
