/**
 * Acts as output channel
 *
 * Reads
 *  ongoing.what
 *  ongoing.who
 *
 * @see http://en.wikipedia.org/wiki/Circle#Terminology
 */

var canvas = {

    // helper for redraw
    drawTriangle: function (p1, p2, p3, fillStyle) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill();
    },

    // helper for redraw
    drawSector: function (x, y, radio, startAngle, endAngle, fillStyle) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radio, startAngle - Math.PI / 2, endAngle - Math.PI / 2, false);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill();
    },

    // helper for redraw
    drawCircle: function (x, y, radio, fillStyle) {
        ctx.beginPath();
        ctx.arc(x, y, radio, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill();
    },

    redraw: function () {
        var i, max, a, aerr, p1, p2, p3;

        // field
        ctx.beginPath();
        ctx.rect(0, 0,
                field.marginH + field.width + field.marginH,
                field.marginV + field.height + field.marginV);
        ctx.fillStyle = '#009000';
        ctx.fill();

        // cap move range radio
        if (ongoing.what === "start move" || ongoing.what === "moving") {
            this.drawCircle(ongoing.who.x, ongoing.who.y, ongoing.who.getMoveRange(), '#40C040');
        }

        // pass preview
        if (ongoing.what === "start pass" || ongoing.what === "passing") {
            a = getAngle(
                {x: ongoing.who.x, y: ongoing.who.y},
                {x: ballPreview.x, y: ballPreview.y}
            );
            /*
             * aerr angle error
             * We add 2 to cap.talent to avoid concave angles for
             * very low cap.talent values. Also, adding at least 1 is
             * needed to avoid division by zero.
             */
            aerr = 0.1 * 20 / (2 + ongoing.who.talent);

            // Red cone. Actually a triangle wider than the field.
            p1 = {x: ongoing.who.x, y: ongoing.who.y};
            p2 = getPointAt(p1, field.width * 2, a - aerr);
            p3 = getPointAt(p1, field.width * 2, a + aerr);
            this.drawTriangle(p1, p2, p3, '#F00000');

            // Green cone. Actually a circle sector.
            this.drawSector(
                ongoing.who.x,
                ongoing.who.y,
                ongoing.who.getPassRange(),
                a - aerr,
                a + aerr,
                '#00F000'
            );
        }

        // cap
        for (i = 0, max = caps.length; i < max; i++) {
            ctx.beginPath();
            this.drawCircle(caps[i].x, caps[i].y, caps[i].radio, '#000090');
        }

        // cap move preview
        if (ongoing.what === "start move" || ongoing.what === "moving") {
            this.drawCircle(capPreview.x, capPreview.y, ongoing.who.radio, '#0000FF');
        }

        // ball
        this.drawCircle(ball.x, ball.y, ball.radio, '#F0F0F0');

        // Ball preview
        if (ongoing.what === "start pass" || ongoing.what === "passing") {
            ctx.beginPath();
            this.drawCircle(ballPreview.x, ballPreview.y, ball.radio, '#FFFFFF');
        }

    } // redraw

}; // canvas
