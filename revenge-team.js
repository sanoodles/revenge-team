var ongoing = "";
var $canvas;
var ctx; // context of the canvas
var $capmenu;

const FIELD_HEIGHT = 480;
const FIELD_WIDTH = FIELD_HEIGHT * 1.4;
const FIELD_MARGIN_H = 20;
const FIELD_MARGIN_V = 20;
const CAP_RADIO = 12;
const BALL_RADIO = 6;
const IS_DEBUG_MODE = false;

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





function debug(v) {
    if (IS_DEBUG_MODE) {
        console.log(v + ", " + ongoing);
    }
}

function isCapOverTheBall(cap) {
    return euclideanDistance(cap.x, cap.y, ball.x, ball.y) <= CAP_RADIO;
}

function setPossession(cap) {
    ball.poss = cap;
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
    if (ongoing == "start move" || ongoing == "moved") {
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
    if (ongoing == "start move" || ongoing == "moved") {
        ctx.beginPath();
        ctx.arc(capPreview.x, capPreview.y, CAP_RADIO, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = '#0000FF';
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
    
    $canvas = $('#c');
    ctx = $canvas[0].getContext('2d');
    $capmenu = $("#cap-menu");
    
    // field size
    $canvas.attr({
        width: FIELD_MARGIN_H + FIELD_WIDTH + FIELD_MARGIN_H,
        height: FIELD_MARGIN_V + FIELD_HEIGHT + FIELD_MARGIN_V
    });

    // cap menu
    $capmenu.hide();
    $canvas.mousedown(function (e) {
        debug("canvas mousedown");

        // hide cap menu
        if (ongoing === "cap menu choose") {
            $capmenu.hide();
        }
        
        var parentOffset = $(this).offset();
        var relX = e.pageX - parentOffset.left;
        var relY = e.pageY - parentOffset.top;

        // show cap menu
        if (getElementByCoords(relX, relY) !== null) {
            $capmenu.css({left: relX, top: relY}).show();
            ongoing = "cap menu choose";
        }
    });
    $capmenu.mousedown(function (e) {
        debug("capmenu mousedown");
        ongoing = "cap menu click";
    });
    $capmenu.mouseup(function (e) {
        debug("capmenu mouseup");
        if (ongoing === "cap menu click") {
            ongoing = "start move";
            $capmenu.hide();
            redraw();
        }
    });
    $(document).mousemove(function (e) {
        debug("document mousemove");
        
        if (ongoing == "start move" || ongoing == "moved") {
  
            var canvasOffset = $canvas.offset();
            var mouseX = e.pageX - canvasOffset.left;
            var mouseY = e.pageY - canvasOffset.top;
            var mouseXDiff = mouseX - cap.x;
            var mouseYDiff = mouseY - cap.y;
            var ang = angle(cap, {x: mouseX, y: mouseY});
            var maxXDiff = cap.maxRange() * Math.sin(ang);
            var maxYDiff = -1 * cap.maxRange() * Math.cos(ang);
            var XDiff;
            var YDiff;
            
            // moving right
            if (mouseXDiff >= 0) {
                XDiff = Math.min(mouseXDiff, maxXDiff);
                capPreview.x = Math.min(cap.x + XDiff, FIELD_MARGIN_H + FIELD_WIDTH);
            // moving left    
            } else {
                XDiff = Math.max(mouseXDiff, maxXDiff);
                capPreview.x = Math.max(cap.x + XDiff, FIELD_MARGIN_H);
            }

            // moving down
            if (mouseYDiff >= 0) {
                YDiff = Math.min(mouseYDiff, maxYDiff);
                capPreview.y = Math.min(cap.y + YDiff, FIELD_MARGIN_V + FIELD_HEIGHT);
            // moving up
            } else {
                YDiff = Math.max(mouseYDiff, maxYDiff);
                capPreview.y = Math.max(cap.y + YDiff, FIELD_MARGIN_V);                
            }
            
            redraw();

            ongoing = "moved";
        }
    });
    $(document).mouseup(function (e) {
        debug("document mouseup");

        // change cap position
        if (ongoing == "moved") {
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

    redraw();
});
