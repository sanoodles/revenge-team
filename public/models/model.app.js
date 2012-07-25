if (typeof CLIENT_SIDE === 'undefined') {
    var Cap = require("./model.cap.js").Cap;
}

function debug(v) {
    if (app.IS_DEBUG_MODE) {
        console.log(v);
    }
}

/**
 * App-wide attributes and methods, such as the players and the ball
 * @singleton
 */
var app = {

    IS_DEBUG_MODE: false,

    // Array with the Caps of both teams
    caps: [],

    // {Ball} The ball
    ball: null,

    getCapById: function (capId) {
        var i, max;
        for (i = 0, max = this.caps.length; i < max; i++) {
            if (this.caps[i].id == capId) return this.caps[i];
        }
        return null;
    },

    getStatus: function () {
        return {
            ball: this.ball.getStatus(),
            caps: this.caps.map(function (c) { return c.getStatus() })
        }
    },

    /**
     * The possession can be given to a cap, or cleared.
     * 
     * Why "app" is the responsible for the possession instead of
     * "ball" or "cap":
     * Because in terms of conceptual scope, Possession > Ball and
     * Possession > Cap.
     */
    possession: {
        give: function (cap) {
            app.ball.poss = cap;
            app.ball.x = cap.x;
            app.ball.y = cap.y;
        },
        clear: function () {
            app.ball.poss = null;
        }
    },

    /**
     * A pass is attempted from a passing cap to a target point.
     * An ongoing pass has a green zone (near pass) and a red zone (far pass).
     * If made to the green zone, the ball will arrive to the exact previewed target point.
     * If made to the red zone, the ball final position will be distorted by an error,
     * that is larger as the pass is attempted farther.
     *
     * The pass attribute is only used as a namespace; to group the pass-related methods.
     */
    pass: {

        /**
         * @param {Float} a [0..2Pi] The angle between the passing cap and the target point.
         * @param {Float} aerr [0..Pi] Pass angle error. The greater, the wider the pass cone.
         * @pre ball.poss is the passing cap
         */
        getGreenZoneRadio: function (a, aerr) {

            /**
             * Get the distance from the passing cap to the nearest
             * rival cap in the pass cone.
             */
            function getMinRivalInPassConeDist (a, aerr) {
                "use strict";

                var i, max, rivalDist,
                    minRivalDist = field.width * 2, // initialize to "infinite"
                    aRival, // angle between the passing cap and the rival

                    // angle of the passing cone previous to the target point [-Pi..2Pi]
                    aPrev = a - aerr,

                    // angle of the passing cone posterior to the target point [0..3Pi]
                    aPost = a + aerr, 
                    pi = Math.PI, twoPi = Math.PI * 2;

                /* Detect rival caps inside the pass cone
                 * In particular, it detects whether the center of a rival cap
                 * is inside the pass cone; not whether there is a rival cap
                 * touching the pass cone.
                 */
                for (i = 0, max = app.caps.length; i < max; i++) {
                    if (app.caps[i].team != app.ball.poss.team) {

                        aRival = utils.getAngle(app.ball.poss, app.caps[i]);

                        // magic
                        if (aPrev < 0 && aRival > pi) {
                            aRival = aRival - twoPi;
                        } else if (aPost > twoPi && aRival < pi) {
                            aRival = aRival + twoPi;
                        }

                        // if rival cap app.caps[i] is inside the pass cone
                        if (aRival>= aPrev && aRival <= aPost) {
                            rivalDist = utils.getEuclideanDistance(
                                app.ball.poss.x, app.ball.poss.y, app.caps[i].x, app.caps[i].y
                            );
                            if (rivalDist < minRivalDist) {
                                minRivalDist = rivalDist;
                            }
                        } // fi rival inside pass cone
                    } // fi not same cap
                } // ffor
                return minRivalDist;
            }

            var capPassRange, minRivalInPassConeDist;

            capPassRange = app.ball.poss.getPassRange();
            minRivalInPassConeDist = getMinRivalInPassConeDist(a, aerr);
            return Math.min(capPassRange, minRivalInPassConeDist);
        },

        /**
         * Get the distance from the beginning of the red zone to the
         * target point.
         */
        getDistanceInRedZone: function (toX, toY) {
            var passDistance, greenZoneRadio;

            passDistance = utils.getEuclideanDistance(app.ball.x, app.ball.y, toX, toY);
            greenZoneRadio = this.getGreenZoneRadio(this.getAngle(toX, toY), app.ball.poss.getPassAngleError());

            return passDistance - greenZoneRadio;
        },

        /**
         * Get angle from the passing cap to a given point
         * @pre app.ball.poss is the passing cap
         */
        getAngle: function (toX, toY) {
            return utils.getAngle(
                    {x: app.ball.poss.x, y: app.ball.poss.y},
                    {x: toX, y: toY}
            );
        }
    }

};

app.save = function (args) {

    // console.log(args);
}

if (typeof CLIENT_SIDE === 'undefined') exports.app = app;
