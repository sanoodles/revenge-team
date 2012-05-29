const CAP_RADIO = 12;

var cap = {
    x: FIELD_MARGIN_H + Math.random() * FIELD_WIDTH,
    y: FIELD_MARGIN_V + Math.random() * FIELD_HEIGHT,
    speed: 40, // on steroids just for debugging purposes
    talent: 5,
    pass: 15,
    moveRange: function () {
        return this.speed * 4;
    },
    passRange: function () {
        return this.pass * 20;
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

