const fs = require("fs");

const { camera } = require("../camera");
const { pointLight } = require("../light");
const { identity } = require("../matrix");
const {
  Pattern,
  checkersPattern,
  gradientPattern,
  ringPattern,
  stripePattern
} = require("../patterns");
const { sphere } = require("../sphere");
const { π, scaling, translation, viewTransform } = require("../transformation");
const { color, point, vector, BLACK, WHITE } = require("../tuple");
const { world } = require("../world");

test("creating a stripe pattern", () => {
  const pattern = stripePattern(WHITE, BLACK);
  expect(pattern.a).toEqual(WHITE);
  expect(pattern.b).toEqual(BLACK);
});

test("A stripe pattern is constant in y", () => {
  const pattern = stripePattern(WHITE, BLACK);
  expect(pattern.colorAt(point(0, 0, 0))).toEqual(WHITE);
  expect(pattern.colorAt(point(0, 1, 0))).toEqual(WHITE);
  expect(pattern.colorAt(point(0, 2, 0))).toEqual(WHITE);
});

test("A stripe pattern is constant in z", () => {
  const pattern = stripePattern(WHITE, BLACK);
  expect(pattern.colorAt(point(0, 0, 0))).toEqual(WHITE);
  expect(pattern.colorAt(point(0, 0, 1))).toEqual(WHITE);
  expect(pattern.colorAt(point(0, 0, 2))).toEqual(WHITE);
});

test("A stripe pattern alternates in x", () => {
  const pattern = stripePattern(WHITE, BLACK);
  expect(pattern.colorAt(point(0, 0, 0))).toEqual(WHITE);
  expect(pattern.colorAt(point(0.9, 0, 0))).toEqual(WHITE);
  expect(pattern.colorAt(point(1, 0, 0))).toEqual(BLACK);
  expect(pattern.colorAt(point(-0.1, 0, 0))).toEqual(BLACK);
  expect(pattern.colorAt(point(-1, 0, 0))).toEqual(BLACK);
  expect(pattern.colorAt(point(-1.1, 0, 0))).toEqual(WHITE);
});

test("stripes with an object transformation", () => {
  const object = sphere();
  object.transform = scaling(2, 2, 2);
  const pattern = stripePattern(BLACK, WHITE);
  const c = pattern.colorAtObject(object, point(1.5, 0, 0));
  expect(c).toEqual(BLACK);
});

test("stripes with a pattern transformation", () => {
  const object = sphere();
  const pattern = stripePattern(BLACK, WHITE);
  pattern.transform = scaling(2, 2, 2);
  const c = pattern.colorAtObject(object, point(1.5, 0, 0));
  expect(c).toEqual(BLACK);
});

test("stripes with both an object and a pattern transformation", () => {
  const object = sphere();
  object.transform = scaling(2, 2, 2);
  const pattern = stripePattern(BLACK, WHITE);
  pattern.transform = translation(0.5, 0, 0);
  const c = pattern.colorAtObject(object, point(2.5, 0, 0));
  expect(c).toEqual(BLACK);
});

class TestPattern extends Pattern {
  colorAt(point) {
    return color(point.x, point.y, point.z);
  }
}

test("the default pattern transformation", () => {
  const pattern = new TestPattern();
  expect(pattern.transform).toEqual(identity(4));
});

test("assigning a transformation", () => {
  const pattern = new TestPattern();
  pattern.transform = translation(1, 2, 3);
  expect(pattern.transform).toEqual(translation(1, 2, 3));
});

test("pattern with an object transformation", () => {
  const object = sphere();
  object.transform = scaling(2, 2, 2);
  const pattern = new TestPattern();
  const c = pattern.colorAtObject(object, point(2, 3, 4));
  expect(c).toEqual(color(1, 1.5, 2));
});

test("pattern with a pattern transformation", () => {
  const object = sphere();
  const pattern = new TestPattern();
  pattern.transform = scaling(2, 2, 2);
  const c = pattern.colorAtObject(object, point(2, 3, 4));
  expect(c).toEqual(color(1, 1.5, 2));
});

