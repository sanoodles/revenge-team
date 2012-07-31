/**
 * Acts as output channel
 *
 * Reads
 *  Vars from the graphic controller (as view configuration)
 *  Vars from the model (as state)
 *
 * @see http://en.wikipedia.org/wiki/Circle#Terminology
 */

var canvas = {

    el: null,

    init: function () {
        this.el = $("#canvas")[0];
        ctx = this.el.getContext('2d');
        $(this.el).attr({
            width: field.marginH + field.width + field.marginH,
            height: field.marginV + field.height + field.marginV
        });
    },

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

        // draws the white lines in the football field
        // very long function but it's just drawing circles / lines
        // in the canvas
        function drawWhiteLines() {
            // white outer line
            ctx.beginPath();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(field.marginH, field.marginV, field.width, field.height);
            ctx.stroke();

            // half line
            ctx.beginPath();
            ctx.moveTo(field.marginH+field.width/2, field.marginV);
            ctx.lineTo(field.marginH+field.width/2, field.marginV+field.height);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();

            // areas
            ctx.beginPath();
            ctx.strokeRect(
                field.marginH, 
                field.marginV+(field.height-field.areaHeight)/2, 
                field.areaWidth, field.areaHeight
            );
            ctx.strokeRect(
                field.marginH+field.width, 
                field.marginV+(field.height-field.areaHeight)/2, 
                -field.areaWidth, field.areaHeight
            );
            ctx.lineWidth = 2;
            ctx.stroke();

            // small areas
            ctx.beginPath();
            ctx.strokeRect(
                field.marginH, 
                field.marginV+(field.height-field.areaHeight)/2+(field.areaHeight-field.smallAreaHeight)/2, 
                field.smallAreaWidth, field.smallAreaHeight
            );
            ctx.strokeRect(
                field.marginH+field.width, 
                field.marginV+(field.height-field.areaHeight)/2+(field.areaHeight-field.smallAreaHeight)/2, 
                -field.smallAreaWidth, field.smallAreaHeight
            );
            ctx.lineWidth = 2;
            ctx.stroke();

            // central circle and central dot
            ctx.beginPath();
            ctx.arc(
                field.marginH+field.width/2, field.marginV+field.height/2,
                field.centralCircleRadius, 0, Math.PI*360/180, false
            );
            ctx.lineWidth = 2;
            ctx.stroke();

            // central dot
            ctx.beginPath();
            ctx.arc(
                field.marginH+field.width/2, field.marginV+field.height/2,
                2, 0, rads(360), false
            );
            ctx.lineWidth = 2;
            ctx.stroke();

            // penalty dots
            ctx.beginPath();
            ctx.arc(
                field.marginH+field.penaltyDistance,field.marginV+field.height/2,
                1, 0, rads(360), false
            );
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(
                field.marginH+field.width-field.penaltyDistance,field.marginV+field.height/2,
                1, 0, rads(360), false
            );
            ctx.lineWidth = 2;
            ctx.stroke();

            // penalty safe zones
            ctx.beginPath();
            ctx.arc(
                field.marginH+field.penaltyDistance,field.marginV+field.height/2,
                91, rads(-56), rads(56), false
            );
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(
                field.marginH+field.width-field.penaltyDistance,field.marginV+field.height/2,
                91, rads(124), rads(236), false
            );
            ctx.lineWidth = 2;
            ctx.stroke();

            // corner kicks
            ctx.beginPath();
            ctx.arc(
                field.marginH, field.marginV,
                10, rads(0), rads(90)
            );
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(
                field.marginH+field.width, field.marginV,
                10, rads(90), rads(180)
            );
            ctx.lineWidth = 2;
            ctx.stroke();
             ctx.beginPath();
            ctx.arc(
                field.marginH+field.width, field.marginV+field.height,
                10, rads(180), rads(270)
            );
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(
                field.marginH, field.marginV+field.height,
                10, rads(270), rads(365)
            );
            ctx.lineWidth = 2;
            ctx.stroke();
        };

        // converts from degrees to radians
        function rads(x) { return Math.PI*x/180; };

        var i, // iterator (auxiliar)
            max, // loop limit (auxiliar)
            a, // angle pass preview vs cap
            aerr, // pass angle error
            p1, p2, p3; // points of a triangle (auxiliar)

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
        if (gc.ongoing.what === "start move" || gc.ongoing.what === "moving") {
            drawCircle(
                gc.ongoing.who.x,
                gc.ongoing.who.y,
                gc.ongoing.who.getMoveRange(), '#40C040'
            );
        }

        // dribble area preview
        if (gc.ongoing.what === "start dribbling" || gc.ongoing.what === "dribbling") {
            drawCircle(
                gc.ongoing.who.x,
                gc.ongoing.who.y,
                gc.ongoing.who.getControlRange(), this.capDefenseColors[gc.ongoing.who.team]
            );
        }

        // tackle area preview
        if (gc.ongoing.what === "start tackle" || gc.ongoing.what === "tackling") {
            drawCircle(
                gc.ongoing.who.x,
                gc.ongoing.who.y,
                gc.ongoing.who.getDefenseRange(), this.capDefenseColors[gc.ongoing.who.team]
            );
        }

        // pass preview
        if (gc.ongoing.what === "start pass" || gc.ongoing.what === "passing") {
            a = app.pass.getAngle(gc.ballPreview.x, gc.ballPreview.y);
            aerr = gc.ongoing.who.getPassAngleError(); // angle error

            // Red cone. Actually a triangle wider than the field.
            p1 = {x: gc.ongoing.who.x, y: gc.ongoing.who.y};
            p2 = utils.getPointAt(p1, field.width * 2, a - aerr);
            p3 = utils.getPointAt(p1, field.width * 2, a + aerr);
            drawTriangle(p1, p2, p3, '#F06060');

            // Green cone. Actually a circle sector.
            drawSector(
                gc.ongoing.who.x,
                gc.ongoing.who.y,
                app.pass.getGreenZoneRadio(a, aerr),
                a - aerr,
                a + aerr,
                '#60F060'
            );

            // caps defense and control preview
            for (i = 0, max = app.caps.length; i < max; i++) {

                // rival cap defense preview
                if (app.caps[i].team !== app.ball.poss.team && app.caps[i].stun === -1) {
                    drawCircle(
                        app.caps[i].x,
                        app.caps[i].y,
                        app.caps[i].getDefenseRange(),
                        this.capDefenseColors[app.caps[i].team]
                    );
                } 

                // own caps control preview
                if (app.caps[i].team === app.ball.poss.team) {
                    if ( !app.caps[i].hasBall() ) {
                        drawCircle(
                            app.caps[i].x,
                            app.caps[i].y,
                            app.caps[i].getControlRange(),
                            this.capDefenseColors[app.caps[i].team]
                        );
                    }
                }
            }

        } // fi pass preview

        // draw the white lines around the football field
        drawWhiteLines();

        // caps
        for (i = 0, max = app.caps.length; i < max; i++) {
            if (app.caps[i].stun === -1) {
                drawCircle(
                    app.caps[i].x,
                    app.caps[i].y,
                    app.caps[i].radio,
                    this.capColors[app.caps[i].team]
                );
            } else {
                drawCircle(
                    app.caps[i].x,
                    app.caps[i].y,
                    app.caps[i].radio,
                    '#777777'
                );
            }
        }

        // cap move preview
        if (gc.ongoing.what === "start move" || gc.ongoing.what === "moving") {
            drawCircle(
                gc.capPreview.x,
                gc.capPreview.y,
                gc.ongoing.who.radio,
                this.capPreviewColors[gc.ongoing.who.team]
            );
        }

        // cap dribbling target preview
        if (gc.ongoing.what === "dribbling" || gc.ongoing.what === "start dribbling") {
            drawCircle( // point where to dribble
                gc.dribblePreview.x,
                gc.dribblePreview.y,
                5,
                '#000000'
            );
            ctx.beginPath();
            ctx.moveTo(gc.ongoing.who.x, gc.ongoing.who.y);
            ctx.lineTo(gc.dribblePreview.x, gc.dribblePreview.y);
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // cap tackling target preview
        if (gc.ongoing.what === "tackling" || gc.ongoing.what === "start tackle") {
            drawCircle( // point where to dribble
                gc.tacklePreview.x,
                gc.tacklePreview.y,
                5,
                '#000000'
            );
            ctx.beginPath();
            ctx.moveTo(gc.ongoing.who.x, gc.ongoing.who.y);
            ctx.lineTo(gc.tacklePreview.x, gc.tacklePreview.y);
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // ball
        drawCircle(app.ball.x, app.ball.y, app.ball.radio, '#F0F0F0');

        // Ball preview
        if (gc.ongoing.what === "start pass" || gc.ongoing.what === "passing") {
            drawCircle(
                gc.ballPreview.x,
                gc.ballPreview.y,
                app.ball.radio,
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

canvas.stunnedColor = '#777777'

var ctx;
