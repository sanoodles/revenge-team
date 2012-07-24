/**
 * Soccer field. The green nice rectangle.
 * @see http://en.wikipedia.org/wiki/Association_football_pitch
 * @singleton
 */
var field = {

    height: 480,
    width: 672, // 480 * 1.4
    marginH: 20,
    marginV: 20,

    getRandomX: function () {
        return this.marginH + Math.random() * this.width;
    },
    getRandomY: function () {
        return this.marginV + Math.random() * this.height;
    },

    /**
     * @return The first cap that is on the coords x y
     */
    getElementByCoords: function (x, y) {
        var cap, i, max;
        for (i = 0, max = app.caps.length; i < max; i++) {
            cap = app.caps[i];
            if (cap.x > x - cap.radio && cap.x < x + cap.radio) {
                if (cap.y > y - cap.radio && cap.y < y + cap.radio) {
                    return cap;
                }
            }
        }
        return null;
    },

    /**
     * @return {Boolean} True iif there is no another cap on that area
     */
    canPutCapOnCoords: function (cap, x, y) {
        var i, max;
        for (i = 0, max = app.caps.length; i < max; i++) {
            icap = app.caps[i];
            if (cap !== icap) {
                if (utils.getEuclideanDistance(x, y, icap.x, icap.y) < cap.radio * 2) {
                    return false;
                }
            }
        }
        return true;
    }
};

if (typeof CLIENT_SIDE === 'undefined') exports.field = field;
