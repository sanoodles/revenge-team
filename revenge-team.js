var ongoing = "";
var $canvas;
var ctx; // context. not a clue of what actually is.

const FIELD_HEIGHT = 480;
const FIELD_WIDTH = FIELD_HEIGHT * 1.4;
const FIELD_MARGIN_H = 20;
const FIELD_MARGIN_V = 20;
const CAP_RADIO = 12;
const BALL_RADIO = 6;

var cap = {
    x: FIELD_MARGIN_H + Math.random() * FIELD_WIDTH,
    y: FIELD_MARGIN_V + Math.random() * FIELD_HEIGHT,
    speed: 20,
    maxRange: function () {
        return this.speed * 4;
    }
};

var capPreview = {
    x: cap.x,
    y: cap.y
};

var ball = {
    x: FIELD_MARGIN_H + Math.random() * FIELD_WIDTH,
    y: FIELD_MARGIN_V + Math.random() * FIELD_HEIGHT,
    poss: null // cap that possess the ball
}

function isCapOverTheBall(cap) {
    return euclideanDistance(cap.x, cap.y, ball.x, ball.y) <= CAP_RADIO;
}

function setPossession(cap) {
    ball.poss = cap;
}

function euclideanDistance(x_0, y_0, x, y) {
    return Math.sqrt(Math.pow(x - x_0, 2) + Math.pow(y - y_0, 2));
}

function redraw() {
    
    // field
    ctx.beginPath();
    ctx.rect(0, 0,
            FIELD_MARGIN_H + FIELD_WIDTH + FIELD_MARGIN_H,
            FIELD_MARGIN_V + FIELD_HEIGHT + FIELD_MARGIN_V);
    ctx.fillStyle = '#009000';
    ctx.fill();

    // range radio
    if (ongoing == "move") {
        ctx.beginPath();
        ctx.arc(cap.x, cap.y, cap.maxRange(), 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = '#40C040';
        ctx.fill();
    }

    // cap
    ctx.beginPath();
    ctx.arc(cap.x, cap.y, CAP_RADIO, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = '#000090';
    ctx.fill();

    // cap preview
    if (ongoing == "move") {
        ctx.beginPath();
        ctx.arc(capPreview.x, capPreview.y, CAP_RADIO, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = '#004848';
        ctx.fill();
    }

    // ball
    if (ball.poss !== null) {
        ball.x = ball.poss.x;
        ball.y = ball.poss.y;
    }
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIO, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = '#F0F0F0';
    ctx.fill();

}

function getElementByCoords(relX, relY) {
    if (cap.x > relX - CAP_RADIO && cap.x < relX + CAP_RADIO) {
        if (cap.y > relY - CAP_RADIO && cap.y < relY + CAP_RADIO) {
            return cap;
        }
    }
    return null;
}

// initialization
$(document).ready(function () {
    $canvas = $('#c'); // canvas
    ctx = $canvas[0].getContext('2d');

    // field size
    $canvas.attr({
        width: FIELD_MARGIN_H + FIELD_WIDTH + FIELD_MARGIN_H,
        height: FIELD_MARGIN_V + FIELD_HEIGHT + FIELD_MARGIN_V
    });

    // move
    $canvas.mousedown(function (e) {
        var parentOffset = $(this).offset();
        var relX = e.pageX - parentOffset.left;
        var relY = e.pageY - parentOffset.top;
        if (getElementByCoords(relX, relY)) {
            ongoing = "move";
            redraw();
        }
    });
    $canvas.mouseup(function (e) {
        if (ongoing == "move") {
            cap.x = capPreview.x;
            cap.y = capPreview.y;
            ongoing = "";

            // set possession
            if (isCapOverTheBall(cap)) {
                setPossession(cap);
            }
            
            redraw();
        }
    });
    $canvas.mousemove(function (e) {
        if (ongoing == "move") {
            var parentOffset = $(this).offset();
            var relX = e.pageX - parentOffset.left;
            var relY = e.pageY - parentOffset.top;

            if (euclideanDistance(cap.x, cap.y, relX, relY) < cap.maxRange()) {
                capPreview.x = relX;
                capPreview.y = relY;
            }
            redraw();
        }
    });

    redraw();
});
