/**
 * App-wide attributes and methods
 */

function debug(v) {
    if (app.IS_DEBUG_MODE) {
        console.log(v);
    }
}

/**
 * @singleton
 */
var app = {

    IS_DEBUG_MODE: false,

    caps: [],
    ball: null,

    getCapById: function (capId) {
        var i, max;
        for (i = 0, max = this.caps.length; i < max; i++) {
            if (this.caps[i].id == capId) return this.caps[i];
        }
        return null;
    },

    /*
     * In terms of conceptual scope, Possession > Ball and
     * Possession > Cap. That's why possession responsibilties
     * are assigned to the "app" object; not to "ball" nor "cap".
     */
    possession: {
        give: function (cap) {
            ball.poss = cap;
            ball.x = cap.x;
            ball.y = cap.y;
        },
        clear: function () {
            ball.poss = null;
        }
    },
    pass: {

        getGreenZoneRadio: function (a, aerr) {

            /**
             * @pre ball.poss is the cap passing
             */
            function getMinRivalInPassConeDist (a, aerr) {
                "use strict";

                var i, max, aRival, aPrev, aPost, rivalDist, minRivalDist,
                    pi = Math.PI, twoPi = Math.PI * 2;

                /* Detect rival caps inside the pass cone
                 * In particular, it detects whether the center of a rival cap
                 * is inside the pass cone; not whether there is a rival cap
                 * touching the pass cone.
                 */
                aPrev = a - aerr;
                aPost = a + aerr;
                minRivalDist = field.width * 2; // initialize to "infinite"
                for (i = 0, max = caps.length; i < max; i++) {
                    if (caps[i].team != ball.poss.team) {

                        aRival = utils.getAngle(ball.poss, caps[i]);

                        // Reformat aRival if aPrev or aPost are beyond the 0..2Pi interval
                        if (aPrev < 0 && aRival > pi) {
                            aRival = aRival - twoPi;
                        } else if (aPost > twoPi && aRival < pi) {
                            aRival = aRival + twoPi;
                        }

                        // if rival cap caps[i] is inside the pass cone
                        if (aRival>= aPrev && aRival <= aPost) {
                            rivalDist = utils.getEuclideanDistance(
                                ball.poss.x, ball.poss.y, caps[i].x, caps[i].y
                            );
                            if (rivalDist < minRivalDist) {
                                minRivalDist = rivalDist;
                            }
                        } // fi rival inside pass cone
                    } // fi not same cap
                } // ffor
                return minRivalDist;
            }

            var passRange, minRivalInPassConeDist;

            passRange = ball.poss.getPassRange();
            minRivalInPassConeDist = getMinRivalInPassConeDist(a, aerr);
            return Math.min(passRange, minRivalInPassConeDist);
        },

        /**
         * @pre ball.poss is the cap passing
         */
        getDistanceInRedZone: function (toX, toY) {
            var passDistance, greenZoneRadio;

            passDistance = utils.getEuclideanDistance(ball.x, ball.y, toX, toY);
            greenZoneRadio = this.getGreenZoneRadio(this.getAngle(toX, toY), ball.poss.getPassAngleError());

            return passDistance - greenZoneRadio;
        },

        /**
         * @pre ball.poss is the cap passing
         */
        getAngle: function (toX, toY) {
            return utils.getAngle(
                    {x: ball.poss.x, y: ball.poss.y},
                    {x: toX, y: toY}
            );
        }
    }

};

app.save = function (args) {

    // console.log(args);
}

if (typeof CLIENT_SIDE === 'undefined') exports.app = app;
