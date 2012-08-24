// common properties for the real and the preview balls
function AbstractBall () {
    this.x = null;
    this.y = null;
    this.radio = 6;
}

// a ball for the game
function Ball (x, y) {
    this.x = x;
    this.y = y;
    this.poss = null; // {Cap} cap that possess the ball
    this.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
    }
    this.save = function () {
        app.save("Ball", this.x, this.y, this.poss ? this.poss.id : 0);
    }
    this.getStatus = function () {
        return {
            x: this.x,
            y: this.y,
            poss: this.poss ? this.poss.id : null
        }
    }
}
Ball.prototype = new AbstractBall();

// a ball use for preview purposes, such as pass preview
function PreviewBall () {}
PreviewBall.prototype = new AbstractBall();

if (typeof CLIENT_SIDE === 'undefined') {
    exports.Ball = Ball;
    exports.PreviewBall = PreviewBall;
}
