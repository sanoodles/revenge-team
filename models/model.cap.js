const CAP_RADIO = 12;

function GenericCap () {
    this.getMoveRange = function () {
        return this.speed * 4;
    };
    this.getPassRange = function () {
        return this.pass * 20;
    };
    this.isCapOverTheBall = function () {
        return getEuclideanDistance(this.x, this.y, ball.x, ball.y) <= CAP_RADIO;
    };
    this.hasBall = function () {
        return ball.poss === this;
    };
    this.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
        if (this.hasBall()) {
            ball.setPosition(x, y);
        }
    };
}

function Cap (id) {
    this.id = id;
    this.x = FIELD_MARGIN_H + Math.random() * FIELD_WIDTH;
    this.y = FIELD_MARGIN_V + Math.random() * FIELD_HEIGHT;
    this.speed = 40; // on steroids just for debugging purposes
    this.talent = 5;
    this.pass = 15;
}
Cap.prototype = new GenericCap();

var capPreview = {
    x: 0,
    y: 0
};
