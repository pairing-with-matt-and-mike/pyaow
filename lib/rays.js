const { add, mul } = require('./tuple');

class Ray {
    constructor (origin, direction) {
	this.origin = origin;
	this.direction = direction;
    }
    
    position(time) {
	return add(this.origin,
		   mul(this.direction, time));
    }

    transform(m) {
	return ray(
	    m.mul(this.origin),
	    m.mul(this.direction)
	);
    }
}

function ray(origin, direction) {
    return new Ray(origin, direction);
}

module.exports = {
    ray
};
