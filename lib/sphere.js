const { intersection, intersections } = require("./intersections");
const { identity } = require("./matrix");
const { add, dot, mul, normalise, point, sub } = require("./tuple");
const { material } = require("./material");
const { Shape } = require("./shapes");

class Sphere extends Shape {
  constructor() {
    super();
    this.origin = point(0, 0, 0);
  }

  localIntersect(ray) {
    const sphere_to_ray = sub(ray.origin, this.origin);
    const a = dot(ray.direction, ray.direction);
    const b = 2 * dot(ray.direction, sphere_to_ray);
    const c = dot(sphere_to_ray, sphere_to_ray) - 1;
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
      return [];
    }

    const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const ts = t1 > t2 ? [t2, t1] : [t1, t2];
    return intersections(...ts.map(t => intersection(t, this)));
  }

  localNormalAt(op) {
    return normalise(sub(op, this.origin));
  }
}

function sphere() {
  return new Sphere();
}

module.exports = {
  sphere
};
