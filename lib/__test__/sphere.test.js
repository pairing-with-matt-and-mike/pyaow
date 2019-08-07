const fs = require("fs");

const { map } = require("lodash");

const { canvas } = require("../canvas");
const { hit } = require("../intersections");
const { identity } = require("../matrix");
const { ray } = require("../rays");
const { sphere } = require("../sphere");
const { scaling, translation } = require("../transformation");
const { color, normalise, point, sub, vector } = require("../tuple");

test("a ray intersects a sphere at two points", () => {
  const r = ray(point(0, 0, -5), vector(0, 0, 1));
  const s = sphere();
  const xs = map(s.intersect(r), "t");
  expect(xs).toEqual([4, 6]);
});

test("a ray intersects a sphere at a tangent", () => {
  const r = ray(point(0, 1, -5), vector(0, 0, 1));
  const s = sphere();
  const xs = map(s.intersect(r), "t");
  expect(xs).toEqual([5, 5]);
});

test("a ray misses a sphere", () => {
  const r = ray(point(0, 2, -5), vector(0, 0, 1));
  const s = sphere();
  const xs = s.intersect(r);
  expect(xs).toEqual([]);
});

test("a ray originates inside a sphere", () => {
  const r = ray(point(0, 0, 0), vector(0, 0, 1));
  const s = sphere();
  const xs = map(s.intersect(r), "t");
  expect(xs).toEqual([-1, 1]);
});

test("a sphere is behind a ray", () => {
  const r = ray(point(0, 0, 5), vector(0, 0, 1));
  const s = sphere();
  const xs = map(s.intersect(r), "t");
  expect(xs).toEqual([-6, -4]);
});

test("intersect sets the object on the intersection", () => {
  const r = ray(point(0, 0, -5), vector(0, 0, 1));
  const s = sphere();
  const xs = s.intersect(r);
  expect(xs.length).toEqual(2);
  expect(xs[0].object).toBe(s);
  expect(xs[1].object).toBe(s);
});

test("a sphere's default transformation", () => {
  const s = sphere();
  expect(s.transform).toEqual(identity(4));
});

test("intersecting a scaled sphere with a ray", () => {
  const r = ray(point(0, 0, -5), vector(0, 0, 1));
  const s = sphere();
  s.transform = scaling(2, 2, 2);
  const xs = map(s.intersect(r), "t");
  expect(xs).toEqual([3, 7]);
});

test("intersecting a translated sphere with a ray", () => {
  const r = ray(point(0, 0, -5), vector(0, 0, 1));
  const s = sphere();
  s.transform = translation(5, 0, 0);
  const xs = s.intersect(r);
  expect(xs).toEqual([]);
});

test.skip("drawing a sphere", () => {
  const width = 100;
  const c = canvas(width, width);
  const origin = point(50, 50, 50);

  const red = color(1, 0, 0);
  const green = color(0, 1, 0);
  const s1 = sphere();
  const s2 = sphere();
  s1.transform = translation(40, 50, 10).mul(scaling(20, 10, 20));
  s2.transform = translation(50, 40, 20).mul(scaling(10, 20, 20));

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < width; y++) {
      const r = ray(origin, sub(point(x, y, 0), origin));
      const is = [...s1.intersect(r), ...s2.intersect(r)];
      const h = hit(is);
      if (h) {
        c.setPixel(x, y, h.object === s1 ? red : green);
      }
    }
  }

  fs.writeFileSync("sphere.ppm", c.toPpm(), "utf-8");
});

test("the normal on a sphere at a point on the x axis", () => {
  const s = sphere();
  const n = s.normalAt(point(1, 0, 0));
  expect(n).toEqual(vector(1, 0, 0));
});

test("The normal on a sphere at a point on the y axis", () => {
  const s = sphere();
  const n = s.normalAt(point(0, 1, 0));
  expect(n).toEqual(vector(0, 1, 0));
});

test("the normal on a sphere at a point on the z axis", () => {
  const s = sphere();
  const n = s.normalAt(point(0, 0, 1));
  expect(n).toEqual(vector(0, 0, 1));
});

test("the normal on a sphere at a non-axial point", () => {
  const s = sphere();
  const n = s.normalAt(
    point(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3)
  );
  expect(n).toEqual(
    vector(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3)
  );
});

test("the normal is a normalized vector", () => {
  const s = sphere();
  const n = s.normalAt(
    point(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3)
  );
  expect(n).toEqual(normalise(n));
});

test("computing the normal on a translated sphere", () => {
  const s = sphere();
  s.transform = translation(0, 1, 0);
  const n = s.normalAt(point(0, 1.70711, -0.70711));
  expect(n.equals(vector(0, 0.70711, -0.70711), 0.00001)).toEqual(true);
});

test("computing the normal on a scaled sphere", () => {
  const s = sphere();
  s.transform = scaling(1, 0.5, 1);
  const n = s.normalAt(point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2));
  expect(n.equals(vector(0, 0.97014, -0.24254), 0.00001)).toEqual(true);
});
