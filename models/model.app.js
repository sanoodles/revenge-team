var IS_DEBUG_MODE = false,
    ongoing = {what: "", who: null},
    $field, // currently canvas == field
    ctx, // context of the canvas
    $capmenu,
    caps = [],
    ball,
    ballPreview;

function debug(v) {
    if (IS_DEBUG_MODE) {
        console.log(v + ", " + ongoing);
    }
}

/**
 * @singleton
 */
var app = {

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
                    if (caps[i].team != ongoing.who.team) {

                        aRival = getAngle(ongoing.who, caps[i]);

                        // Reformat aRival if aPrev or aPost are beyond the 0..2Pi interval
                        if (aPrev < 0 && aRival > pi) {
                            aRival = aRival - twoPi;
                        } else if (aPost > twoPi && aRival < pi) {
                            aRival = aRival + twoPi;
                        }

                        // if rival cap caps[i] is inside the pass cone
                        if (aRival>= aPrev && aRival <= aPost) {
                            
                            rivalDist = getEuclideanDistance(
                                ongoing.who.x, ongoing.who.y, caps[i].x, caps[i].y
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
            
            passRange = ongoing.who.getPassRange();
            minRivalInPassConeDist = getMinRivalInPassConeDist(a, aerr);
            
            return Math.min(passRange, minRivalInPassConeDist);
        },
        
        getDistanceInRedZone: function (a, aerr) {
            var passDistance, greenZoneRadio;
            
            passDistance = getEuclideanDistance(ball.x, ball.y, ballPreview.x, ballPreview.y);
            greenZoneRadio = this.getGreenZoneRadio(a, aerr);
            
            return passDistance - greenZoneRadio;
        },

        getAngle: function () {
            return getAngle(
                    {x: ongoing.who.x, y: ongoing.who.y},
                    {x: ballPreview.x, y: ballPreview.y}
            );
        }
    }
    
};
