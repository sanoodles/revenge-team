/**
 * Generic Command Controller
 * @desc Common attributes and methods for client and server command
 * controllers
 * @resp Reads and writes the models
 * @resp Receives the game variables from the command controller
 * @resp Updates the model
 * @resp Calls the graphic controller back
 */

if (typeof CLIENT_SIDE === 'undefined') {
    var app         = require('./public/models/model.app.js').app,
        Ball        = require('./public/models/model.ball.js').Ball
        Cap         = require('./public/models/model.cap.js').Cap,
        field       = require('./public/models/model.field.js').field,
        PreviewBall = require('./public/models/model.ball.js').PreviewBall,
        Team        = require('./public/models/model.team.js').Team;
}

function CommandController () {

    this.genericInit = function () {
        // object creation needed by both client and server
        app.caps[0] = new Cap(1, 50, 50, Team.LOCAL);
        app.caps[1] = new Cap(2, 100, 100, Team.LOCAL);
        app.caps[2] = new Cap(3, 150, 150, Team.VISITOR);
        app.caps[3] = new Cap(3, 200, 200, Team.VISITOR);
        app.ball = new Ball(200, 200);
    };

    /**
     * The reverse of setStatus
     * Used for client-server communication
     * getStatus is actually only used by the client; could be moved
     * to client-cc.js
     * @return {JSON} Status of the game variables
     */
    this.getStatus = function () {
        return {
            ball: app.ball.getStatus(),
            caps: app.caps.map(function (c) { return c.getStatus() })
        }
    }

    /**
     * The reverse of to getStatus
     * Used for client-server communication
     * setStatus is actually only used by the server; could be moved
     * to server-cc.js
     * @param st {JSON} Status of the game variables
     * @post Writes the model with the variables in st
     */
    this.setStatus = function (st) {
        // ball
        app.ball.setPosition(st.ball.x, st.ball.y);
        app.ball.poss = st.ball.poss ? app.getCapById(st.ball.poss) : null;

        // caps
        st.caps.forEach(function (c) {
            app.getCapById(c.id).setPosition(c.x, c.y);
        });
    };

    // unstun all the caps, every turn. caps are stunned only 1 turn
    this.unstun = function () {
        app.unstun();
    };

    this.move = function (capId, x, y) { 

        var cap = app.getCapById(capId);

        // if this cap is covered by another cap, we should also
        // move it. Done before moving the current cap because
        // at this point we have origin and end of movement
        if (cap.coveredBy instanceof Cap) {

            dist = utils.getEuclideanDistance(cap.x, cap.y, x, y);
            var capD = cap.coveredBy,
            x_mov = x - cap.x,
            y_mov = y - cap.y;

            capD.moveIfCovering(x_mov, y_mov);

            // if the separation between both caps now is bigger
            // than defemders's D area the cover is broken
            separation = utils.getEuclideanDistance(x, y, capD.x, capD.y);
            if (separation > capD.getDefenseRange()) {
                capD.covering = null;
                cap.coveredBy = null;
            } 
        }

        /*
         * TODO: checking whether can put cap on coords
         * because the client can't be trusted
         */
        cap.setPosition(x, y);

        // set possession
        if (cap.isCapOverTheBall()) {
            app.possession.give(cap);
        }

    };

    this.tackle = function(capId, x, y) {
        app.tackle(capId, x, y);
    };

    this.cover = function(capId, x, y) {
        app.cover(capId, x, y);
    };

    this.dribbling = function(capId, x, y) {
        app.dribbling(capId, x, y);
    };

      /**
       * @pre ball.poss is the cap passing
       */
    this.pass = function (x, y) {
        distanceInRedZone = app.pass.getDistanceInRedZone(x, y);

        // pass to green zone
        if (distanceInRedZone <= 0) {
            app.pass.toGreenZone(x, y);
        // pass to red zone
        } else {
            app.pass.toRedZone(x, y);
        }
        app.pass.checkPossession();
    };
};

if (typeof CLIENT_SIDE === 'undefined') exports.CommandController = CommandController;
