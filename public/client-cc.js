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

cc.init = function () {
    this.genericInit();
    socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
    socket.on("update", onUpdate);
},

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
