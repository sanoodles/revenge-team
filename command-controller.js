/**
 * Command controller
 * - Receives commands from the graphic controller
 * - Reads and writes the models
 */

 var cc = {
     init: function () {
        // app initialization
        caps[0] = new Cap(0, Team.LOCAL);
        caps[1] = new Cap(1, Team.LOCAL);
        caps[2] = new Cap(2, Team.VISITOR);
        ball = new Ball(
                field.marginH + Math.random() * field.width,
                field.marginV + Math.random() * field.height
        );
     },
     getFieldMarginH: function () {
        return field.marginH;
     },
     getFieldMarginV: function () {
        return field.marginV;
     },
     getFieldWidth: function () {
        return field.width;
     },
     getFieldHeight: function () {
        return field.height;
     },
     getFieldElementByCoords: function (x, y) {
         return field.getElementByCoords(x, y);
     },
     canPutCapOnFieldCoords: function (x, y) {
        return field.canPutCapOnCoords(x, y);
     },
     move: function (cap, x, y) {
        /*
         * TODO: checking whether can put cap on coords
         * because the client can't be trusted
         */
        cap.setPosition(x, y);

        // set possession
        if (cap.isCapOverTheBall()) {
            app.possession.give(cap);
        }

        return;
     },

      /**
       * @pre ball.poss is the cap passing
       */
     pass: function (x, y) {
        distanceInRedZone = app.pass.getDistanceInRedZone(x, y);

        // pass to green zone
        if (distanceInRedZone <= 0) {
            ball.x = x;
            ball.y = y;

        // pass to red zone
        } else {
            randomFactor = distanceInRedZone + ball.poss.radio * 2;
            ball.x = x + Math.random() * (randomFactor - randomFactor / 2);
            ball.y = y + Math.random() * (randomFactor - randomFactor / 2);
        }

        // arrived to other cap
        cap = field.getElementByCoords(ball.x, ball.y);
        if (cap instanceof Cap) {
            app.possession.give(cap);
        } else {
            app.possession.clear();
        }
    }
}
