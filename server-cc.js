var app         = require('./public/models/model.app.js').app
    Ball        = require('./public/models/model.ball.js').Ball,
    Cap         = require('./public/models/model.cap.js').Cap,
    CommandController   = require("./generic-cc.js").CommandController,
    field       = require('./public/models/model.field.js').field,
    User        = require('./public/models/model.user.js').User,
    PreviewBall = require('./public/models/model.ball.js').PreviewBall,
    Team        = require('./public/models/model.team.js').Team,
    util        = require("util");

// @see https://github.com/robhawkes/mozilla-festival/blob/master/game.js
var cc = new CommandController();
cc.io = require("socket.io");
cc.socket = null;
cc.players = null;

/**
 * Server data about the ongoing turn
 */
cc.turn = {receivedCommand: {}};

cc.playerById = function (id) {
    var i, max;
    for (i = 0, max = cc.players.length; i < max; i++) {
        if (cc.players[i].id == id)
            return cc.players[i];
    };

    return false;
};

cc.init = function () {
    this.genericInit();

    // random positions defined by the server
    app.caps[0].setPosition(field.getRandomX(), field.getRandomY());
    app.caps[1].setPosition(field.getRandomX(), field.getRandomY());
    app.caps[2].setPosition(field.getRandomX(), field.getRandomY());
    app.ball.setPosition(field.getRandomX(), field.getRandomY());

    cc.socket = cc.io.listen(8000);
    cc.socket.configure(function() {
        cc.socket.set("transports", ["websocket"]);
        cc.socket.set("log level", 2);
    });
    cc.socket.sockets.on("connection", this.onSocketConnection);

    cc.players = [];

    cc.turn.receivedCommand[Team.LOCAL] = "";
    cc.turn.receivedCommand[Team.VISITOR] = "";
};

/**
 * TODO: bcastXXX signatures are weird. Should work without parameter;
 *  instead of "client" should use some cc variable to broadcast to
 * all the clients.
 */
cc.bcastUpdate = function (client) {
    client.emit("update", cc.getStatus()); // to the sender
    client.broadcast.emit("update", cc.getStatus()); // to all the rest
}

cc.onSocketConnection = function (client) {
    util.log("New user has connected: " + client.id);
    this.emit("update", cc.getStatus());

    // messages composed by client-cc or gc
    client.on("new player", onNewPlayer);
    client.on("move", onMove);
    client.on("pass", onPass);
    client.on("dribbling", onDribbling);
    client.on("tackle", onTackle);
    client.on("cover", onCover);
    client.on("disconnect", onClientDisconnect);
};

/**
 * @pre "received command" means also "processed command"
 */
cc.turn.canEnd = function () {
    console.log("canEnd", cc.turn.receivedCommand);
    return cc.turn.receivedCommand[Team.LOCAL] != "" &&
            cc.turn.receivedCommand[Team.VISITOR] != "";
}

cc.turn.end = function (client) {
    client.emit("turn end", {status: cc.getStatus()}); // to the sender
    client.broadcast.emit("turn end", {status: cc.getStatus()}); // to all the rest
    cc.turn.receivedCommand[Team.LOCAL] = "";
    cc.turn.receivedCommand[Team.VISITOR] = "";
}

/**
 * It can be only a maximum of 2 user per game. This function contains
 * some code ready for N users per game; it could be simplified, but
 * also serves as code sample for managing N users.
 */
function onNewPlayer (params) {
    "use strict";

    // check max players
    if (cc.players.length >= 2) {
        this.emit("game is full");
        return;
    }

    // create new user
    var newPlayer = new User(this.id);
    newPlayer.setTeam(cc.players.length == 0 ? Team.LOCAL : Team.VISITOR);
    util.log("newPlayer team: " + newPlayer.getTeam());
    this.emit("console.log", ["Your user attributes are", newPlayer.getStatus()]);

    // notifiy of new user to all users but the new
    this.broadcast.emit("new player", {id: newPlayer.id, team: newPlayer.getTeam()});

    // inform the new user about the previous existing users
    var i, existingPlayer;
    for (i = 0; i < cc.players.length; i++) {
        existingPlayer = cc.players[i];
        this.emit("new player", {id: existingPlayer.id, team: existingPlayer.getTeam()});
    };

    // add the new user to the server list of users
    cc.players.push(newPlayer);
    cc.players.forEach(function (x) { util.log(x.id) });
};

function onMove (params) {
    util.log("move " + this.id);

    var user = cc.playerById(this.id),
        cap = app.getCapById(params.capId);

    if (cc.turn.receivedCommand[user.getTeam()] != "") {
        this.emit("already commanded");
        return;
    }

    if (user.getTeam() != cap.team) {
        this.emit("not your cap");
        return;
    }

    cc.turn.receivedCommand[user.getTeam()] = "move";
    cc.move(params.capId, params.x, params.y);
    if (cc.turn.canEnd()) cc.turn.end(this);
};

function onPass (params) {
    util.log("pass " + this.id);

    var user = cc.playerById(this.id),
        cap = app.ball.poss;

    if (cc.turn.receivedCommand[user.getTeam()] != "") {
        this.emit("already commanded");
        return;
    }

    if (user.getTeam() != cap.team) {
        this.emit("not your cap");
        return;
    }

    cc.turn.receivedCommand[user.getTeam()] = "pass";
    cc.pass(params.x, params.y);
    if (cc.turn.canEnd()) cc.turn.end(this);
};

function onDribbling (params) {
    util.log("dribbling" + this.id);

    var user = cc.playerById(this.id),
        cap = app.getCapById(params.capId);
    
    if (cc.turn.receivedCommand[user.getTeam()] != "") {
        this.emit("already commanded");
        return;
    }

    if (user.getTeam() != cap.team) {
        this.emit("not your cap");
        return;
    }

    cc.turn.receivedCommand[user.getTeam()] = "dribbling";
    cc.dribbling(params.capId, params.x, params.y);
    if (cc.turn.canEnd()) cc.turn.end(this);
}

function onTackle (params) {
    util.log("tackle" + this.id);

    var user = cc.playerById(this.id),
        cap = app.getCapById(params.capId);
    
    if (cc.turn.receivedCommand[user.getTeam()] != "") {
        this.emit("already commanded");
        return;
    }

    if (user.getTeam() != cap.team) {
        this.emit("not your cap");
        return;
    }

    cc.turn.receivedCommand[user.getTeam()] = "tackle";
    cc.tackle(params.capId, params.x, params.y);
    if (cc.turn.canEnd()) cc.turn.end(this);
}

function onCover (params) {
    util.log("cover" + this.id);

    var user = cc.playerById(this.id),
        cap = app.getCapById(params.capId);
    
    if (cc.turn.receivedCommand[user.getTeam()] != "") {
        this.emit("already commanded");
        return;
    }

    if (user.getTeam() != cap.team) {
        this.emit("not your cap");
        return;
    }

    cc.turn.receivedCommand[user.getTeam()] = "cover";
    cc.cover(params.capId, params.x, params.y);
    if (cc.turn.canEnd()) cc.turn.end(this);
}

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

cc.init();
