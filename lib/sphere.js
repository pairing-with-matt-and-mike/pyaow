const { intersection, intersections } = require('./intersections');
const { identity } = require('./matrix');
const { add, dot, mul, normalise, point, sub } = require('./tuple');
const { material } = require('./material');

class Sphere {
    constructor() {
	      this.origin = point(0, 0, 0);
	      this.transform = identity(4);
        this.material = material();
    }

    intersect(ray) {
	      ray = ray.transform(this.transform.inverse());
	      const sphere_to_ray = sub(ray.origin, this.origin);
	      const a = dot(ray.direction, ray.direction);
	      const b = 2 * dot(ray.direction, sphere_to_ray);
	      const c = dot(sphere_to_ray, sphere_to_ray) - 1;
	      const discriminant = b*b-4*a*c;

	      if (discriminant < 0) {
	          return [];
	      }

	      const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
	      const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);
	      const ts = t1 > t2 ? [t2, t1] : [t1, t2];
	      return intersections(...ts.map(t => intersection(t, this)));
    }

    normalAt(wp) {
        const transform = this.transform.inverse();
        const op = transform.mul(wp);
        const on = normalise(sub(op, this.origin));
        const wn = transform.transpose().mul(on);
        wn.w = 0;
        return normalise(wn);
    }
}

function sphere() {
    return new Sphere();
}

module.exports = {
    sphere
};