test("pattern with both an object and a pattern transformation", () => {
  const object = sphere();
  object.transform = scaling(2, 2, 2);
  const pattern = new TestPattern();
  pattern.transform = translation(0.5, 1, 1.5);
  const c = pattern.colorAtObject(object, point(2.5, 3, 3.5));
  expect(c).toEqual(color(0.75, 0.5, 0.25));
});

test("gradient linearly interpolates between colors", () => {
  const pattern = gradientPattern(BLACK, WHITE);
  expect(pattern.colorAt(point(0, 0, 0))).toEqual(BLACK);
  expect(pattern.colorAt(point(0.25, 0, 0))).toEqual(color(0.25, 0.25, 0.25));
  expect(pattern.colorAt(point(0.5, 0, 0))).toEqual(color(0.5, 0.5, 0.5));
  expect(pattern.colorAt(point(0.75, 0, 0))).toEqual(color(0.75, 0.75, 0.75));
});

test("ring should extend in both x and z", () => {
  const pattern = ringPattern(BLACK, WHITE);
  expect(pattern.colorAt(point(0, 0, 0))).toEqual(BLACK);
  expect(pattern.colorAt(point(1, 0, 0))).toEqual(WHITE);
  expect(pattern.colorAt(point(0, 0, 1))).toEqual(WHITE);
  // 0.708 = just slightly more than √2/2
  expect(pattern.colorAt(point(0.708, 0, 0.708))).toEqual(WHITE);
});

test("Checkers should repeat in x", () => {
  const pattern = checkersPattern(BLACK, WHITE);
  expect(pattern.colorAt(point(0, 0, 0))).toEqual(BLACK);
  expect(pattern.colorAt(point(0.99, 0, 0))).toEqual(BLACK);
  expect(pattern.colorAt(point(1.01, 0, 0))).toEqual(WHITE);
});

test("Checkers should repeat in y", () => {
  const pattern = checkersPattern(BLACK, WHITE);
  expect(pattern.colorAt(point(0, 0, 0))).toEqual(BLACK);
  expect(pattern.colorAt(point(0, 0.99, 0))).toEqual(BLACK);
  expect(pattern.colorAt(point(0, 1.01, 0))).toEqual(WHITE);
});

test("Checkers should repeat in z", () => {
  const pattern = checkersPattern(BLACK, WHITE);
  expect(pattern.colorAt(point(0, 0, 0))).toEqual(BLACK);
  expect(pattern.colorAt(point(0, 0, 0.99))).toEqual(BLACK);
  expect(pattern.colorAt(point(0, 0, 1.01))).toEqual(WHITE);
});

test.skip("drawing a sphere with a checkerboard pattern", () => {
  const red = color(1, 0, 0);
  const green = color(0, 1, 0);
  const cyan = color(0, 1, 1);
  const magenta = color(1, 0, 1);
  const s1 = sphere();
  const s2 = sphere();
  s1.material.pattern = checkersPattern(red, green);
  s1.material.pattern.transform = translation(0.5, 0.5, 0.5).mul(
    scaling(0.5, 0.5, 0.5)
  );
  s2.material.pattern = checkersPattern(cyan, magenta);
  s2.material.pattern.transform = translation(0.5, 0.5, 0.5);
  s1.transform = translation(-1, 0, 0);
  s2.transform = translation(3, 0, 5);

  const w = world();
  w.objects = [s1, s2];
  w.light = pointLight(point(-10, 10, -10), color(1, 1, 1));

  const c = camera(800, 400, π / 3);
  c.transform = viewTransform(
    point(0, 1.5, -5), // camera location
    point(0, 0, 0), // camera focus
    vector(0, 1, 0) // ???
  );

  const image = c.render(w);

  fs.writeFileSync("balls-n-patterns.ppm", image.toPpm(), "utf-8");
});
