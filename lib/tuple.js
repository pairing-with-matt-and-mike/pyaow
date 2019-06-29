function tuple(x, y, z, w) {
    return new Tuple(x, y, z, w);
}

class Tuple {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    get red() {
        return this.x;
    }

    get green() {
        return this.y;
    }

    get blue() {
        return this.z;
    }

    equals(other, delta = 0) {
        return Math.abs(this.x - other.x) <= delta &&
            Math.abs(this.y - other.y) <= delta &&
            Math.abs(this.z - other.z) <= delta &&
            this.w === other.w;
    }

    toString() {
        return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
    }
}

function point(x, y, z) {
    return tuple(x, y, z, 1);
}

function vector(x, y, z) {
    return tuple(x, y, z, 0);
}

function color(r, g, b) {
    return new Tuple(r, g, b, 0);
}

function add(a, b) {
    return tuple(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
}

const zero = tuple(0, 0, 0, 0);

function neg(a) {
    return sub(zero, a);
}

function sub(a, b) {
    return tuple(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
}

function mul(t, s) {
    return tuple(s * t.x, s * t.y, s * t.z, s * t.w);
}

function div(t, s) {
    return mul(t, 1/s);
}

function magnitude(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z + v.w * v.w);
}

function normalise(t) {
    const m = magnitude(t);
    return tuple(t.x / m, t.y / m, t.z / m, t.w / m);
}

function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
}

function cross(a, b) {
    return vector(a.y * b.z - a.z * b.y,
                  a.z * b.x - a.x * b.z,
                  a.x * b.y - a.y * b.x);
}

function hadamardProduct(a, b) {
    return color(a.red * b.red, a.green * b.green, a.blue * b.blue);
}

const EPSILON = 0.000001;

function equals(a, b) {
    return a.equals(b, EPSILON);
}

module.exports = {
    add,
    color,
    cross,
    div,
    dot,
    equals,
    hadamardProduct,
    magnitude,
    mul,
    neg,
    normalise,
    point,
    sub,
    tuple,
    vector,
}
