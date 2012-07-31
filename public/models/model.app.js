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

        // returns true if the tackle succeeds, false otherwise
    tackle: function(capId, x, y) {

        // cap to tackle
        capA = field.getElementByCoords(x, y);
        capD = app.getCapById(capId);
        console.log(x,y);
        if (capA instanceof Cap && capA.hasBall()) {
            //we compare roll dice dribbling and tackle
            tacklingDice = Math.random()*20 + capD.tackle;
            dribblingDice = Math.random()*20 + capA.dribbling;
            diffDice = dribblingDice - tacklingDice;
            if (diffDice < 0) { //D wins tackler gets ball
                app.possession.give(capD);
                return true;
            } else { // A wins, D player stunned for 1 turn
                capD.stun = 1;
                return false;
            }
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

            //now it gives team possesion / clear it from every cap attribute
            var i, max;
            for (i = 0, max = app.caps.length; i < max; i++) {
                if (app.caps[i].team !== app.ball.poss.team) {
                    app.caps[i].teampos = false;
                } else {
                    app.caps[i].teampos = true;
                }
            }
        },
        clear: function () {
            app.ball.poss = null;
            //clear team possesion from every cap attribute
            var i, max;
            for (i = 0, max = app.caps.length; i < max; i++) {
                app.caps[i].teampos = false;
            }
        }
    },

    /**
     * The pass range of a cap is influenced by the pass skill.
     *
     * The angle of the pass cone of a cap is influenced by the talent skill.
     *
     * The pass range is limited by the presence of a rival cap in the pass cone.
     *
     * A pass is attempted from a passing cap to a target point.
     *
     * An ongoing pass has a green zone (near pass) and a red zone (far pass).
     *
     * If made to the green zone, the ball will arrive to the exact previewed target point.
     *
     * If made to the red zone, the ball final position will be distorted by an error,
     * that is larger as the pass is attempted farther.
     *
     * When the user selects pass, for all rivals, a circle will appear. Its
     * radio is influenced by the defense skill.
     *
     * The pass attribute is only used as a namespace; to group the pass-related methods.
     */
    pass: {

        /**
         * @param {Float} a [0..2Pi] The angle of the target point using the passing cap as angle vertex. In radians.
         * @param {Float} aerr [0..Pi] Error angle of the pass. The greater, the wider the pass cone. In radians.
         * @pre app.ball.poss is the passing cap
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
                    aRival, // angle of the rival using the passing cap as vertex

                    /* angle of the first pass cone side [-Pi..2Pi]
                     * (comes before the target point)
                     */
                    aPrev = a - aerr,

                    /* angle of the second pass cone side [0..3Pi]
                     * (comes after the target point)
                     */
                    aPost = a + aerr,
                    pi = Math.PI, twoPi = Math.PI * 2;

                /* Detect rival caps inside the pass cone
                 * In particular, it detects whether the center of a rival cap
                 * is inside the pass cone; not whether there is a rival cap
                 * touching the pass cone.
                 */
                for (i = 0, max = app.caps.length; i < max; i++) {
                    if (app.caps[i].team != app.ball.poss.team && app.caps[i].dribbled === -1) {

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

            var passingCapPassRange, minRivalInPassConeDist;

            passingCapPassRange = app.ball.poss.getPassRange();
            minRivalInPassConeDist = getMinRivalInPassConeDist(a, aerr);
            return Math.min(passingCapPassRange, minRivalInPassConeDist);
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
        },

        /** when a player passes the ball, the D players have a tackle area
        * around them if the pass is inside this tackle area, the D player
        * will be able to fight for the ball
        * RETURNS null if the final pass position is free, or the CAP ref otherwise
        */
        insideTackleArea: function(toX, toY) {

            var i, max;
            for (i = 0, max = app.caps.length; i < max; i++) {

                if (app.caps[i].team !== app.ball.poss.team && app.caps[i].dribbled === -1) {
                    
                    dist = utils.getEuclideanDistance(
                        app.caps[i].x, app.caps[i].y, 
                        toX, toY
                        );
                    if (dist < app.caps[i].getDefenseRange()) {
                        return app.caps[i];
                    }
                }
            }
            return null;
        },

        /** same as insideTackleArea
        * but for A teams and based on control skill
        **/
        insideControlArea: function(toX, toY) {

            var i, max;
            for (i = 0, max = app.caps.length; i < max; i++) {
                if (app.caps[i].team === app.ball.poss.team) {
                    dist = utils.getEuclideanDistance(
                        app.caps[i].x, app.caps[i].y,
                        toX, toY
                        );
                    if (dist < app.caps[i].getControlRange()) {
                        return app.caps[i];
                    }
                }
            }
            return null;
        },
    },

};

app.save = function (args) {

    // console.log(args);
}

if (typeof CLIENT_SIDE === 'undefined') exports.app = app;
