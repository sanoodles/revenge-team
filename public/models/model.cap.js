if (typeof CLIENT_SIDE === 'undefined') {
    var utils = require('../utils.js').utils,
        field = require('./model.field.js').field,
        app = require('./model.app.js').app;
}

function GenericCap() {
    this.radio = 12,
    this.getMoveRange = function () {
        return this.speed * 4;
    };
    this.getPassRange = function () {
        return this.pass * 20;
    };
    this.getPassAngleError = function () {
        /*
         * We add 2 to cap.talent to avoid concave angles for
         * very low cap.talent values. Also, adding at least 1 is
         * needed to avoid division by zero.
         */
        return 0.1 * 20 / (2 + this.talent);
    }
    this.getDefenseRange = function () {
        return this.defense * 3;
    }
    this.isCapOverTheBall = function () {
        return utils.getEuclideanDistance(this.x, this.y, app.ball.x, app.ball.y) <= this.radio;
    };
    this.hasBall = function () {
        return app.ball.poss === this;
    };
    this.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
        if (this.hasBall()) {
            app.ball.setPosition(x, y);
        }
    };
}

function Cap(id, x, y, team) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.speed = 60; // on steroids just for debugging purposes
    this.talent = 5;
    this.pass = 15;
    this.defense = 15;
    this.dribbling = 15;
    this.tackle = 15;
    this.team = team;
}
Cap.prototype = new GenericCap();

if (typeof CLIENT_SIDE === 'undefined') exports.Cap = Cap;
