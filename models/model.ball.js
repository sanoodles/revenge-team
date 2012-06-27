function AbstractBall() {
    this.x = null;
    this.y = null;
    this.radio = 6;
}
 
function Ball(x, y) {
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
}
Ball.prototype = new AbstractBall();

function PreviewBall() {}
PreviewBall.prototype = new AbstractBall();
