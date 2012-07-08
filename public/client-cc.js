/**
Client Command Controller

    On user command:
        Generic behavior
        Forwards the command to the server
    On server command:
        Generic behavior
        Calls the graphic controller
*/
var cc = new CommandController();
cc.socket = null;

cc.init = function () {
    this.genericInit();
    socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
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
    }
    
    socket.emit(cmd, params);
}
