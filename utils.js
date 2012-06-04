/**
 * @return Angle in radians. 0 = 2 * PI = 12 o'clock.
 */
function getAngle(center, p1) {
    var p0 = {x: center.x, y: center.y - Math.sqrt(Math.abs(p1.x - center.x) * Math.abs(p1.x - center.x)
    + Math.abs(p1.y - center.y) * Math.abs(p1.y - center.y))};
    return (2 * Math.atan2(p1.y - p0.y, p1.x - p0.x));
}

function getEuclideanDistance(x_0, y_0, x, y) {
    return Math.sqrt(Math.pow(x - x_0, 2) + Math.pow(y - y_0, 2));
}

function getPointAt(center, radius, angle) {
    // Please note that the angle is given in radians;
    // if given in degrees uncomment the line below
    // angle *= Math.PI / 180;
    return {
        x: center.x + Math.sin(Math.PI - angle) * radius,
        y: center.y + Math.cos(Math.PI - angle) * radius
    };
}
