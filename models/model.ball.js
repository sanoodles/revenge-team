const BALL_RADIO = 6;

var ball = {
    x: FIELD_MARGIN_H + Math.random() * FIELD_WIDTH,
    y: FIELD_MARGIN_V + Math.random() * FIELD_HEIGHT,
    poss: null, // {Cap} cap that possess the ball
    setPosition: function (x, y) {
        this.x = x;
        this.y = y;
    }
}

var ballPreview = {
    x: null,
    y: null
}
