var ongoing = {what: "", who: null};
var $field; // currently canvas == field
var ctx; // context of the canvas
var $capmenu;

const IS_DEBUG_MODE = false;

function debug(v) {
    if (IS_DEBUG_MODE) {
        console.log(v + ", " + ongoing);
    }
}

var app = {
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
    givePossession: function (cap) {
        ball.poss = cap;
        ball.x = cap.x;
        ball.y = cap.y;
    },
    clearPossession: function () {
        ball.poss = null;
    }
}

var caps = [];
for (var i = 0, max = 2; i < max; i++) {
    caps[i] = new Cap(i);
}
