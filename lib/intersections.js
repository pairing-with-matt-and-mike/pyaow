const { minBy } = require("lodash");

const { add, dot, mul, neg, point, vector } = require("./tuple");

function intersection(t, object) {
  return new Intersection(t, object);
}

function intersections(...is) {
  return is;
}

function hit(xs = []) {
  return minBy(xs.filter(x => x.t >= 0), x => x.t);
}

class Intersection {
  constructor(t, object) {
    this.t = t;
    this.object = object;
  }

  prepare(ray) {
    const i = new Intersection(this.t, this.object);
    i.point = ray.position(this.t);
    i.eyev = neg(ray.direction);
    i.normalv = this.object.normalAt(i.point);

    if (dot(i.eyev, i.normalv) < 0) {
      i.inside = true;
      i.normalv = neg(i.normalv);
    } else {
      i.inside = false;
    }

    i.point = add(i.point, mul(i.normalv, 0.0001));

    return i;
  }
}

module.exports = {
  hit,
  intersection,
  intersections
};
