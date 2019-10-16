const { identity } = require("./matrix");
const { normalise } = require("./tuple");
const { material } = require("./material");

class Shape {
  constructor() {
    this.transform = identity(4);
    this.material = material();
  }

  intersect(ray) {
    ray = ray.transform(this.transform.inverse());
    return this.localIntersect(ray);
  }

  normalAt(wp) {
    const transform = this.transform.inverse();
    const op = transform.mul(wp);
    const on = this.localNormalAt(op);
    const wn = transform.transpose().mul(on);
    wn.w = 0;
    return normalise(wn);
  }
}

module.exports = {
  Shape
};
