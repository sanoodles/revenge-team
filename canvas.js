function redraw () {
    
    // field
    ctx.beginPath();
    ctx.rect(0, 0,
            FIELD_MARGIN_H + FIELD_WIDTH + FIELD_MARGIN_H,
            FIELD_MARGIN_V + FIELD_HEIGHT + FIELD_MARGIN_V);
    ctx.fillStyle = '#009000';
    ctx.fill();

    // range radio
    if (ongoing == "start move" || ongoing == "moved") {
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
    if (ongoing == "start move" || ongoing == "moved") {
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

}

function getElementByCoords(relX, relY) {
    if (cap.x > relX - CAP_RADIO && cap.x < relX + CAP_RADIO) {
        if (cap.y > relY - CAP_RADIO && cap.y < relY + CAP_RADIO) {
            return cap;
        }
    }
    return null;
}
