const CAP_RADIO = 12;

var cap = {
    x: FIELD_MARGIN_H + Math.random() * FIELD_WIDTH,
    y: FIELD_MARGIN_V + Math.random() * FIELD_HEIGHT,
    speed: 40,
    maxRange: function () {
        return this.speed * 4;
    },
    setPossession: function () {
        ball.poss = this;
    },
    isCapOverTheBall: function () {
        return euclideanDistance(this.x, this.y, ball.x, ball.y) <= CAP_RADIO;
    }    
};

var capPreview = {
    x: cap.x,
    y: cap.y
};

