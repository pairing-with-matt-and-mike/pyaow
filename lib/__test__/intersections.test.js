const {hit, intersection, intersections} = require('../intersections');
const {sphere} = require('../sphere');

test('an intersection encapsulates t and object', () => {
    const s = sphere();
    const i = intersection(3.5, s)
    expect(i.t).toEqual(3.5);
    expect(i.object).toEqual(s);
});

test('aggregating intersections', () => {
    const s = sphere();
    const i1 = intersection(1, s);
    const i2 = intersection(2, s);
    const xs = intersections(i1, i2);
    expect(xs.length).toEqual(2);
    expect(xs[0].t).toEqual(1);
    expect(xs[1].t).toEqual(2);
});

test('the hit, when all intersections have positive t', () => {
    const s = sphere();
    const i1 = intersection(1, s);
    const i2 = intersection(2, s);
    const xs = intersections(i2, i1);
    const h = hit(xs);
    expect(h).toEqual(i1);
});

test('the hit, when some intersections have negative t', () => {
    const s = sphere();
    const i1 = intersection(-1, s);
    const i2 = intersection(1, s);
    const xs = intersections(i2, i1);
    const h = hit(xs);
    expect(h).toEqual(i2);
});

test('the hit, when all intersections have negative t', () => {
    const s = sphere();
    const i1 = intersection(-2, s);
    const i2 = intersection(-1, s);
    const xs = intersections(i2, i1);
    const h = hit(xs);
    expect(h).toEqual(undefined);
});

test('the hit is always the lowest non-negative intersection', () => {
    const s = sphere();
    const i1 = intersection(5, s);
    const i2 = intersection(7, s);
    const i3 = intersection(-3, s);
    const i4 = intersection(2, s);
    const xs = intersections(i1, i2, i3, i4);
    const h = hit(xs);
    expect(h).toEqual(i4);
});

