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

        function getMinRivalInPassConeDist(a, aerr) {
            var i, max, aRival, aPrev, aPost, rivalDist, minRivalDist,
                pi = Math.PI, twoPi = Math.PI * 2;
            
            /* Detect rival caps inside the pass cone
             * In particular, it detects whether the center of a rival cap
             * is inside the pass cone; not whether there is a rival cap
             * touching the pass cone.
             */
            aPrev = a - aerr;
            aPost = a + aerr;
            minRivalDist = field.width * 2; // initialize to "infinite"
            for (i = 0, max = caps.length; i < max; i++) {
                if (caps[i].team != ongoing.who.team) {

                    aRival = getAngle(ongoing.who, caps[i]);

                    // Reformat aRival if aPrev or aPost are beyond the 0..2Pi interval
                    if (aPrev < 0 && aRival > pi) {
                        aRival = aRival - twoPi;
                    } else if (aPost > twoPi && aRival < pi) {
                        aRival = aRival + twoPi;
                    }

                    // if rival cap caps[i] is inside the pass cone
                    if (aRival>= aPrev && aRival <= aPost) {
                        rivalDist = getEuclideanDistance(
                            ongoing.who.x, ongoing.who.y, caps[i].x, caps[i].y
                        );
                        if (rivalDist < minRivalDist) {
                            minRivalDist = rivalDist;
                        }
                    } // fi rival inside pass cone
                } // fi not same cap
            } // ffor

            return minRivalDist;
        }

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
            drawTriangle(p1, p2, p3, '#F06060');


            // Green cone. Actually a circle sector.
            drawSector(
                ongoing.who.x,
                ongoing.who.y,
                Math.min(
                    getMinRivalInPassConeDist(a, aerr),
                    ongoing.who.getPassRange()
                ),
                a - aerr,
                a + aerr,
                '#60F060'
            );
            
        }

        // caps
        for (i = 0, max = caps.length; i < max; i++) {
            ctx.beginPath();
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
            ctx.beginPath();
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
