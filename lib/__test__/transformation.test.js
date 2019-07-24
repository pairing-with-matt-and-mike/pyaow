const fs = require("fs");

const {canvas} = require("../canvas");
const {color, point, vector} = require('../tuple');
const {π, rotationX, rotationY, rotationZ, scaling, shearing, translation} = require('../transformation');

test('multiplying by a translation matrix', () => {
    const transform = translation(5, -3, 2);
    const p = point(-3, 4, 5);

    expect(transform.mul(p)).toEqual(point(2, 1, 7));
});

test('multiplying by the inverse of a translation matrix', () => {
    const transform = translation(5, -3, 2);
    const inv = transform.inverse();
    const p = point(-3, 4, 5);

    expect(inv.mul(p)).toEqual(point(-8, 7, 3));
});

test('translation does not affect vectors', () => {
    const transform = translation(5, -3, 2);
    const v = vector(-3, 4, 5);
    expect(transform.mul(v)).toEqual(v);
});

test('a scaling matrix applied to a point', () => {
    const transform = scaling(2, 3, 4);
    const p = point(-4, 6, 8);
    expect(transform.mul(p)).toEqual(point(-8, 18, 32));
});

test('a scaling matrix applied to a vector', () => {
    const transform = scaling(2, 3, 4);
    const v = vector(-4, 6, 8);
    expect(transform.mul(v)).toEqual(vector(-8, 18, 32));
});

test('multiplying by the inverse of a scaling matrix', () => {
    const transform = scaling(2, 3, 4);
    const inv = transform.inverse();
    const v = vector(-4, 6, 8);
    expect(inv.mul(v)).toEqual(vector(-2, 2, 2));
});

test('reflection is scaling by a negative value', () => {
    const transform = scaling(-1, 1, 1);
    const p = point(2, 3, 4);
    expect(transform.mul(p)).toEqual(point(-2, 3, 4));
});

test('rotating a point around the x axis', () => {
    const p = point(0, 1, 0);
    const halfQuarter = rotationX(Math.PI / 4);
    const fullQuarter = rotationX(Math.PI / 2);
    expect(halfQuarter.mul(p).equals(point(0, Math.sqrt(2) / 2, Math.sqrt(2) / 2), 0.00001)).toBe(true);
    expect(fullQuarter.mul(p).equals(point(0, 0, 1), 0.0001)).toBe(true);
});

test('the inverse of an x-rotation rotates in the opposite direction', () => {
    const v  = point(0, 1, 0);
    const halfQuarter = rotationX(π / 4);
    const inv = halfQuarter.inverse();
    expect(inv.mul(v).equals(point(0, Math.sqrt(2)/2, -Math.sqrt(2)/2), 0.00001)).toBe(true);
});

test('rotating a point around the y axis', () => {
    const p = point(0, 0, 1);
    const halfQuarter = rotationY(π / 4);
    const fullQuarter = rotationY(π / 2);
    expect(halfQuarter.mul(p).equals(point(Math.sqrt(2)/2, 0, Math.sqrt(2)/2), 0.00001)).toBe(true);
    expect(fullQuarter.mul(p).equals(point(1, 0, 0)));
});

test('rotating a point around the z axis', () => {
    const p = point(0, 1, 0);
    const halfQuarter = rotationZ(π / 4);
    const fullQuarter = rotationZ(π / 2);
    expect(halfQuarter.mul(p).equals(point(-Math.sqrt(2)/2, Math.sqrt(2)/2, 0), 0.00001)).toBe(true);
    expect(fullQuarter.mul(p).equals(point(-1, 0, 0), 0.00001)).toBe(true);
});

test('shearing transformation moves x in proportion to y', () => {
    const transform = shearing(1, 0, 0, 0, 0, 0);
    const p = point(2, 3, 4);
    expect(transform.mul(p)).toEqual(point(5, 3, 4));
});

test('shearing transformation moves x in proportion to z', () => {
    const transform = shearing(0, 1, 0, 0, 0, 0);
    const p = point(2, 3, 4);
    expect(transform.mul(p)).toEqual(point(6, 3, 4));
});

test('shearing transformation moves y in proportion to x', () => {
    const transform = shearing(0, 0, 1, 0, 0, 0);
    const p = point(2, 3, 4);
    expect(transform.mul(p)).toEqual(point(2, 5, 4));
});

test('shearing transformation moves y in proportion to z', () => {
    const transform = shearing(0, 0, 0, 1, 0, 0);
    const p = point(2, 3, 4);
    expect(transform.mul(p)).toEqual(point(2, 7, 4));
});

test('shearing transformation moves z in proportion to x', () => {
    const transform = shearing(0, 0, 0, 0, 1, 0);
    const p = point(2, 3, 4);
    expect(transform.mul(p)).toEqual(point(2, 3, 6));
});

test('shearing transformation moves z in proportion to y', () => {
    const transform = shearing(0, 0, 0, 0, 0, 1);
    const p = point(2, 3, 4);
    expect(transform.mul(p)).toEqual(point(2, 3, 7));
});

test('individual transformations are applied in sequence', () => {
    const p = point(1, 0, 1);
    const A = rotationX(π / 2);
    const B = scaling(5, 5, 5);
    const C = translation(10, 5, 7);
    const p2 = A.mul(p);
    expect(p2.equals(point(1, -1, 0), 0.00001)).toBe(true);
    const p3 = B.mul(p2);
    expect(p3.equals(point(5, -5, 0), 0.00001)).toBe(true);
    const p4 = C.mul(p3);
    expect(p4).toEqual(point(15, 0, 7));

    const T1 = C.mul(B.mul(A));
    expect(T1.mul(p)).toEqual(point(15, 0, 7));
});

test.skip('clock', () => {
    const width = 20;
    const c = canvas(width, width);
    const radius = 0.375 * width;
    const firstPoint = point(0, -radius, 0);
    const T = translation(width / 2, width / 2, 0);
    for (let i = 0; i < 12; i++) {
        const R = rotationZ(i * π/6);
        const {x, y} = T.mul(R).mul(firstPoint);
        c.setPixel(Math.round(x), Math.round(y), color(0, 1, 1));
    }
    fs.writeFileSync("clock.ppm", c.toPpm(), "utf-8");
});
