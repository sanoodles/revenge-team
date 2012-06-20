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

    redraw: function () {
        "use strict";
        
        function drawTriangle(p1, p2, p3, fillStyle) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.fillStyle = fillStyle;
            ctx.fill();
        };

        function drawSector(x, y, radio, startAngle, endAngle, fillStyle) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, radio, startAngle - Math.PI / 2, endAngle - Math.PI / 2, false);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.fillStyle = fillStyle;
            ctx.fill();
        };

        function drawCircle(x, y, radio, fillStyle) {
            ctx.beginPath();
            ctx.arc(x, y, radio, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fillStyle = fillStyle;
            ctx.fill();
        };

        var i, // auxiliar iterator
            max, // auxiliar loop limit
            a, // angle pass preview vs cap
            aerr, // pass angle error
            p1, p2, p3; // auxiliar points of a triangle

        // field
        ctx.beginPath();
        ctx.rect(
            0,
            0,
            field.marginH + field.width + field.marginH,
            field.marginV + field.height + field.marginV
        );
        ctx.fillStyle = '#009000';
        ctx.fill();

        // cap move range radio
        if (ongoing.what === "start move" || ongoing.what === "moving") {
            drawCircle(
                ongoing.who.x,
                ongoing.who.y,
                ongoing.who.getMoveRange(), '#40C040'
            );
        }

        // pass preview
        if (ongoing.what === "start pass" || ongoing.what === "passing") {
            a = app.pass.getAngle();
            aerr = ongoing.who.getPassAngleError(); // angle error

            // Red cone. Actually a triangle wider than the field.
            p1 = {x: ongoing.who.x, y: ongoing.who.y};
            p2 = getPointAt(p1, field.width * 2, a - aerr);
            p3 = getPointAt(p1, field.width * 2, a + aerr);
            drawTriangle(p1, p2, p3, '#F06060');

            // Green cone. Actually a circle sector.
            drawSector(
                ongoing.who.x,
                ongoing.who.y,
                app.pass.getGreenZoneRadio(a, aerr),
                a - aerr,
                a + aerr,
                '#60F060'
            );

            // rival caps defense preview
            for (i = 0, max = caps.length; i < max; i++) {
                if (caps[i].team !== ongoing.who.team) {
                    drawCircle(
                        caps[i].x,
                        caps[i].y,
                        caps[i].getDefenseRange(),
                        this.capDefenseColors[caps[i].team]
                    );                    
                }
            }

        } // fi pass preview

        // caps
        for (i = 0, max = caps.length; i < max; i++) {
            drawCircle(
                caps[i].x,
                caps[i].y,
                caps[i].radio,
                this.capColors[caps[i].team]
            );
        }

        // cap move preview
        if (ongoing.what === "start move" || ongoing.what === "moving") {
            drawCircle(
                capPreview.x,
                capPreview.y,
                ongoing.who.radio,
                this.capPreviewColors[ongoing.who.team]
            );
        }

        // ball
        drawCircle(ball.x, ball.y, ball.radio, '#F0F0F0');

        // Ball preview
        if (ongoing.what === "start pass" || ongoing.what === "passing") {
            drawCircle(
                ballPreview.x,
                ballPreview.y,
                ball.radio,
                '#FFFFFF'
            );
        }

    } // redraw
    
};

canvas.capColors = [];
canvas.capColors[Team.LOCAL] = '#0000A0';
canvas.capColors[Team.VISITOR] = '#A00000';

canvas.capPreviewColors = [];
canvas.capPreviewColors[Team.LOCAL] = '#0000F0';
canvas.capPreviewColors[Team.VISITOR] = '#F00000';

canvas.capDefenseColors = [];
canvas.capDefenseColors[Team.LOCAL] = '#A0A0FF';
canvas.capDefenseColors[Team.VISITOR] = '#FFA0A0';
