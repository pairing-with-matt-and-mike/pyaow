const { map } = require("lodash");

const { pointLight } = require("../light");
const { ray } = require("../rays");
const { sphere } = require("../sphere");
const { scaling } = require("../transformation");
const { color, point, vector } = require("../tuple");
const { defaultWorld, world } = require("../world");
const { intersection } = require("../intersections");

test("creating a world", () => {
  const w = world();
  expect(w.objects).toEqual([]);
  expect(w.light).toBeUndefined();
});

test("the default world", () => {
  const light = pointLight(point(-10, 10, -10), color(1, 1, 1));
  const s1 = sphere();
  s1.material.color = color(0.8, 1.0, 0.6);
  s1.material.diffuse = 0.7;
  s1.material.specular = 0.2;
  const s2 = sphere();
  s2.transform = scaling(0.5, 0.5, 0.5);
  const world = defaultWorld();
  expect(world.light).toEqual(light);
  expect(world.objects).toContainEqual(s1);
  expect(world.objects).toContainEqual(s2);
});

test("intersect a world with a ray", () => {
  const world = defaultWorld();
  const r = ray(point(0, 0, -5), vector(0, 0, 1));
  const xs = world.intersect(r);
  expect(map(xs, "t")).toEqual([4, 4.5, 5.5, 6]);
});

test("precomputing the state of an intersection", () => {
  const r = ray(point(0, 0, -5), vector(0, 0, 1));
  const s = sphere();
  const h = intersection(4, s).prepare(r);
  expect(h.point).toEqual(point(0, 0, -1));
  expect(h.eyev).toEqual(vector(0, 0, -1));
  expect(h.normalv).toEqual(vector(0, 0, -1));
});

test("an intersection occurs on the outside", () => {
  const r = ray(point(0, 0, -5), vector(0, 0, 1));
  const s = sphere();
  const h = intersection(4, s).prepare(r);
  expect(h.inside).toBe(false);
});

test("an intersection occurs on the inside", () => {
  const r = ray(point(0, 0, 0), vector(0, 0, 1));
  const s = sphere();
  const h = intersection(1, s).prepare(r);
  expect(h.point).toEqual(point(0, 0, 1));
  expect(h.eyev).toEqual(vector(0, 0, -1));
  expect(h.inside).toBe(true);
  expect(h.normalv).toEqual(vector(0, 0, -1));
});

test("shading an intersection", () => {
  const world = defaultWorld();
  const r = ray(point(0, 0, -5), vector(0, 0, 1));
  const shape = world.objects[0];
  const hit = intersection(4, shape).prepare(r);
  const c = world.shadeHit(hit);
  expect(c.equals(color(0.38066, 0.47583, 0.2855), 0.00001)).toBe(true);
});

test("shading an intersection from the inside", () => {
  const world = defaultWorld();
  world.light = pointLight(point(0, 0.25, 0), color(1, 1, 1));
  const r = ray(point(0, 0, 0), vector(0, 0, 1));
  const shape = world.objects[1];
  const hit = intersection(0.5, shape).prepare(r);
  const c = world.shadeHit(hit);
  expect(c.equals(color(0.90498, 0.90498, 0.90498), 0.00001)).toBe(true);
});

test("the color when a ray misses", () => {
  const world = defaultWorld();
  const r = ray(point(0, 0, -5), vector(0, 1, 0));
  const c = world.colorAt(r);
  expect(c).toEqual(color(0, 0, 0));
});

test("the color when a ray hits", () => {
  const world = defaultWorld();
  const r = ray(point(0, 0, -5), vector(0, 0, 1));
  const c = world.colorAt(r);
  expect(c.equals(color(0.38066, 0.47583, 0.2855), 0.00001)).toBe(true);
});

test("the color with an intersection behind the ray", () => {
  const world = defaultWorld();
  const outer = world.objects[0];
  outer.material.ambient = 1;
  outer.material.diffuse = 0;
  const inner = world.objects[1];
  inner.material.ambient = 1;
  inner.material.diffuse = 0;
  const r = ray(point(0, 0, -0.75), vector(0, 0, 1));
  const c = world.colorAt(r);
  expect(c).toEqual(inner.material.color);
});
