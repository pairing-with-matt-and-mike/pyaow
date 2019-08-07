const { ray } = require("../rays");
const { point, vector } = require("../tuple");
const { scaling, translation } = require("../transformation");

test("creating and querying a ray", () => {
  const origin = point(1, 2, 3);
  const direction = vector(4, 5, 6);
  const r = ray(origin, direction);
  expect(r.origin).toEqual(origin);
  expect(r.direction).toEqual(direction);
});

test("computing a point from a distance", () => {
  const r = ray(point(2, 3, 4), vector(1, 0, 0));
  expect(r.position(0)).toEqual(point(2, 3, 4));
  expect(r.position(1)).toEqual(point(3, 3, 4));
  expect(r.position(-1)).toEqual(point(1, 3, 4));
  expect(r.position(2.5)).toEqual(point(4.5, 3, 4));
});

test("translating a ray", () => {
  const r = ray(point(1, 2, 3), vector(0, 1, 0));
  const m = translation(3, 4, 5);
  const r2 = r.transform(m);
  expect(r2.origin).toEqual(point(4, 6, 8));
  expect(r2.direction).toEqual(vector(0, 1, 0));
});

test("scaling a ray", () => {
  const r = ray(point(1, 2, 3), vector(0, 1, 0));
  const m = scaling(2, 3, 4);
  const r2 = r.transform(m);
  expect(r2.origin).toEqual(point(2, 6, 12));
  expect(r2.direction).toEqual(vector(0, 3, 0));
});
