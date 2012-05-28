var canvas = {
    
    redraw: function () {
        
        // field
        ctx.beginPath();
        ctx.rect(0, 0,
                FIELD_MARGIN_H + FIELD_WIDTH + FIELD_MARGIN_H,
                FIELD_MARGIN_V + FIELD_HEIGHT + FIELD_MARGIN_V);
        ctx.fillStyle = '#009000';
        ctx.fill();

        // range radio
        if (ongoing === "start move" || ongoing === "moving") {
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
        if (ongoing === "start move" || ongoing === "moving") {
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

        // ball preview
        if (ongoing === "start pass" || ongoing === "passing") {

            // pass cone
            ctx.beginPath();
            var a = angle(
                        {x: cap.x, y: cap.y},
                        {x: ballPreview.x, y: ballPreview.y}
            );
            var aerr = 0.1 * 20 / cap.talent; // angle error
            var p1 = {x: cap.x, y: cap.y};
            var p2 = getPointAt(p1, FIELD_WIDTH * 2, a - aerr);
            var p3 = getPointAt(p1, FIELD_WIDTH * 2, a + aerr);
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            ctx.fillStyle = '#00F000';
            ctx.fill();

            // ghost ball
            ctx.beginPath();
            ctx.arc(ballPreview.x, ballPreview.y, BALL_RADIO, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();

        }

    }
}
