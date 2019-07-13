const {minBy} = require("lodash");

function intersection(t, object) {
    return {t, object};
}

function intersections(...is) {
    return is;
}

function hit(xs) {
    return minBy(xs.filter(x => x.t >= 0), x => x.t);
}

module.exports = {
    hit,
    intersection,
    intersections
}
