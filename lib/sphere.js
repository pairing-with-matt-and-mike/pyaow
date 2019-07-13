const { intersection, intersections } = require('./intersections');
const { identity } = require('./matrix');
const { add, dot, mul, point, sub } = require('./tuple');

class Sphere {
    constructor() {
	this.origin = point(0, 0, 0);
	this.transform = identity(4);
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
}

function sphere() {
    return new Sphere();
}

module.exports = {
    sphere
};
