const CAP_RADIO = 12;

var cap = {
    x: FIELD_MARGIN_H + Math.random() * FIELD_WIDTH,
    y: FIELD_MARGIN_V + Math.random() * FIELD_HEIGHT,
    speed: 20,
    maxRange: function () {
        return this.speed * 4;
    }
};

var capPreview = {
    x: cap.x,
    y: cap.y
};

function isCapOverTheBall(cap) {
    return euclideanDistance(cap.x, cap.y, ball.x, ball.y) <= CAP_RADIO;
}

function setPossession(cap) {
    ball.poss = cap;
}
