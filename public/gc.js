/**
 * Graphic controller
 * - Receives input from the user
 * - Chooses the view to be rendered and calls it
 *      - Actually "configures" the only view (canvas)
 *          - Actually writes the var named "gc"
 * - Sends commands to the command controller
 */

var gc = {

    // abbr for "ongoing command being graphically described by the user"
    ongoing: { 
        what: "", // command verb (eg: "move")
        who: null // command subject (eg: a Cap)
    },

    // preview of the future position of the ball after passing
    ballPreview: new PreviewBall(),

    // preview for the user drag action: move, dribble, tackle,...
    dragPreview: {
        x: 0,
        y: 0
    },

    // checks that the user drag actions are inside the skill range
    dragCheck: function (mouseX, mouseY, range) {
        var mouseXDiff = mouseX - gc.ongoing.who.x,
            mouseYDiff = mouseY - gc.ongoing.who.y,
            ang = utils.getAngle(gc.ongoing.who, {x: mouseX, y: mouseY}),
            maxXDiff = range * Math.sin(ang),
            maxYDiff = -1 * range * Math.cos(ang),
            XDiff,
            YDiff;

        // moving right
        if (mouseXDiff >= 0) {
            XDiff = Math.min(mouseXDiff, maxXDiff);
            gc.dragPreview.x = Math.min(gc.ongoing.who.x + XDiff, field.marginH + field.width);
        // moving left
        } else {
            XDiff = Math.max(mouseXDiff, maxXDiff);
            gc.dragPreview.x = Math.max(gc.ongoing.who.x + XDiff, field.marginH);
        }

        // moving down
        if (mouseYDiff >= 0) {
            YDiff = Math.min(mouseYDiff, maxYDiff);
            gc.dragPreview.y = Math.min(gc.ongoing.who.y + YDiff, field.marginV + field.height);
        // moving up
        } else {
            YDiff = Math.max(mouseYDiff, maxYDiff);
            gc.dragPreview.y = Math.max(gc.ongoing.who.y + YDiff, field.marginV);
        }
    },

    // used after the client's model is updated by the server
    onModelUpdate: function () {
        canvas.redraw();
    },
    
};

/*
 * Initialization after all resources have been downloaded
 */
$(window).load(function () {
    
    cc.init();

    // input channel initialization
    documentInit();
    capMenu.init();
    capMenu.hide();

    // output channel initialization
    canvas.init();

    // first screen paint
    canvas.redraw();
});

// helper
function documentInit() {

    $(document).mousedown(function (e) {
        debug("document mousedown");

        var offset = $("#canvas").offset(),
            relX = e.pageX - offset.left, // mouse X relative to the canvas
            relY = e.pageY - offset.top, // mouse Y relative to the canvas
            cap;

        if (gc.ongoing.what === "passing") {
            gc.ongoing.what = "passed";
        }
        if (gc.ongoing.what === "moving") {
            gc.ongoing.what = "moved";
        }
        if (gc.ongoing.what === "dribbling") {
            gc.ongoing.what = "dribbled";
        }
        if (gc.ongoing.what === "tackling") {
            gc.ongoing.what = "tackled";
        }
        // hide cap menu
        if (gc.ongoing.what === "cap menu choose") {
            capMenu.hide();
            gc.ongoing.what = "";
            gc.ongoing.who = null;
        }

        // if clicked over a cap, show cap menu
        cap = field.getElementByCoords(relX, relY);
        if (cap instanceof Cap) {
            if (gc.ongoing.what === "") {
                capMenu.show(e.clientX - 10, e.clientY - 5, app.ball.poss === cap, cap.teampos);
                gc.ongoing.what = "cap menu choose";
                gc.ongoing.who = cap;
            }
        }
    });

    $(document).mousemove(function (e) {
        debug("document mousemove");

        var fieldOffset = $(canvas.el).offset(),
            mouseX = e.pageX - fieldOffset.left,
            mouseY = e.pageY - fieldOffset.top;

        switch (gc.ongoing.what) {

        case "start move":
        case "moving":

            // can not be two caps in the same position
            if (!field.canPutCapOnCoords(gc.ongoing.who, mouseX, mouseY)) {
                break;
            }

            gc.dragCheck(mouseX, mouseY, gc.ongoing.who.getMoveRange());

            canvas.redraw();
            gc.ongoing.what = "moving";
            break;

        case "start pass":
        case "passing":
            gc.ballPreview.x = mouseX;
            gc.ballPreview.y = mouseY;
            gc.ballPreview.x = Math.min(mouseX, field.marginH + field.width);
            gc.ballPreview.x = Math.max(gc.ballPreview.x, field.marginH);
            gc.ballPreview.y = Math.min(mouseY, field.marginV + field.height);
            gc.ballPreview.y = Math.max(gc.ballPreview.y, field.marginV);

            canvas.redraw();

            gc.ongoing.what = "passing";
            break;

        case "start dribbling":
        case "dribbling":

            gc.dragCheck(mouseX, mouseY, gc.ongoing.who.getControlRange());

            gc.ongoing.what = "dribbling";
            canvas.redraw();
            break;

        case "start tackle":
        case "tackling":

            gc.dragCheck(mouseX, mouseY, gc.ongoing.who.getDefenseRange());
            gc.ongoing.what = "tackling";
            canvas.redraw();
            break;

        }

    });

    $(document).mouseup(function (e) {
        debug("document mouseup"); 

        switch (gc.ongoing.what) {

        case "moved":
            // send command "move"
            cc.run("move", {capId: gc.ongoing.who.id, x: gc.dragPreview.x, y: gc.dragPreview.y});
            gc.ongoing.what = "";
            // make valid again all the stunned / dribbled caps
            cc.run("unstun");
            canvas.redraw();
            break;

        case "passed":
            // send command "pass"
            cc.run("pass", {x: gc.ballPreview.x, y: gc.ballPreview.y});
            gc.ongoing.what = "";
            // make valid again all the stunned / dribbled caps
            cc.run("unstun");
            canvas.redraw();
            break;

        case "dribbled":
            // send command "dribbling"
            cc.run("dribbling", {capId: gc.ongoing.who.id, x: gc.dragPreview.x, y: gc.dragPreview.y});
            gc.ongoing.what = "";
            canvas.redraw();
            break;

        case "tackled":
            // send command "tackle"
            cc.run("tackle", {capId: gc.ongoing.who.id, x: gc.dragPreview.x, y: gc.dragPreview.y});
            gc.ongoing.what = "";
            canvas.redraw();
            break;
        }
    });

}
