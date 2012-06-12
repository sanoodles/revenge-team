/**
 * Initialization after all resources have been downloaded
 */
$(window).load(function () {

    // models initialization
    field.init();

    // create event handlers
    documentInit();
    capmenu.init();

    // app initialization
    $field = $(field.el);
    $capmenu = $(capmenu.el);
    ctx = field.el.getContext('2d');
    capmenu.hide();
    for (var i = 0, max = 2; i < max; i++) {
        caps[i] = new Cap(i);
    }
    ball = new Ball(
            field.marginH + Math.random() * field.width,
            field.marginV + Math.random() * field.height
    );
    ballPreview = new PreviewBall();

    // first screen paint
    canvas.redraw();
});

// helper
function documentInit() {

    $(document).mousedown(function (e) {
        debug("document mousedown");

        var offset = $("#c").offset(),
            relX = e.pageX - offset.left,
            relY = e.pageY - offset.top,
            cap;

        // hide cap menu
        if (ongoing.what === "cap menu choose") {
            capmenu.hide();
        }

        // show cap menu
        cap = field.getElementByCoords(relX, relY);
        if (cap instanceof Cap) {
            if (ongoing.what === "") {
                capmenu.show(relX, relY, ball.poss !== null);
                ongoing.what = "cap menu choose";
                ongoing.who = cap;
            }
        }
    });

    $(document).mousemove(function (e) {
        debug("document mousemove");

        var fieldOffset = $field.offset(),
            mouseX = e.pageX - fieldOffset.left,
            mouseY = e.pageY - fieldOffset.top;

        switch (ongoing.what) {

        case "start move":
        case "moving":
            var mouseXDiff = mouseX - ongoing.who.x,
                mouseYDiff = mouseY - ongoing.who.y,
                ang = getAngle(ongoing.who, {x: mouseX, y: mouseY}),
                maxXDiff = ongoing.who.getMoveRange() * Math.sin(ang),
                maxYDiff = -1 * ongoing.who.getMoveRange() * Math.cos(ang),
                XDiff,
                YDiff;

            // if already a cap on that position
            if (!field.canPutCapOnCoords(ongoing.who, mouseX, mouseY)) {
                break;
            }

            // moving right
            if (mouseXDiff >= 0) {
                XDiff = Math.min(mouseXDiff, maxXDiff);
                capPreview.x = Math.min(ongoing.who.x + XDiff, field.marginH + field.width);
            // moving left
            } else {
                XDiff = Math.max(mouseXDiff, maxXDiff);
                capPreview.x = Math.max(ongoing.who.x + XDiff, field.marginH);
            }

            // moving down
            if (mouseYDiff >= 0) {
                YDiff = Math.min(mouseYDiff, maxYDiff);
                capPreview.y = Math.min(ongoing.who.y + YDiff, field.marginV + field.height);
            // moving up
            } else {
                YDiff = Math.max(mouseYDiff, maxYDiff);
                capPreview.y = Math.max(ongoing.who.y + YDiff, field.marginV);
            }

            canvas.redraw();

            ongoing.what = "moving";

            break;

        case "start pass":
        case "passing":
            ballPreview.x = mouseX;
            ballPreview.y = mouseY;

            ballPreview.x = Math.min(mouseX, field.marginH + field.width);
            ballPreview.x = Math.max(ballPreview.x, field.marginH);
            ballPreview.y = Math.min(mouseY, field.marginV + field.height);
            ballPreview.y = Math.max(ballPreview.y, field.marginV);

            canvas.redraw();

            ongoing.what = "passing";
            break;

        }

    });

    $(document).mouseup(function (e) {
        debug("document mouseup");

        var distanceInRedZone,
            randomFactor,
            cap;

        // change cap position
        switch (ongoing.what) {

        case "moving":
            ongoing.who.setPosition(capPreview.x, capPreview.y);
            ongoing.what = "";

            // set possession
            if (ongoing.who.isCapOverTheBall()) {
                app.givePossession(ongoing.who);
            }

            canvas.redraw();
            break;

        case "passing":

            distanceInRedZone = getEuclideanDistance(ball.x, ball.y, ballPreview.x, ballPreview.y) - ongoing.who.getPassRange();

            // pass to green zone
            if (distanceInRedZone <= 0) {
                ball.x = ballPreview.x;
                ball.y = ballPreview.y;

            // pass to red zone
            } else {
                randomFactor = distanceInRedZone + ongoing.who.radio * 2;
                ball.x = ballPreview.x + Math.random() * (randomFactor - randomFactor / 2);
                ball.y = ballPreview.y + Math.random() * (randomFactor - randomFactor / 2);
            }
            ongoing.what = "";

            // arrived to other cap
            cap = field.getElementByCoords(ball.x, ball.y);
            if (cap instanceof Cap) {
                app.givePossession(cap);
            } else {
                app.clearPossession();
            }

            canvas.redraw();
            break;
        }
    });

}
