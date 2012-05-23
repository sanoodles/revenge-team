var ongoing = "";
var $canvas;
var ctx; // context. not a clue of what actually is.

var cap = {
    x: 100,
    y: 100,
    speed: 20,
};

var capPreview = {
    x: cap.x,
    y: cap.y
};

function getCapMaxRange(c) {
    return c.speed * 2;
}

function euclideanDistance(x_0, y_0, x, y) {
    result = Math.sqrt((x - x_0) ^ 2 + (y - y_0) ^ 2);
    console.log(x_0 + ", ", y_0 + ", ", x + ", ", y + " = ", result);
    return result;
}

function redraw() {
    // field
    ctx.beginPath();
    ctx.rect(0, 0, 524, 380);
    ctx.fillStyle = '#009000';
    ctx.fill();

    // range radio
    if (ongoing == "move") {
        ctx.beginPath();
        ctx.arc(cap.x, cap.y, getCapMaxRange(cap), 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = '#40C040';
        ctx.fill();
    }

    // cap
    ctx.beginPath();
    ctx.arc(cap.x, cap.y, 10, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = '#000090';
    ctx.fill();

    // cap preview
    if (ongoing == "move") {
        ctx.beginPath();
        ctx.arc(capPreview.x, capPreview.y, 10, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = '#004848';
        ctx.fill();
    }
}

function getElementByCoords(relX, relY) {
    if (cap.x > relX - 10 && cap.x < relX + 10) {
        if (cap.y > relY - 10 && cap.y < relY + 10) {
            return cap;
        }
    }
    
    return null;
}

// initialization
$(document).ready(function() {
    $canvas = $('#c'); // canvas
    ctx = $canvas[0].getContext('2d');

    // move
    $canvas.mousedown(function(e) {
        var parentOffset = $(this).offset();
        var relX = e.pageX - parentOffset.left;
        var relY = e.pageY - parentOffset.top;
        if (getElementByCoords(relX, relY)) {
            ongoing = "move";
            redraw();
        }
    });
    $canvas.mouseup(function(e) {
        if (ongoing == "move") {
            cap.x = capPreview.x;
            cap.y = capPreview.y;
            ongoing = "";
            redraw();
        }
    });
    $canvas.mousemove(function(e) {
        if (ongoing == "move") {
            var parentOffset = $(this).offset();
            var relX = e.pageX - parentOffset.left;
            var relY = e.pageY - parentOffset.top;

            if (euclideanDistance(cap.x, cap.y, relX, relY) < getCapMaxRange(cap)) {
                capPreview.x = relX;
                capPreview.y = relY;
            }
            
            redraw();
        }
    });

    redraw();
});
