/**
 * Cap comes from "bottle cap". Is like a soccer player in the field.
 * The noun "cap" instead of "player" is used in this game to avoid
 * confusion with "user".
 * @see http://en.wikipedia.org/wiki/Bottle_cap
 */
 
if (typeof CLIENT_SIDE === 'undefined') {
    var util = require("util"),
        app = require('./model.app.js').app,
        field = require('./model.field.js').field,
        utils = require('../utils.js').utils;
}

function GenericCap() {

    this.radio = 12, // caps are round

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
    this.getControlRange = function () {
        return this.control * 3;
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

    // if this cap is covering an attacking cap, and the attacking cap moves
    // this cap will move automatically, following the attacking cap
    // x_mov and y_mov are the x,y displacements of the attacking cap
    this.moveIfCovering = function(x_mov, y_mov) {

        // distance the A cap is moving
        var dist = utils.getEuclideanDistance(x_mov, y_mov, 0, 0);

        // if the distance the A cap is moving is bigger than
        // the max distance the D cap can move, the D cap only
        // moves a ratio of the distance
        if (dist > this.getMoveRange()) {

            ratio = this.getMoveRange() / dist;
            
            // if the covering cap lays over another cap, it doesnt move, "block"
            if (!(field.getElementByCoords(this.x+x_mov*ratio, 
                this.y+x_mov*ratio) instanceof Cap)) {

                this.x += x_mov*ratio;
                this.y += y_mov*ratio;
            }                 

        } else { // the D cap moves the same distance as the A cap
            
            // if the covering cap lays over another cap, it doesnt move, "block"
            if (!(field.getElementByCoords(this.x+x_mov, this.y+y_mov) instanceof Cap)) {
                this.x += x_mov;
                this.y += y_mov;
            } 
        }
    };

    this.getStatus = function () {
        return {
            id: this.id,
            x: this.x,
            y: this.y
        };
    }
}

function Cap(id, x, y, team) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.speed = 60; // random for debugging
    this.talent = 15; // getPassAngleError
    this.pass = 15; // getPassRange
    this.defense = 15; // getDefenseRange
    this.control = 10; // getControlRange
    this.dribbling = 15;
    this.tackle = 11;
    this.team = team;
    this.stun = -1; // when a cup is dribbled or fails tackle it is stunned for 1 turn (stunned = 1)
    this.teampos = false; // false if its team doesnt have ball possession, true otherwise
    this.covering = null; // it will ref to a cap if this cap is covering another one
    this.coveredBy = null; // it will ref to a cap if this cap is covered by another one
}
Cap.prototype = new GenericCap();

if (typeof CLIENT_SIDE === 'undefined') exports.Cap = Cap;
