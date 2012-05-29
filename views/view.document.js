function documentInit () {

    $(document).mousedown(function (e) {
        debug("document mousedown");

        // hide cap menu
        if (ongoing === "cap menu choose") {
            capmenu.hide();
        }

        var offset = $("#c").offset();
        var relX = e.pageX - offset.left;
        var relY = e.pageY - offset.top;

        // show cap menu
        if (app.getElementByCoords(relX, relY) !== null) {
            if (ongoing === "") {
                capmenu.show(relX, relY, ball.poss !== null);
                ongoing = "cap menu choose";
            }
        }
    });

    $(document).mousemove(function (e) {
        debug("document mousemove");

        var fieldOffset = $field.offset();
        var mouseX = e.pageX - fieldOffset.left;
        var mouseY = e.pageY - fieldOffset.top;
        var mouseXDiff = mouseX - cap.x;
        var mouseYDiff = mouseY - cap.y;
        var ang = angle(cap, {x: mouseX, y: mouseY});

        switch (ongoing) {

            case "start move":
            case "moving":
                var maxXDiff = cap.moveRange() * Math.sin(ang);
                var maxYDiff = -1 * cap.moveRange() * Math.cos(ang);
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

                canvas.redraw();

                ongoing = "moving";

                break;

            case "start pass":
            case "passing":
                ballPreview.x = mouseX;
                ballPreview.y = mouseY;

                ballPreview.x = Math.min(mouseX, FIELD_MARGIN_H + FIELD_WIDTH);
                ballPreview.x = Math.max(ballPreview.x, FIELD_MARGIN_H);
                ballPreview.y = Math.min(mouseY, FIELD_MARGIN_V + FIELD_HEIGHT);
                ballPreview.y = Math.max(ballPreview.y, FIELD_MARGIN_V);

                canvas.redraw();

                ongoing = "passing";
                break;

        }

    });

    $(document).mouseup(function (e) {
        debug("document mouseup");

        // change cap position
        switch (ongoing) {

            case "moving":
                cap.x = capPreview.x;
                cap.y = capPreview.y;
                ongoing = "";

                // set possession
                if (cap.isCapOverTheBall()) {
                    ball.poss = cap;
                }

                canvas.redraw();
                break;

            case "passing":

                // pass to green zone
                if (euclideanDistance(ball.x, ball.y, ballPreview.x, ballPreview.y) < cap.passRange()) {
                    ball.x = ballPreview.x;
                    ball.y = ballPreview.y;

                // pass to red zone
                } else {
                    ball.x = ballPreview.x + Math.random() * 20 - 10;
                    ball.y = ballPreview.y + Math.random() * 20 - 10;
                }
                ongoing = "";

                ball.poss = null;

                canvas.redraw();
                break;
        }
    });

}

$(document).ready(function () {

    field.init();
    capmenu.init();
    documentInit();

    $field = $(field.el);
    ctx = field.el.getContext('2d');
    $capmenu = $(capmenu.el);

    capmenu.hide();

    canvas.redraw();
});
