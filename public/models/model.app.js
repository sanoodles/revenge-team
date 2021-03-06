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

    // unstun all the caps, every turn. caps are stunned only 1 turn
    unstun: function () {
        var i, max;
        for (i = 0, max = app.caps.length; i < max; i++) {
            app.caps[i].stun = -1;
        }
    },

    // returns true if the tackle succeeds, false otherwise
    tackle: function(capId, x, y) {

        // cap to tackle
        capA = field.getElementByCoords(x, y);
        capD = app.getCapById(capId);
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

    // returns true if the dribble succeeds, false otherwise
    dribbling: function(capId, x, y) {

        // cap to dribble
        capD = field.getElementByCoords(x, y);
        capA = app.getCapById(capId);
        if (capD instanceof Cap) {
            //we compare roll dice dribbling and tackle
            tacklingDice = Math.random()*20 + capD.tackle;
            dribblingDice = Math.random()*20 + capA.dribbling;
            diffDice = dribblingDice - tacklingDice;
            if (diffDice < 0) { //D wins tackler gets ball
                app.possession.give(capD);
                return false;
            } else { // A wins, D player stunned for 1 turn
                capD.stun = 1;
                return true;
            }
        }
    },

    // the defender capId will cover the attacker in (x,y)
    cover: function(capId, x, y) {
        // cap to cover
        capA = field.getElementByCoords(x, y);
        // the defender that will cover
        capD = app.getCapById(capId);

        if (capA instanceof Cap) {
            capD.covering = capA;
            capA.coveredBy = capD;
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

            // if the current "cap" has a different team from the old
            // possesion cap the possesion have changed of team
            if (app.ball.poss !== null && cap.team !== app.ball.poss.team) {
                // we will clear all the coveredBy - covering
                // attributes because the D caps are A now
                var i, max;
                for (i = 0, max = app.caps.length; i < max; i++) {
                    app.caps[i].coveredBy = null;
                    app.caps[i].covering = null;
                }
            }
            
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
                    //if this team has possesion, its caps cannot cover
                    app.caps[i].coveredBy = null;
                    app.caps[i].covering = null;
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

                /* Detect unstunned rival caps inside the pass cone
                 * In particular, it detects whether the center of a rival cap
                 * is inside the pass cone; not whether there is a rival cap
                 * touching the pass cone.
                 */
                for (i = 0, max = app.caps.length; i < max; i++) {
                    if (app.caps[i].team != app.ball.poss.team && app.caps[i].stun === -1) {

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

        /** 
        * When a player passes the ball, the D players have a tackle area
        * around them if the pass is inside this tackle area, the D player
        * will be able to fight for the ball
        * RETURNS null if the final pass position is free, or the CAP ref otherwise
        */
        insideTackleArea: function(toX, toY) {

            var i, max;
            for (i = 0, max = app.caps.length; i < max; i++) {

                if (app.caps[i].team !== app.ball.poss.team && app.caps[i].stun === -1) {
                    
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

        /** 
        * same as insideTackleArea
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

        /** 
        * When the ball lays in the red zone
        * and it also lays inside a defender D area
        * the defender can steal the ball or add more deflaction
        **/
        toRedZone: function(x, y) {

            // random deflaction applied to any ball inside red zone
            randomFactor = Math.log(distanceInRedZone);
            app.ball.x = x + (Math.random()*randomFactor*2-randomFactor)*20;
            app.ball.y = y + (Math.random()*randomFactor*2-randomFactor)*20;

            // if after the random deflection the ball lays
            // over a D player, he can add more deflection or gain control

            // first we consider the case where the ball lays in both
            // D tackler area and A control area.
            var tacklerPlayer = app.pass.insideTackleArea(app.ball.x, app.ball.y);

            if (tacklerPlayer instanceof Cap) {
                var controlPlayer = app.pass.insideControlArea(app.ball.x, app.ball.y);
                if (controlPlayer instanceof Cap) { //lays in both control area
                        controlDice = Math.random()*20 + controlPlayer.control;
                        tacklerDice = Math.random()*20 + tacklerPlayer.tackle;
                        tackleRes = controlDice - tacklerDice;
                        if (tackleRes < 0) {
                            app.ball.x = x + (Math.random() * tacklerPlayer.tackle * 2 - tacklerPlayer.tackle)*2;
                            app.ball.y = y + (Math.random() * tacklerPlayer.tackle * 2 - tacklerPlayer.tackle)*2;
                        }
                } else { //lays only in tackler area only, the D player can gain control
                    randomDice = Math.random() * 20;
                    if (randomDice < tacklerPlayer.tackle) {
                        app.ball.x = tacklerPlayer.x;
                        app.ball.y = tacklerPlayer.y;
                    } else { // dont gain control, more deflaction
                        app.ball.x = x + (Math.random() * tacklerPlayer.tackle * 2 - tacklerPlayer.tackle)*2;
                        app.ball.y = y + (Math.random() * tacklerPlayer.tackle * 2 - tacklerPlayer.tackle)*2;
                    }
                }
            }
        },
        toGreenZone: function(x, y) {
            app.ball.x = x;
            app.ball.y = y;

            // if the pass is to green area but inside an enemy tackle area
            // he fights for it, so a 20 dice roll will decide if the
            // ball final position, is as desired by the possesion team
            // or distorted by the D team
            var tacklerPlayer = app.pass.insideTackleArea(app.ball.x, app.ball.y);

            if (tacklerPlayer instanceof Cap) {
                // desired player receiver (if exists)
                cap = field.getElementByCoords(app.ball.x, app.ball.y);

                // the desired final position is a cap
                if (cap instanceof Cap) {

                    possDice = Math.random()*20 + cap.control;
                    // his dice multiplied by 0.75 to give advg the to the A team in
                    // green area
                    tacklerDice = (Math.random()*20 + tacklerPlayer.tackle)*0.75;
                    tackleRes = possDice - tacklerDice;

                    if (tackleRes < 0 && tackleRes > -5) { //slight deflection by defender
                        app.ball.x = x + (Math.random() * tacklerPlayer.tackle * 2 - tacklerPlayer.tackle)*2;
                        app.ball.y = y + (Math.random() * tacklerPlayer.tackle * 2 - tacklerPlayer.tackle)*2;
                    } else if (tackleRes < -5) { //strong deflection, defender wins possesion
                        app.ball.x = tacklerPlayer.x;
                        app.ball.y = tacklerPlayer.y;
                    }
                } else { // there is no cap receiver, "pass to space"

                    var controlPlayer = app.pass.insideControlArea(app.ball.x, app.ball.y);

                    // if the ball is inside the control area of an A player
                    // both the A player and the D player fight for it
                    if (controlPlayer instanceof Cap) {
                        controlDice = Math.random()*20 + controlPlayer.control;
                        tacklerDice = Math.random()*20 + tacklerPlayer.tackle;
                        tackleRes = controlDice - tacklerDice;

                        if (tackleRes < 0) { //deflaction by D player
                            app.ball.x = x + (Math.random() * tacklerPlayer.tackle * 2 - tacklerPlayer.tackle)*2;
                            app.ball.y = y + (Math.random() * tacklerPlayer.tackle * 2 - tacklerPlayer.tackle)*2;
                        }
                    } else { //only under D player tackle area, 100% deflaction

                        randomDice = Math.random() * 20;
                        if (randomDice < tacklerPlayer.tackle) {
                            app.ball.x = tacklerPlayer.x;
                            app.ball.y = tacklerPlayer.y;
                        } else { // dont gain control, more deflaction
                            app.ball.x = x + (Math.random() * tacklerPlayer.tackle * 2 - tacklerPlayer.tackle)*2;
                            app.ball.y = y + (Math.random() * tacklerPlayer.tackle * 2 - tacklerPlayer.tackle)*2;
                        }
                    }
                }
            }
        },
        checkPossession: function() {
            // arrived to other cap
            cap = field.getElementByCoords(app.ball.x, app.ball.y);
            if (cap instanceof Cap) {
                app.possession.give(cap);
            } else {
                app.possession.clear();
            }
        },
    },

};

app.save = function (args) {

    // console.log(args);
}

if (typeof CLIENT_SIDE === 'undefined') exports.app = app;

if (typeof CLIENT_SIDE === 'undefined') {
    var Cap     = require("./model.cap.js").Cap,
        field   = require('./model.field.js').field,
        utils   = require("../utils.js").utils;
}
