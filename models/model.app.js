var IS_DEBUG_MODE = false,
    ongoing = {what: "", who: null},
    $field, // currently canvas == field
    ctx, // context of the canvas
    $capmenu,
    caps = [];

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
    givePossession: function (cap) {
        ball.poss = cap;
        ball.x = cap.x;
        ball.y = cap.y;
    },
    clearPossession: function () {
        ball.poss = null;
    }
};
