
function GenericCap() {
    this.radio = 12,
    this.getMoveRange = function () {
        return this.speed * 4;
    };
    this.getPassRange = function () {
        return this.pass * 20;
    };
    this.isCapOverTheBall = function () {
        return getEuclideanDistance(this.x, this.y, ball.x, ball.y) <= this.radio;
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
GenericCap.TEAM_LOCAL = 0;
GenericCap.TEAM_VISITOR = 1;

function Cap(id, team) {
    this.id = id;
    this.x = field.marginH + Math.random() * field.width;
    this.y = field.marginV + Math.random() * field.height;
    this.speed = 40; // on steroids just for debugging purposes
    this.talent = 5;
    this.pass = 15;
    this.team = 0;
}
Cap.prototype = new GenericCap();

var capPreview = {
    x: 0,
    y: 0
};
