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
var cc = new CommandController(); // @see /generic-cc.js

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
    // socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
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
        case "dribbling":
            this.dribbling(params.capId, params.x, params.y);
            break;
        case "tackle":
            this.tackle(params.capId, params.x, params.y);
            break;
        case "pass":
            this.pass(params.x, params.y);
            break;
        case "unstun":
            this.unstun();
            break;
    }
    
    // socket.emit(cmd, params);
}
