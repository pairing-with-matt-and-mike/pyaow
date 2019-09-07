const fs = require("fs");

const {
  π,
  rotationX,
  rotationY,
  scaling,
  translation,
  viewTransform
} = require("../transformation");
const { camera } = require("../camera");
const { canvas } = require("../canvas");
const { pointLight } = require("../light");
const { material } = require("../material");
const { identity } = require("../matrix");
const { sphere } = require("../sphere");
const { color, point, vector } = require("../tuple");
const { defaultWorld, world } = require("../world");

test("constructing a camera", () => {
  const hsize = 160;
  const vsize = 120;
  const fov = π / 2;
  const c = camera(hsize, vsize, fov);
  expect(c.hsize).toBe(160);
  expect(c.vsize).toBe(120);
  expect(c.fov).toBe(π / 2);
  expect(c.transform).toEqual(identity(4));
});

test("the pixel size for a horizontal canvas", () => {
  const c = camera(200, 125, π / 2);
  expect(c.pixelSize).toBeCloseTo(0.01, 6);
});

test("the pixel size for a vertical canvas", () => {
  const c = camera(125, 200, π / 2);
  expect(c.pixelSize).toBeCloseTo(0.01, 6);
});

test("construct a ray through the center of the canvas", () => {
  const c = camera(201, 101, π / 2);
  const r = c.rayForPixel(100, 50);
  expect(r.origin).toEqual(point(0, 0, 0));
  expect(r.direction.equals(vector(0, 0, -1), 0.000001)).toBe(true);
});

test("construct a ray through a corner of the canvas", () => {
  const c = camera(201, 101, π / 2);
  const r = c.rayForPixel(0, 0);
  expect(r.origin).toEqual(point(0, 0, 0));
  expect(r.direction.equals(vector(0.66519, 0.33259, -0.66851), 0.00001)).toBe(
    true
  );
});

test("construct a ray when the camera is transformed", () => {
  const c = camera(201, 101, π / 2);
  c.transform = rotationY(π / 4).mul(translation(0, -2, 5));
  const r = c.rayForPixel(100, 50);
  expect(r.origin).toEqual(point(0, 2, -5));
  expect(
    r.direction.equals(vector(Math.sqrt(2) / 2, 0, -Math.sqrt(2) / 2), 0.00001)
  ).toBe(true);
});

test("rendering a world with a camera", () => {
  const w = defaultWorld();
  const c = camera(11, 11, π / 2);
  const from = point(0, 0, -5);
  const to = point(0, 0, 0);
  const up = vector(0, 1, 0);
  c.transform = viewTransform(from, to, up);
  const image = c.render(w);
  expect(
    image.getPixel(5, 5).equals(color(0.38066, 0.47583, 0.2855), 0.00001)
  ).toBe(true);
});

test.skip("drawing balls", () => {
  const floor = sphere();
  floor.transform = scaling(10, 0.01, 10);
  floor.material = material();
  floor.material.color = color(1, 0.9, 0.9);
  floor.material.specular = 0;

  const leftWall = sphere();
  leftWall.transform = translation(0, 0, 5)
    .mul(rotationY(-π / 4))
    .mul(rotationX(π / 2))
    .mul(scaling(10, 0.01, 10));
  leftWall.material = floor.material;

  const rightWall = sphere();
  rightWall.transform = translation(0, 0, 5)
    .mul(rotationY(π / 4))
    .mul(rotationX(π / 2))
    .mul(scaling(10, 0.01, 10));
  rightWall.material = floor.material;

  const middle = sphere();
  middle.transform = translation(-0.5, 1, 0.5);
  middle.material = material();
  middle.material.color = color(0.1, 1, 0.5);
  middle.material.diffuse = 0.7;
  middle.material.specular = 0.3;

  const right = sphere();
  right.transform = translation(1.5, 0.5, -0.5).mul(scaling(0.5, 0.5, 0.5));
  right.material = material();
  right.material.color = color(0.5, 1, 0.1);
  right.material.diffuse = 0.7;
  right.material.specular = 0.3;

  const left = sphere();
  left.transform = translation(-1.5, 0.33, -0.75).mul(
    scaling(0.33, 0.33, 0.33)
  );
  left.material = material();
  left.material.color = color(1, 0.8, 0.1);
  left.material.diffuse = 0.7;
  left.material.specular = 0.3;

  const w = world();
  w.objects = [floor, leftWall, rightWall, middle, right, left];
  w.light = pointLight(point(-10, 10, -10), color(1, 1, 1));

  const c = camera(400, 200, π / 3);
  c.transform = viewTransform(
    point(0, 1.5, -5),
    point(0, 1, 0),
    vector(0, 1, 0)
  );

  const image = c.render(w);

  fs.writeFileSync("balls.ppm", image.toPpm(), "utf-8");
});
