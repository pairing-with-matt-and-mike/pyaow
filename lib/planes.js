const { intersection } = require("./intersections");
const { Shape } = require("./shapes");
const { vector } = require("./tuple");

class Plane extends Shape {
  localNormalAt() {
    return vector(0, 1, 0);
  }

  localIntersect(ray) {
    if (Math.abs(ray.direction.y) < 0.0001) {
      return [];
    }
    const t = -ray.origin.y / ray.direction.y;
    return [intersection(t, this)];
  }
}

function plane() {
  return new Plane();
}

module.exports = {
  plane
};
