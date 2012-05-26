var ongoing = "";
var $field; // currently canvas == field  
var ctx; // context of the canvas
var $capmenu;

const BALL_RADIO = 6;
const IS_DEBUG_MODE = false;

var ball = {
    x: FIELD_MARGIN_H + Math.random() * FIELD_WIDTH,
    y: FIELD_MARGIN_V + Math.random() * FIELD_HEIGHT,
    poss: null // cap that possess the ball
}

function debug(v) {
    if (IS_DEBUG_MODE) {
        console.log(v + ", " + ongoing);
    }
}

$(document).ready(function () {

    field.init();
    capmenu.init();
    documentInit();
    
    $field = $(field.el);
    ctx = field.el.getContext('2d');
    $capmenu = $(capmenu.el);

    capmenu.hide();

    redraw();
});
