var ongoing = "";
var $field; // currently canvas == field  
var ctx; // context of the canvas
var $capmenu;

const BALL_RADIO = 6;
const IS_DEBUG_MODE = true;

var ball = {
    x: FIELD_MARGIN_H + Math.random() * FIELD_WIDTH,
    y: FIELD_MARGIN_V + Math.random() * FIELD_HEIGHT,
    poss: null // cap that possess the ball
}

var ballPreview = {
    x: null,
    y: null
}

function debug(v) {
    if (IS_DEBUG_MODE) {
        console.log(v + ", " + ongoing);
    }
}

var app = {
    getElementByCoords: function (x, y) {
        if (cap.x > x - CAP_RADIO && cap.x < x + CAP_RADIO) {
            if (cap.y > y - CAP_RADIO && cap.y < y + CAP_RADIO) {
                return cap;
            }
        }
        return null;
    }
}

