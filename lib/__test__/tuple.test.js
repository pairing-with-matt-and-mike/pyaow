const {add, color, cross, div, dot, equals, hadamardProduct, magnitude, mul, neg, normalise, point, reflect, sub, tuple, vector} = require('../tuple');

test('should create a point', () => {
    const a = tuple(4.3, -4.2, 3.1, 1);
    expect(a.x).toBe(4.3);
    expect(a.y).toBe(-4.2);
    expect(a.z).toBe(3.1);
    expect(a.w).toBe(1);
});

test('should create a vector', () => {
    const a = tuple(4.3, -4.2, 3.1, 0);
    expect(a.x).toBe(4.3);
    expect(a.y).toBe(-4.2);
    expect(a.z).toBe(3.1);
    expect(a.w).toBe(0);
});


test('should create a point2', () => {
    const a = point(4.3, -4.2, 3.1);
    expect(a).toEqual(tuple(4.3, -4.2, 3.1, 1));
});

test('should create a vector2', () => {
    const a = vector(4.3, -4.2, 3.1);
    expect(a).toEqual(tuple(4.3, -4.2, 3.1, 0));
});

test('adding vector to point', () => {
    const p = point(3, -2, 5);
    const v = vector(-2, 3, 1);
    expect(add(p, v)).toEqual(tuple(1, 1, 6, 1));
});

test('subtracting two points', () => {
    const p1 = point(3, 2, 1);
    const p2 = point(5, 6, 7);
    expect(sub(p1, p2)).toEqual(vector(-2, -4, -6));
});

test('subtracting vector from point', () => {
    const p = point(3, 2, 1);
    const v = vector(5, 6, 7);
    expect(sub(p, v)).toEqual(point(-2, -4, -6));
});

test('subtracting vector from vector', () => {
    const v1 = vector(3, 2, 1);
    const v2 = vector(5, 6, 7);
    expect(sub(v1, v2)).toEqual(vector(-2, -4, -6));
});

test('subtracting vector from the zero vector', () => {
    const v1 = vector(0, 0, 0);
    const v2 = vector(1, -2, 3);
    expect(sub(v1, v2)).toEqual(vector(-1, 2, -3));
});

test('negating a tuple', () => {
    const a = tuple(1, -2, 3, -4);
    expect(neg(a)).toEqual(tuple(-1, 2, -3, 4));
});

test('multiplying a tuple by a scalar', () => {
    const a = tuple(1, -2, 3, -4);
    expect(mul(a, 3.5)).toEqual(tuple(3.5, -7, 10.5, -14));
});

test('dividing a tuple by a scalar', () => {
    const a = tuple(1, -2, 3, -4);
    expect(div(a, 2)).toEqual(tuple(0.5, -1, 1.5, -2));
});

[
    {v: vector(1, 0, 0), m: 1},
    {v: vector(0, 1, 0), m: 1},
    {v: vector(0, 0, 1), m: 1},
    {v: vector(1, 2, 3), m: Math.sqrt(14)},
    {v: vector(-1, -2, -3), m: Math.sqrt(14)}
].forEach(({v, m}) => test(`magnitude of vector ${v} is ${m}`, () => {
    expect(magnitude(v)).toBe(m);
}));

[
    {v: vector(1, 2, 3), n: vector(1/Math.sqrt(14), 2/Math.sqrt(14), 3/Math.sqrt(14))},
    {v: vector(4, 0, 0), n: vector(1, 0, 0)},
].forEach(({v, n}) => test(`vector ${v} normalised is ${n}`, () => {
    expect(normalise(v)).toEqual(n);
}));

test('magnitude of a normalised vector is 1', () => {
    expect(magnitude(normalise(vector(1, 2, 3)))).toBe(1);
});

test('the dot product of two tuples', () => {
    const a = vector(1, 2, 3);
    const b = vector(2, 3, 4);
    expect(dot(a, b)).toBe(20);
});

test('cross product of two vectors', () => {
    const a = vector(1, 2, 3);
    const b = vector(2, 3, 4);
    expect(cross(a, b)).toEqual(vector(-1, 2, -1));
    expect(cross(b, a)).toEqual(vector(1, -2, 1));
});

test('rock', () => {
    function tick(world, p) {
        const position = add(p.velocity, p.position);
        const velocity = add(add(p.velocity, world.gravity), world.wind);
        return { position, velocity };
    }
    const world = {
        gravity: vector(0, -0.1, 0),
        wind: vector(-0.01, 0, 0),
    };
    let rock = {
        position: point(0, 1, 0),
        velocity: vector(1, 1, 0),
    };
    while (rock.position.y > 0) {
        rock = tick(world, rock);
        // console.log(rock);
    }
});

test('color constructor', () => {
    const c = color(-0.5, 0.4, 1.7);
    expect(c.red).toBe(-0.5);
    expect(c.green).toBe(0.4);
    expect(c.blue).toBe(1.7);
});

test('adding colors', () => {
    const c1 = color(0.9, 0.6, 0.75);
    const c2 = color(0.7, 0.1, 0.25);
    expect(add(c1, c2)).toEqual(color(1.6, 0.7, 1.0));
});

test('subtracting colors', () => {
    const c1 = color(0.9, 0.6, 0.75);
    const c2 = color(0.7, 0.1, 0.25);
    expect(sub(c1, c2)).toEqual(color(0.9 - 0.7, 0.6 - 0.1, 0.75 - 0.25));
});

test('multiplying a color by a scalar', () => {
    const c = color(0.2, 0.3, 0.4);
    expect(mul(c, 2)).toEqual(color(0.4, 0.6, 0.8));
});

test('multiplying colors', () => {
    const c1 = color(1, 0.2, 0.4);
    const c2 = color(0.9, 1, 0.1);
    const hp = hadamardProduct(c1, c2);
    expect(equals(hp, color(0.9, 0.2, 0.04))).toBe(true);
});

test('reflecting a vector approaching at 45°', () => {
    const v = vector(1, -1, 0);
    const n = vector(0, 1, 0);
    const r = reflect(v, n);
    expect(r).toEqual(vector(1, 1, 0));
});

test('reflecting a vector off a slanted surface', () => {
    const v = vector(0, -1, 0);
    const n = vector(Math.sqrt(2)/2, Math.sqrt(2)/2, 0);
    const r = reflect(v, n);
    expect(r.equals(vector(1, 0, 0), 0.00001)).toBe(true);
});
