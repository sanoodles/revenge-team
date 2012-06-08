const FIELD_HEIGHT = 480;
const FIELD_WIDTH = FIELD_HEIGHT * 1.4;
const FIELD_MARGIN_H = 20;
const FIELD_MARGIN_V = 20;

/**
 * @singleton
 */
var field = {
    
    el: null,
    
    init: function () {
        this.el = $("#c")[0];

        // field size
        $(this.el).attr({
            width: FIELD_MARGIN_H + FIELD_WIDTH + FIELD_MARGIN_H,
            height: FIELD_MARGIN_V + FIELD_HEIGHT + FIELD_MARGIN_V
        });
    },

    getElementByCoords: function (x, y) {
        var cap;
        for (var i = 0, max = caps.length; i < max; i++) {
            cap = caps[i];
            if (cap.x > x - CAP_RADIO && cap.x < x + CAP_RADIO) {
                if (cap.y > y - CAP_RADIO && cap.y < y + CAP_RADIO) {
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
        for (var i = 0, max = caps.length; i < max; i++) {
            icap = caps[i];
            if (cap !== icap) {
                if (getEuclideanDistance(x, y, icap.x, icap.y) < CAP_RADIO * 2) {
                    return false;
                }
            }
        }
        return true;        
    }
};
