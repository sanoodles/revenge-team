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
    var field       = require('./public/models/model.field.js').field,
        Team        = require('./public/models/model.team.js').Team,
        Cap         = require('./public/models/model.cap.js').Cap,
        Ball        = require('./public/models/model.ball.js').Ball,
        PreviewBall = require('./public/models/model.ball.js').PreviewBall,
        app         = require('./public/models/model.app.js').app;
}

function CommandController () {
    
    this.genericInit = function () {
        // app initialization
        app.caps[0] = new Cap(0, field.getRandomX(), field.getRandomY(), Team.LOCAL);
        app.caps[1] = new Cap(1, field.getRandomX(), field.getRandomY(), Team.LOCAL);
        app.caps[2] = new Cap(2, field.getRandomX(), field.getRandomY(), Team.VISITOR);
        app.ball = new Ball(field.getRandomX(), field.getRandomY());
    };
    this.getFieldMarginH = function () {
        return field.marginH;
    };
    this.getFieldMarginV = function () {
        return field.marginV;
    };
    this.getFieldWidth = function () {
        return field.width;
    };
    this.getFieldHeight = function () {
        return field.height;
    };
    this.getFieldElementByCoords = function (x, y) {
         return field.getElementByCoords(x, y);
    };
    this.canPutCapOnFieldCoords = function (x, y) {
        return field.canPutCapOnCoords(x, y);
    };

     /**
      * @param st {JSON} Game variables status
      */
    this.setStatus = function (st) {
        app.ball.setPosition(st.ball.x, st.ball.y);
    };

    this.move = function (capId, x, y) {
        var cap = app.getCapById(capId);
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

      /**
       * @pre ball.poss is the cap passing
       */
    this.pass = function (x, y) {
        distanceInRedZone = app.pass.getDistanceInRedZone(x, y);

        // pass to green zone
        if (distanceInRedZone <= 0) {
            app.ball.x = x;
            app.ball.y = y;

        // pass to red zone
        } else {
            randomFactor = distanceInRedZone + app.ball.poss.radio * 2;
            app.ball.x = x + Math.random() * (randomFactor - randomFactor / 2);
            app.ball.y = y + Math.random() * (randomFactor - randomFactor / 2);
        }

        // arrived to other cap
        cap = field.getElementByCoords(app.ball.x, app.ball.y);
        if (cap instanceof Cap) {
            app.possession.give(cap);
        } else {
            app.possession.clear();
        }
    };
};

if (typeof CLIENT_SIDE === 'undefined') exports.CommandController = CommandController;
